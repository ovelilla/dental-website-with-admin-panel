<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Invoice;

use Dompdf\Dompdf;

use DateTime;
use Error;
use Exception;

class InvoicesController {
    public static function readAllInvoices(Router $router) {
        try {
            $invoices = DB::table('invoices')
                ->select()
                ->orderBy('created_at', 'DESC')
                ->get();

            foreach ($invoices as $key1 => $invoice) {
                $date = new DateTime($invoice['created_at']);
                $invoices[$key1]['created_at_format'] = $date->format('d/m/Y');

                $budget = DB::table('budgets')
                    ->select()
                    ->where('id', '=', $invoice['budget_id'])
                    ->limit(1)
                    ->getOne();

                $invoices[$key1]['budget'] = $budget;

                $patient = DB::table('patients')
                    ->select()
                    ->where('id', '=', $budget['patient_id'])
                    ->limit(1)
                    ->getOne();

                $invoices[$key1]['patient'] = $patient;
                $invoices[$key1]['full_patient_name'] = $patient['name'] . ' ' . $patient['surname'];

                $budgeteds = DB::table('budgeted')
                    ->select()
                    ->where('budget_id', '=', $budget['id'])
                    ->get();

                $invoices[$key1]['budget']['budgeteds'] = $budgeteds;

                $total = 0;

                foreach ($budgeteds as $key2 => $budgeted) {
                    $total += $budgeted['total_price'];

                    $treatment = DB::table('treatments')
                        ->select()
                        ->where('id', '=', $budgeted['treatment_id'])
                        ->limit(1)
                        ->getOne();

                    $invoices[$key1]['budget']['budgeteds'][$key2]['treatment'] = $treatment;

                    $selected_pieces = DB::table('selected_pieces')
                        ->select('pieces.*')
                        ->join('pieces', 'selected_pieces.piece_id', 'pieces.id')
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->get();

                    $invoices[$key1]['budget']['budgeteds'][$key2]['selectedPieces'] = $selected_pieces;

                    $selected_group = DB::table('selected_group')
                        ->select('groups.*')
                        ->join('groups', 'selected_group.group_id', 'groups.id')
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->limit(1)
                        ->getOne();

                    if (empty($selected_group)) {
                        $selected_group = null;
                    }

                    $invoices[$key1]['budget']['budgeteds'][$key2]['selectedGroup'] = $selected_group;
                }

                $invoices[$key1]['total'] = number_format($total, 2, ',', '');
            }

            $response = [
                'status' => 'success',
                'message' => 'Facturas obtenidas correctamente',
                'invoices' => $invoices
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readInvoice($id) {
        try {
            $invoice = DB::table('invoices')
                ->select()
                ->where('id', '=', $id)
                ->limit(1)
                ->getOne();

            $date = new DateTime($invoice['created_at']);
            $invoice['created_at_format'] = $date->format('d/m/Y');

            $budget = DB::table('budgets')
                ->select()
                ->where('id', '=', $invoice['budget_id'])
                ->limit(1)
                ->getOne();

            $invoice['budget'] = $budget;

            $patient = DB::table('patients')
                ->select()
                ->where('id', '=', $budget['patient_id'])
                ->limit(1)
                ->getOne();

            $invoice['patient'] = $patient;
            $invoice['full_patient_name'] = $patient['name'] . ' ' . $patient['surname'];

            $budgeteds = DB::table('budgeted')
                ->select()
                ->where('budget_id', '=', $budget['id'])
                ->get();

            $invoice['budget']['budgeteds'] = $budgeteds;

            $total = 0;

            foreach ($budgeteds as $key2 => $budgeted) {
                $total += $budgeted['total_price'];

                $treatment = DB::table('treatments')
                    ->select()
                    ->where('id', '=', $budgeted['treatment_id'])
                    ->limit(1)
                    ->getOne();

                $invoice['budget']['budgeteds'][$key2]['treatment'] = $treatment;

                $selected_pieces = DB::table('selected_pieces')
                    ->select('pieces.*')
                    ->join('pieces', 'selected_pieces.piece_id', 'pieces.id')
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->get();

                $invoice['budget']['budgeteds'][$key2]['selectedPieces'] = $selected_pieces;

                $selected_group = DB::table('selected_group')
                    ->select('groups.*')
                    ->join('groups', 'selected_group.group_id', 'groups.id')
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->limit(1)
                    ->getOne();

                if (empty($selected_group)) {
                    $selected_group = null;
                }

                $invoice['budget']['budgeteds'][$key2]['selectedGroup'] = $selected_group;
            }

            $invoice['total'] = number_format($total, 2, ',', '');

            $response = [
                'status' => 'success',
                'message' => 'Factura obtenida correctamente',
                'invoice' => $invoice
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        return $response;
    }

    public static function createInvoice(Router $router) {
        $data = $router->getData();

        $invoice = new Invoice();

        $invoice_exists = DB::table('invoices')
            ->select()
            ->where('budget_id', '=', $data['id'])
            ->get();

        if ($invoice_exists) {
            $response = [
                'status' => 'error',
                'message' => 'Ya existe una factura para este presupuesto'
            ];
            $router->response($response);
            return;
        }

        $last_invoice = DB::table('invoices')
            ->select()
            ->orderBy('id', 'DESC')
            ->limit(1)
            ->getOne();

        if ($last_invoice) {
            $parts = explode('/', $last_invoice['number']);

            $number = $parts[1] === date('Y') ? intval($parts[0]) + 1 : 1;
            $number = str_pad($number, 4, '0', STR_PAD_LEFT);

            $year = $parts[1] === date('Y') ? $parts[1] : date('Y');

            $number = $number . '/' . $year;
        } else {
            $number = '0001/' . date('Y');
        }

        $invoice->setBudgetId($data['id']);
        $invoice->setNumber($number);
        $invoice->setCreatedAt(date('Y-m-d H:i:s'));

        try {
            $insert_data = DB::table('invoices')
                ->insert($invoice->getData())
                ->execute();

            $invoice = $invoice->getData();

            $invoice['id'] = $insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Factura creada correctamente',
                'invoice' => $invoice
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateInvoice(Router $router) {
        $data = $router->getData();
        $invoice = new Invoice($data);

        $errors = $invoice->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar la factura',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $invoice_exists = DB::table('invoices')
            ->select()
            ->where('id', '=', $data['id'])
            ->limit(1)
            ->getOne();

        if (!$invoice_exists) {
            $response = [
                'status' => 'error',
                'message' => 'No existe la factura'
            ];
            $router->response($response);
            return;
        }

        $created_at = date('Y-m-d H:i:s', strtotime($data['created_at']));

        $invoice->setCreatedAt($created_at);

        try {
            DB::table('invoices')
                ->update($invoice->getData())
                ->where('id', '=', $invoice->getId())
                ->execute();

            $invoice = self::readInvoice($invoice->getId())['invoice'];

            $response = [
                'status' => 'success',
                'message' => 'Factura actualizada correctamente',
                'invoice' => $invoice
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteInvoice(Router $router) {
        $data = $router->getData();
        $invoice = new Invoice($data);

        try {
            DB::table('invoices')
                ->delete()
                ->where('id', '=', $invoice->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Factura eliminada correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteInvoices(Router $router) {
        $data = $router->getData();

        $invoices_ids = [];
        foreach ($data as $invoice) {
            $invoices_ids[] = $invoice['id'];
        }

        try {
            DB::table('invoices')
                ->delete()
                ->whereIn('id', $invoices_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Facturas eliminadas correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function generatePDF(Router $router) {
        $data = $router->getData();

        $dompdf = new Dompdf();

        ob_start();
        include __DIR__ . "/../views/templates/invoice.php";
        $html = ob_get_contents();
        ob_end_clean();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();

        $parts = explode('/', $data['number']);

        $name = 'factura-dentiny-' . $parts[0] . '-' . $parts[1] . '.pdf';

        $base64 = base64_encode($output);

        $response = [
            'status' => 'success',
            'message' => 'PDF generado correctamente',
            'base64' => $base64,
            'fileName' => $name
        ];

        $router->response($response);
    }
}
