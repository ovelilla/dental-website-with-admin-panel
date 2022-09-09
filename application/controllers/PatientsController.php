<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Patient;

use Error;
use Exception;

class PatientsController {
    public static function readAllPatients(Router $router) {
        $patient = new Patient();

        try {
            $patients = DB::table('patients')
                ->select()
                ->get();

            foreach ($patients as $key => $value) {
                $patients[$key]['age'] = $patient->calculateAge($value['birth_date']);
                $patients[$key]['gender'] = $patients[$key]['gender'];
                $patients[$key]['meet'] = $patients[$key]['meet'];
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
            $insert_data = DB::table('patients')
                ->insert($patient->getData())
                ->execute();

            $patient_data = $patient->getData();

            $patient_data['id'] = $insert_data['insert_id'];
            $patient_data['age'] = $patient->calculateAge($patient->getBirthDate());
            $patient_data['gender'] = $patient->getGender();
            $patient_data['meet'] = $patient->getMeet();

            $response = [
                'status' => 'success',
                'message' => 'Paciente creado correctamente',
                'patient' => $patient_data
            ];
        } catch (Exception | Error $e) {
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
            DB::table('patients')
                ->update($patient->getData())
                ->where('id', '=', $patient->getId())
                ->execute();

            $patient_data = $patient->getData();

            $patient_data['id'] = $patient->getId();
            $patient_data['age'] = $patient->calculateAge($patient->getBirthDate());
            $patient_data['gender'] = $patient->getGender();
            $patient_data['meet'] = $patient->getMeet();

            $response = [
                'status' => 'success',
                'message' => 'Paciente actualizado correctamente',
                'patient' => $patient_data
            ];
        } catch (Exception | Error $e) {
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
}
