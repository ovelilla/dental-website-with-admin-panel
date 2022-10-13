<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Consent;
use Models\ConsentAccepted;
use Models\Signature;

use Dompdf\Dompdf;

use Error;
use Exception;

class ConsentsController {
    public static function readAllConsents(Router $router) {
        try {
            $consents = DB::table('consents')
                ->select()
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Consentimientos obtenidos correctamente',
                'consents' => $consents
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function createConsent(Router $router) {
        $data = $router->getData();
        $consent = new Consent($data);

        $errors = $consent->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el consentimiento',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            $insert_data = DB::table('consents')
                ->insert($consent->getData())
                ->execute();

            $consent = $consent->getData();

            $consent['id'] = $insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Consentimiento creado correctamente',
                'consent' => $consent
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateConsent(Router $router) {
        $data = $router->getData();
        $consent = new Consent($data);

        $errors = $consent->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar el consentimiento',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            DB::table('consents')
                ->update($consent->getData())
                ->where('id', '=', $consent->getId())
                ->execute();

            $consent_data = $consent->getData();
            $consent_data['id'] = $consent->getId();

            $response = [
                'status' => 'success',
                'message' => 'Consentimiento actualizado correctamente',
                'consent' => $consent_data
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteConsent(Router $router) {
        $data = $router->getData();
        $consent = new Consent($data);

        try {
            DB::table('consents')
                ->delete()
                ->where('id', '=', $consent->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Consentimiento eliminado correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteConsents(Router $router) {
        $data = $router->getData();

        $consents_ids = [];
        foreach ($data as $consent) {
            $consents_ids[] = $consent['id'];
        }

        try {
            DB::table('consents')
                ->delete()
                ->whereIn('id', $consents_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Consentimientos eliminados correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

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

    public static function createConsentAccepted(Router $router) {
        $data = $router->getData();
        
        $consent = new ConsentAccepted();

        $consent->setConsentId($data['consent']['id']);
        $consent->setPatientId($data['patient']['id']);
        $consent->setDoctorId($data['doctor']['id']);
        $consent->setRepresentativeName($data['representative_name']);
        $consent->setRepresentativeNif($data['representative_nif']);
        $consent->setCreatedAt(date('Y-m-d H:i:s'));

        try {
            $consent_insert_data = DB::table('consents_accepted')
                ->insert($consent->getData())
                ->execute();

            $consent_data = $consent->getData();
            $consent_data['id'] = $consent_insert_data['insert_id'];

            $signature = new Signature();
            $signature->setPatientId($data['patient']['id']);
            $signature->setConsentId($consent_insert_data['insert_id']);
            $signature->setSignature($data['signature']);
            $signature->setCreatedAt(date('Y-m-d H:i:s'));

            $signature_insert_data = DB::table('signatures')
                ->insert($signature->getData())
                ->execute();

            $consent_data['signature'] = $signature->getData();
            $consent_data['signature']['id'] = $signature_insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Consentimiento creado correctamente',
                'patient' => self::readPatient($data['patient']['id'])['patient']
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
        include __DIR__ . "/../views/templates/consent.php";
        $html = ob_get_contents();
        ob_end_clean();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();

        $parts = explode(' ', $data['created_at']);

        $name = 'consentimiento-dentiny-' . $data['id'] . '-' . $parts[0] . '.pdf';

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
