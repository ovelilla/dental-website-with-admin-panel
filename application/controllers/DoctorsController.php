<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Doctor;

use Error;
use Exception;

class DoctorsController {
    public static function readAllDoctors(Router $router) {
        try {
            $doctors = DB::table('doctors')
                ->select()
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Doctores obtenidos correctamente',
                'doctors' => $doctors
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function createDoctor(Router $router) {
        $data = $router->getData();
        $doctor = new Doctor($data);

        $errors = $doctor->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el doctor',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $doctor->setCreatedAt(date('Y-m-d H:i:s'));

        try {
            $insert_data = DB::table('doctors')
                ->insert($doctor->getData())
                ->execute();

            $doctor = $doctor->getData();

            $doctor['id'] = $insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Doctor creado correctamente',
                'doctor' => $doctor
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateDoctor(Router $router) {
        $data = $router->getData();
        $doctor = new Doctor($data);

        $errors = $doctor->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar el doctor',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $doctor_exists = DB::table('doctors')
            ->select()
            ->where('id', '=', $doctor->getId())
            ->limit(1)
            ->getOne();

        if (!$doctor_exists) {
            $response = [
                'status' => 'error',
                'message' => 'El doctor no existe'
            ];
            $router->response($response);
            return;
        }

        $doctor->setCreatedAt($doctor_exists['created_at']);
        
        try {
            DB::table('doctors')
                ->update($doctor->getData())
                ->where('id', '=', $doctor->getId())
                ->execute();

            $doctor_data = $doctor->getData();
            $doctor_data['id'] = $doctor->getId();

            $response = [
                'status' => 'success',
                'message' => 'Doctor actualizado correctamente',
                'doctor' => $doctor_data
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteDoctor(Router $router) {
        $data = $router->getData();
        $doctor = new Doctor($data);

        try {
            DB::table('doctors')
                ->delete()
                ->where('id', '=', $doctor->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Doctor eliminado correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteDoctors(Router $router) {
        $data = $router->getData();

        $doctors_ids = [];
        foreach ($data as $doctor) {
            $doctors_ids[] = $doctor['id'];
        }

        try {
            DB::table('doctors')
                ->delete()
                ->whereIn('id', $doctors_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Doctores eliminados correctamente',
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
