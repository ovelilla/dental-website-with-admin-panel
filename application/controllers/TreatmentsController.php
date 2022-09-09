<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\Treatment;

use Error;
use Exception;

class TreatmentsController {
    public static function readAllTreatments(Router $router) {
        try {
            $treatments = DB::table('treatments')
                ->select()
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Tratamientos obtenidos correctamente',
                'treatments' => $treatments
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function createTreatment(Router $router) {
        $data = $router->getData();
        $treatment = new Treatment($data);

        $errors = $treatment->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el tratamiento',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            $insert_data = DB::table('treatments')
                ->insert($treatment->getData())
                ->execute();

            $treatment = $treatment->getData();

            $treatment['id'] = $insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Tratamiento creado correctamente',
                'treatment' => $treatment
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateTreatment(Router $router) {
        $data = $router->getData();
        $treatment = new Treatment($data);

        $errors = $treatment->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar el tratamiento',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        try {
            DB::table('treatments')
                ->update($treatment->getData())
                ->where('id', '=', $treatment->getId())
                ->execute();

            $treatment_data = $treatment->getData();
            $treatment_data['id'] = $treatment->getId();

            $response = [
                'status' => 'success',
                'message' => 'Tratamiento actualizado correctamente',
                'treatment' => $treatment_data
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteTreatment(Router $router) {
        $data = $router->getData();
        $treatment = new Treatment($data);

        try {
            DB::table('treatments')
                ->delete()
                ->where('id', '=', $treatment->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Tratamiento eliminado correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteTreatments(Router $router) {
        $data = $router->getData();

        $treatments_ids = [];
        foreach ($data as $treatment) {
            $treatments_ids[] = $treatment['id'];
        }

        try {
            DB::table('treatments')
                ->delete()
                ->whereIn('id', $treatments_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Tratamientos eliminados correctamente',
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
