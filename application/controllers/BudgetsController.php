<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Budget;
use Models\Budgeted;
use Models\SignatureBudget;
use Models\History;

use Dompdf\Dompdf;

use DateTime;
use Error;
use Exception;

class BudgetsController {
    public static function readPatient($id) {
        try {
            $patient = DB::table('patients')
                ->select()
                ->where('id', '=', $id)
                ->limit(1)
                ->getOne();

            $consents = DB::table('consents_accepted')
                ->select()
                ->where('patient_id', '=', $id)
                ->get();

            $signatures = DB::table('signatures')
                ->select()
                ->where('patient_id', '=', $id)
                ->get();

            $histories = DB::table('histories')
                ->select()
                ->get();

            $reports = DB::table('reports')
                ->select()
                ->get();

            $patient['age'] = calculateAge($patient['birth_date']);
            $patient['gender'] = $patient['gender'];
            $patient['meet'] = $patient['meet'];

            $tmp_consents = [];
            $tmp_history = [];
            $tmp_reports = [];

            foreach ($consents as $consent) {
                if ($consent['patient_id'] === $patient['id']) {
                    foreach ($signatures as $signature) {
                        if ($signature['consent_id'] === $consent['id']) {
                            $consent['signature'] = $signature;
                        }
                    }
                    $tmp_consents[] = $consent;
                }
            }

            foreach ($histories as $history) {
                if ($history['patient_id'] === $patient['id']) {
                    foreach ($reports as $report) {
                        if ($report['history_id'] === $history['id']) {
                            $tmp_reports[] = $report;
                        }
                    }
                    $tmp_history = $history;
                }
            }

            $patient['consents'] = $tmp_consents;
            $patient['history'] = $tmp_history;
            $patient['history']['reports'] = $tmp_reports;

            $response = [
                'status' => 'success',
                'message' => 'Pacientes obtenidos correctamente',
                'patient' => $patient
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        return $response;
    }

    public static function readAllBudgets(Router $router) {
        try {
            $budgets = DB::table('budgets')
                ->select('budgets.*', "CONCAT(patients.name, ' ', patients.surname) AS full_patient_name")
                ->join('patients', 'budgets.patient_id', 'patients.id')
                ->orderBy('budgets.created_at', 'desc')
                ->get();

            foreach ($budgets as $key1 => $budget) {
                $date = new DateTime($budget['created_at']);
                $budgets[$key1]['created_at_original'] = $budget['created_at'];
                $budgets[$key1]['created_at'] = $date->format('d/m/Y');

                $patient = self::readPatient($budget['patient_id'])['patient'];
                $budgets[$key1]['patient'] = $patient;

                $signature = DB::table('signatures_budgets')
                    ->select()
                    ->where('budget_id', '=', $budget['id'])
                    ->limit(1)
                    ->getOne();
                $budgets[$key1]['signature'] = $signature;

                $budgeteds = DB::table('budgeted')
                    ->select()
                    ->where('budget_id', '=', $budget['id'])
                    ->get();

                $budgets[$key1]['budgeteds'] = $budgeteds;

                $total = 0;

                foreach ($budgeteds as $key2 => $budgeted) {
                    $total += $budgeted['total_price'];

                    $treatment = DB::table('treatments')
                        ->select()
                        ->where('id', '=', $budgeted['treatment_id'])
                        ->limit(1)
                        ->getOne();

                    $budgets[$key1]['budgeteds'][$key2]['treatment'] = $treatment;

                    $selected_pieces = DB::table('selected_pieces')
                        ->select('pieces.*')
                        ->join('pieces', 'selected_pieces.piece_id', 'pieces.id')
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->get();

                    $budgets[$key1]['budgeteds'][$key2]['selectedPieces'] = $selected_pieces;

                    $selected_group = DB::table('selected_group')
                        ->select('groups.*')
                        ->join('groups', 'selected_group.group_id', 'groups.id')
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->limit(1)
                        ->getOne();

                    if (empty($selected_group)) {
                        $selected_group = null;
                    }

                    $budgets[$key1]['budgeteds'][$key2]['selectedGroup'] = $selected_group;
                }

                $budgets[$key1]['total'] = number_format($total, 2, ',', '');
            }

            $response = [
                'status' => 'success',
                'message' => 'Presupuestos obtenidos correctamente',
                'budgets' => $budgets
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readBudget($id) {
        try {
            $budget = DB::table('budgets')
                ->select('budgets.*', "CONCAT(patients.name, ' ', patients.surname) AS full_patient_name")
                ->join('patients', 'budgets.patient_id', 'patients.id')
                ->where('budgets.id', '=', $id)
                ->limit(1)
                ->getOne();

            $date = new DateTime($budget['created_at']);
            $budget['created_at_original'] = $budget['created_at'];
            $budget['created_at'] = $date->format('d/m/Y');

            $patient = self::readPatient($budget['patient_id'])['patient'];
            $budget['patient'] = $patient;

            $signature = DB::table('signatures_budgets')
                ->select()
                ->where('budget_id', '=', $budget['id'])
                ->limit(1)
                ->getOne();

            $budget['signature'] = $signature;

            $budgeteds = DB::table('budgeted')
                ->select()
                ->where('budget_id', '=', $budget['id'])
                ->get();

            $budget['budgeteds'] = $budgeteds;

            $total = 0;

            foreach ($budgeteds as $key => $budgeted) {
                $total += $budgeted['total_price'] - $budgeted['total_price'] * $budgeted['discount'] / 100;

                $treatment = DB::table('treatments')
                    ->select()
                    ->where('id', '=', $budgeted['treatment_id'])
                    ->limit(1)
                    ->getOne();

                $budget['budgeteds'][$key]['treatment'] = $treatment;

                $selected_pieces = DB::table('selected_pieces')
                    ->select('pieces.*')
                    ->join('pieces', 'selected_pieces.piece_id', 'pieces.id')
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->get();

                $budget['budgeteds'][$key]['selectedPieces'] = $selected_pieces;

                $selected_group = DB::table('selected_group')
                    ->select('groups.*')
                    ->join('groups', 'selected_group.group_id', 'groups.id')
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->limit(1)
                    ->getOne();

                if (empty($selected_group)) {
                    $selected_group = null;
                }

                $budget['budgeteds'][$key]['selectedGroup'] = $selected_group;
            }

            $budget['total'] = number_format($total, 2, ',', '');

            $response = [
                'status' => 'success',
                'message' => 'Presupuesto obtenido correctamente',
                'budget' => $budget
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        return $response;
    }

    public static function createBudget(Router $router) {
        $data = $router->getData();

        $budget = new Budget();
        $budget->setPatientId($data['patient']['id'] ?? '');
        $budget->setComment($data['comment'] ?? '');
        $budget->setCreatedAt(date('Y-m-d H:i:s'));

        $errors = $budget->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el presupuesto',
                'type' => 'budget',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $budgeteds = [];
        $errors = [];

        foreach ($data['budgeteds'] as $bdgtd) {
            $budgeted = new Budgeted();

            $budgeted->setTreatmentId($bdgtd['treatment']['id'] ?? '');
            $budgeted->setPiece($bdgtd['piece'] ?? '');
            $budgeted->setUnitPrice($bdgtd['unit_price'] ?? 0);
            $budgeted->setDiscount($bdgtd['discount'] ?? 0);
            $budgeted->setTotalPrice($bdgtd['total_price'] ?? 0);
            $budgeted->setSelectedPieces($bdgtd['selectedPieces'] ?? []);
            $budgeted->setSelectedGroup($bdgtd['selectedGroup'] ?? []);

            $budgeteds[] = $budgeted;

            $error = $budgeted->validate();

            if (!empty($error)) {
                $errors[] = [
                    'id' => $bdgtd['id'],
                    'errors' => $error
                ];
            }
        }

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el presupuesto',
                'type' => 'budgeted',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            DB::beginTransaction();

            $insert_budget_data = DB::table('budgets')
                ->insert($budget->getData())
                ->execute();

            foreach ($budgeteds as $budgeted) {
                $budgeted->setBudgetId($insert_budget_data['insert_id']);

                $insert_budgeted_data = DB::table('budgeted')
                    ->insert($budgeted->getData())
                    ->execute();

                if (!empty($budgeted->getSelectedPieces())) {
                    foreach ($budgeted->getSelectedPieces() as $selected_piece) {
                        $piece = [
                            'piece_id' => $selected_piece['id'],
                            'budgeted_id' => $insert_budgeted_data['insert_id']
                        ];

                        DB::table('selected_pieces')
                            ->insert($piece)
                            ->execute();
                    }
                }

                if (!empty($budgeted->getSelectedGroup())) {
                    $group = [
                        'group_id' => $budgeted->getSelectedGroup()['id'],
                        'budgeted_id' => $insert_budgeted_data['insert_id']
                    ];

                    DB::table('selected_group')
                        ->insert($group)
                        ->execute();
                }
            }

            $history = new History();
            $history->setId($data['patient']['history']['id'] ?? null);
            $history->setPatientId($data['patient']['history']['patient_id'] ?? $data['patient']['id']);
            $history->setExamination($data['patient']['history']['examination'] ?? '');

            if ($history->getId()) {
                DB::table('histories')
                    ->update($history->getData())
                    ->where('id', '=', $history->getId())
                    ->execute();
            } else {
                $history_insert_data = DB::table('histories')
                    ->insert($history->getData())
                    ->execute();

                $history->setId($history_insert_data['insert_id']);
            }

            DB::commit();

            $budget = self::readBudget($insert_budget_data['insert_id'])['budget'];

            $response = [
                'status' => 'success',
                'message' => 'Presupuesto creado correctamente',
                'budget' => $budget
            ];
        } catch (Exception | Error $e) {
            DB::rollback();

            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateBudget(Router $router) {
        $data = $router->getData();

        $budget = new Budget();
        $budget->setId($data['id'] ?? null);
        $budget->setPatientId($data['patient']['id'] ?? '');
        $budget->setComment($data['comment'] ?? '');

        $errors = $budget->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el presupuesto',
                'type' => 'budget',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $budgeteds = [];
        $errors = [];

        foreach ($data['budgeteds'] as $bdgtd) {
            $budgeted = new Budgeted();

            $budgeted->setId(is_int($bdgtd['id']) ?? null);
            $budgeted->setBudgetId($budget->getId());
            $budgeted->setTreatmentId($bdgtd['treatment']['id'] ?? '');
            $budgeted->setPiece($bdgtd['piece'] ?? '');
            $budgeted->setUnitPrice($bdgtd['unit_price'] ?? 0);
            $budgeted->setDiscount($bdgtd['discount'] ?? 0);
            $budgeted->setTotalPrice($bdgtd['total_price'] ?? 0);
            $budgeted->setSelectedPieces($bdgtd['selectedPieces'] ?? []);
            $budgeted->setSelectedGroup($bdgtd['selectedGroup'] ?? []);

            $budgeteds[] = $budgeted;

            $error = $budgeted->validate();

            if (!empty($error)) {
                $errors[] = [
                    'id' => $bdgtd['id'],
                    'errors' => $error
                ];
            }
        }

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar el presupuesto',
                'type' => 'budgeted',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $exists_budget = DB::table('budgets')
            ->select('created_at')
            ->where('id', '=', $budget->getId())
            ->limit(1)
            ->getOne();

        if (!$exists_budget) {
            $response = [
                'status' => 'error',
                'message' => 'El presupuesto no existe'
            ];
            $router->response($response);
            return;
        }

        $budget->setCreatedAt($exists_budget['created_at']);

        try {
            DB::beginTransaction();

            DB::table('budgets')
                ->update($budget->getData())
                ->where('id', '=', $budget->getId())
                ->execute();

            DB::table('budgeted')
                ->delete()
                ->where('budget_id', '=', $budget->getId())
                ->execute();

            foreach ($budgeteds as $budgeted) {
                $budgeted->setBudgetId($budget->getId());
                $insert_budgeted_data = DB::table('budgeted')
                    ->insert($budgeted->getData())
                    ->execute();

                DB::table('selected_pieces')
                    ->delete()
                    ->where('budgeted_id', '=', $budgeted->getId())
                    ->execute();

                DB::table('selected_group')
                    ->delete()
                    ->where('budgeted_id', '=', $budgeted->getId())
                    ->execute();

                foreach ($budgeted->getSelectedPieces() as $selected_piece) {
                    $piece = [
                        'piece_id' => $selected_piece['id'],
                        'budgeted_id' => $insert_budgeted_data['insert_id']
                    ];

                    DB::table('selected_pieces')
                        ->insert($piece)
                        ->execute();
                }

                foreach ($budgeted->getSelectedGroup() as $selected_piece) {
                    $group = [
                        'group_id' => $budgeted->getSelectedGroup()['id'],
                        'budgeted_id' => $insert_budgeted_data['insert_id']
                    ];

                    DB::table('selected_group')
                        ->insert($group)
                        ->execute();
                }
            }

            $history = new History();
            $history->setId($data['patient']['history']['id'] ?? null);
            $history->setPatientId($data['patient']['history']['patient_id'] ?? $data['patient']['id']);
            $history->setExamination($data['patient']['history']['examination'] ?? '');

            if ($history->getId()) {
                DB::table('histories')
                    ->update($history->getData())
                    ->where('id', '=', $history->getId())
                    ->execute();
            } else {
                $history_insert_data = DB::table('histories')
                    ->insert($history->getData())
                    ->execute();

                $history->setId($history_insert_data['insert_id']);
            }

            DB::commit();

            $budget = self::readBudget($data['id'])['budget'];

            $response = [
                'status' => 'success',
                'message' => 'Presupuesto actualizado correctamente',
                'budget' => $budget
            ];
        } catch (Exception | Error $e) {
            DB::rollback();

            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteBudget(Router $router) {
        $data = $router->getData();

        try {
            DB::beginTransaction();

            DB::table('budgets')
                ->delete()
                ->where('id', '=', $data['id'])
                ->execute();

            DB::table('budgeted')
                ->delete()
                ->where('budget_id', '=', $data['id'])
                ->execute();

            foreach ($data['budgeteds'] as $budgeted) {
                DB::table('selected_pieces')
                    ->delete()
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->execute();

                DB::table('selected_group')
                    ->delete()
                    ->where('budgeted_id', '=', $budgeted['id'])
                    ->execute();
            }

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Presupuesto eliminado correctamente',
            ];
        } catch (Exception | Error $e) {
            DB::rollback();

            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteBudgets(Router $router) {
        $data = $router->getData();

        try {
            DB::beginTransaction();

            foreach ($data as $budget) {
                DB::table('budgets')
                    ->delete()
                    ->where('id', '=', $budget['id'])
                    ->execute();

                DB::table('budgeted')
                    ->delete()
                    ->where('budget_id', '=', $budget['id'])
                    ->execute();

                foreach ($budget['budgeteds'] as $budgeted) {
                    DB::table('selected_pieces')
                        ->delete()
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->execute();

                    DB::table('selected_group')
                        ->delete()
                        ->where('budgeted_id', '=', $budgeted['id'])
                        ->execute();
                }
            }

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Presupuestos eliminados correctamente',
            ];
        } catch (Exception | Error $e) {
            DB::rollback();

            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readAllPieces(Router $router) {
        try {
            $pieces = DB::table('pieces')
                ->select()
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Piezas obtenidas correctamente',
                'pieces' => $pieces
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readAllGroups(Router $router) {
        try {
            $groups = DB::table('groups')
                ->select()
                ->get();

            foreach ($groups as $key => $group) {
                $groups[$key]['adult'] = [
                    'from' => $group['adult_from'],
                    'to' => $group['adult_to']
                ];
                $groups[$key]['child'] = [
                    'from' => $group['child_from'],
                    'to' => $group['child_to']
                ];

                unset($groups[$key]['adult_from']);
                unset($groups[$key]['adult_to']);
                unset($groups[$key]['child_from']);
                unset($groups[$key]['child_to']);
            }

            $response = [
                'status' => 'success',
                'message' => 'Grupos obtenidos correctamente',
                'groups' => $groups
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
        include __DIR__ . "/../views/templates/budget.php";
        $html = ob_get_contents();
        ob_end_clean();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();

        $name = 'presupuesto-dentiny-' . str_pad($data['id'], 4, '0', STR_PAD_LEFT) . '-' .  date("Y") . '.pdf';

        $base64 = base64_encode($output);

        $response = [
            'status' => 'success',
            'message' => 'PDF generado correctamente',
            'base64' => $base64,
            'fileName' => $name
        ];

        $router->response($response);
    }

    public static function signBudget(Router $router) {
        $data = $router->getData();

        $signatureBudget = new SignatureBudget($data);

        $exists_signature = DB::table('signatures_budgets')
            ->select()
            ->where('budget_id', '=', $signatureBudget->getBudgetId())
            ->limit(1)
            ->getOne();

        try {
            DB::beginTransaction();

            if ($exists_signature) {
                $signatureBudget->setData($exists_signature);
                $signatureBudget->setSignature($data['signature']);

                DB::table('signatures_budgets')
                    ->update($signatureBudget->getData())
                    ->where('budget_id', '=', $signatureBudget->getBudgetId())
                    ->execute();
            } else {
                $signatureBudget->setData($data);
                $signatureBudget->setCreatedAt(date('Y-m-d H:i:s'));

                DB::table('signatures_budgets')
                    ->insert($signatureBudget->getData())
                    ->execute();
            }

            DB::commit();

            $budget = self::readBudget($signatureBudget->getBudgetId())['budget'];

            $response = [
                'status' => 'success',
                'message' => 'Presupuesto firmado correctamente',
                'budget' => $budget,
                'prueba' => 'prueba'
            ];
        } catch (Exception | Error $e) {
            DB::rollback();

            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }
}
