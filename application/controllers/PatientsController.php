<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Patient;
use Models\ConsentAccepted;
use Models\Signature;
use Models\History;
use Models\Report;

use Dompdf\Dompdf;

use Error;
use Exception;

class PatientsController {
    public static function readAllPatients(Router $router) {
        try {
            $patients = DB::table('patients')
                ->select()
                ->orderBy('id', 'DESC')
                ->get();

            $consents = DB::table('consents_accepted')
                ->select()
                ->get();

            $signatures = DB::table('signatures')
                ->select()
                ->get();

            $histories = DB::table('histories')
                ->select()
                ->get();

            $reports = DB::table('reports')
                ->select()
                ->get();


            foreach ($patients as $key => $patient) {
                $patients[$key]['age'] = calculateAge($patient['birth_date']);
                $patients[$key]['gender'] = $patients[$key]['gender'];
                $patients[$key]['meet'] = $patients[$key]['meet'];

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

                $patients[$key]['consents'] = $tmp_consents;
                $patients[$key]['history'] = $tmp_history;
                $patients[$key]['history']['reports'] = $tmp_reports;
            }

            $response = [
                'status' => 'success',
                'message' => 'Pacientes obtenidos correctamente',
                'patients' => $patients
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

    public static function createPatient(Router $router) {
        $data = $router->getData();
        $patient = new Patient($data);

        $errors = $patient->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el paciente',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        if (!$patient->getBirthDate()) {
            $patient->setBirthDate(null);
        }

        $patient->setCreatedAt(date('Y-m-d H:i:s'));

        try {
            DB::beginTransaction();

            $patient_insert_data = DB::table('patients')
                ->insert($patient->getData())
                ->execute();

            $consent = new ConsentAccepted();
            $consent->setConsentId(1);
            $consent->setPatientId($patient_insert_data['insert_id']);
            $consent->setCreatedAt(date('Y-m-d H:i:s'));

            $consent_insert_data = DB::table('consents_accepted')
                ->insert($consent->getData())
                ->execute();

            $signature = new Signature();
            $signature->setConsentId($consent_insert_data['insert_id']);
            $signature->setPatientId($patient_insert_data['insert_id']);
            $signature->setSignature($data['signature']);
            $signature->setCreatedAt(date('Y-m-d H:i:s'));

            DB::table('signatures')
                ->insert($signature->getData())
                ->execute();

            DB::commit();

            $patient = self::readPatient($patient_insert_data['insert_id'])['patient'];

            $response = [
                'status' => 'success',
                'message' => 'Paciente creado correctamente',
                'patient' => $patient
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

    public static function updatePatient(Router $router) {
        $data = $router->getData();
        $patient = new Patient($data);

        $errors = $patient->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar el paciente',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $patient_exists = DB::table('patients')
            ->select()
            ->where('id', '=', $patient->getId())
            ->limit(1)
            ->getOne();

        if (!$patient_exists) {
            $response = [
                'status' => 'error',
                'message' => 'El paciente no existe'
            ];
            $router->response($response);
            return;
        }

        $patient->setBirthDate($patient_exists['birth_date']);
        $patient->setCreatedAt($patient_exists['created_at']);

        try {
            DB::beginTransaction();

            DB::table('patients')
                ->update($patient->getData())
                ->where('id', '=', $patient->getId())
                ->execute();

            if (count($data['consents']) > 0) {
                foreach ($data['consents'] as $consent_data) {
                    if ($consent_data['consent_id'] === 1) {
                        $signature = new Signature($consent_data['signature']);

                        DB::table('signatures')
                            ->update($signature->getData())
                            ->where('id', '=', $signature->getId())
                            ->execute();
                    }
                }
            } else {
                $consent = new ConsentAccepted();
                $consent->setConsentId(1);
                $consent->setPatientId($patient->getId());
                $consent->setCreatedAt(date('Y-m-d H:i:s'));

                $consent_insert_data = DB::table('consents_accepted')
                    ->insert($consent->getData())
                    ->execute();

                $signature = new Signature();
                $signature->setConsentId($consent_insert_data['insert_id']);
                $signature->setPatientId($patient->getId());
                $signature->setSignature($data['signature']);
                $signature->setCreatedAt(date('Y-m-d H:i:s'));

                DB::table('signatures')
                    ->insert($signature->getData())
                    ->execute();
            }

            DB::commit();

            $patient = self::readPatient($patient->getId())['patient'];

            $response = [
                'status' => 'success',
                'message' => 'Paciente actualizado correctamente',
                'patient' => $patient
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

    public static function updatePatientActive(Router $router) {
        $data = $router->getData();
        $patient = new Patient($data);

        $patient_exists = DB::table('patients')
            ->select()
            ->where('id', '=', $patient->getId())
            ->limit(1)
            ->getOne();

        $patient->setBirthDate($patient_exists['birth_date']);
        $patient->setCreatedAt($patient_exists['created_at']);

        try {
            DB::table('patients')
                ->update($patient->getData())
                ->where('id', '=', $patient->getId())
                ->execute();

            $patient = self::readPatient($patient->getId())['patient'];

            $response = [
                'status' => 'success',
                'message' => 'Paciente actualizado correctamente',
                'patient' => $patient
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updatePatientHistory(Router $router) {
        $data = $router->getData();

        $history = new History();
        $history->setId($data['history']['id'] ?? null);
        $history->setPatientId($data['history']['patient_id'] ?? $data['id']);
        $history->setExamination($data['history']['examination'] ?? '');

        $reports = [];
        $errors = [];

        foreach ($data['history']['reports'] as $report_data) {
            $report = new Report();

            $report->setId(is_int($report_data['id']) ?? null);
            $report->setPatientId($data['history']['patient_id'] ?? $data['id']);
            $report->setDate($report_data['date']);
            $report->setDescription($report_data['description']);

            $reports[] = $report;

            $error = $report->validate();

            if (!empty($error)) {
                $errors[] = [
                    'id' => $report_data['id'],
                    'errors' => $error
                ];
            }
        }

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar los informes',
                'type' => 'reports',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            DB::beginTransaction();

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

            DB::table('reports')
                ->delete()
                ->where('history_id', '=', $history->getId())
                ->execute();

            foreach ($reports as $report) {
                $report->setHistoryId($history->getId());

                DB::table('reports')
                    ->insert($report->getData())
                    ->execute();
            }

            DB::commit();

            $patient = self::readPatient($data['id'])['patient'];

            $response = [
                'status' => 'success',
                'message' => 'Paciente actualizado correctamente',
                'patient' => $patient
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

    public static function deletePatient(Router $router) {
        $data = $router->getData();
        $patient = new Patient($data);

        try {
            DB::table('patients')
                ->delete()
                ->where('id', '=', $patient->getId())
                ->execute();

            DB::table('consents_accepted')
                ->delete()
                ->where('patient_id', '=', $patient->getId())
                ->execute();

            DB::table('signatures')
                ->delete()
                ->where('patient_id', '=', $patient->getId())
                ->execute();

            DB::table('histories')
                ->delete()
                ->where('patient_id', '=', $patient->getId())
                ->execute();

            DB::table('reports')
                ->delete()
                ->where('patient_id', '=', $patient->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Paciente eliminado correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deletePatients(Router $router) {
        $data = $router->getData();

        $patients_ids = [];
        foreach ($data as $patient) {
            $patients_ids[] = $patient['id'];
        }

        try {
            DB::table('patients')
                ->delete()
                ->whereIn('id', $patients_ids)
                ->execute();

            DB::table('consents_accepted')
                ->delete()
                ->whereIn('id', $patients_ids)
                ->execute();

            DB::table('signatures')
                ->delete()
                ->whereIn('id', $patients_ids)
                ->execute();

            DB::table('histories')
                ->delete()
                ->whereIn('id', $patients_ids)
                ->execute();

            DB::table('reports')
                ->delete()
                ->whereIn('id', $patients_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Pacientes eliminados correctamente',
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
        include __DIR__ . "/../views/templates/patient.php";
        $html = ob_get_contents();
        ob_end_clean();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();

        $name = 'ficha-paciente-dentiny-' . str_pad($data['id'], 5, '0', STR_PAD_LEFT) . '.pdf';

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
