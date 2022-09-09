<?php

namespace Controllers;

use Models\Router;
use Models\Session;
use Models\DB;
use Models\CasesCategory;

use Exception;
use Error;


class CasesCategoriesController {
    public static function readCategoriesInUse(Router $router) {
        try {
            $categories = DB::table('cases_posts')
                ->select('cases_categories.*')
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->groupBy('cases_categories.id')
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Categorías obtenidas correctamente',
                'categories' => $categories
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readAllCategories(Router $router) {
        try {
            $categories = DB::table('cases_categories')
                ->select()
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Categorías obtenidas correctamente',
                'categories' => $categories
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function createCategory(Router $router) {
        $data = $router->getData();
        $category = new CasesCategory($data);

        $errors = $category->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear la categoría',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $exists_category = DB::table('cases_categories')
            ->select()
            ->where('alias', '=', $category->getAlias())
            ->limit(1)
            ->getOne();

        if ($exists_category) {
            $category->setError('name', 'Ya existe una categoría con este nombre');
            $errors = $category->getErrors();

            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            $insert_data = DB::table('cases_categories')
                ->insert($category->getData())
                ->execute();

            $category = $category->getData();
            $category['id'] = $insert_data['insert_id'];

            $response = [
                'status' => 'success',
                'message' => 'Categoría creada correctamente',
                'category' => $category
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updateCategory(Router $router) {
        $data = $router->getData();
        $category = new CasesCategory($data);

        $errors = $category->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al actualizar la categoría',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $exists_category_alias = DB::table('cases_categories')
            ->select('alias')
            ->where('alias', '=', $category->getAlias())
            ->limit(1)
            ->getOne();

        $exists_category_id = DB::table('cases_categories')
            ->select('alias')
            ->where('id', '=', $category->getId())
            ->limit(1)
            ->getOne();

        if ($exists_category_alias && $exists_category_alias['alias'] !== $exists_category_id['alias']) {
            $category->setError('name', 'Ya existe una categoría con este nombre');
            $errors = $category->getErrors();

            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            DB::table('cases_categories')
                ->update($category->getData())
                ->where('id', '=', $category->getId())
                ->execute();

            $categpry_id = $category->getId();
            $category = $category->getData();
            $category['id'] = $categpry_id;

            $response = [
                'status' => 'success',
                'message' => 'Categoría actualizada correctamente',
                'category' => $category
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteCategory(Router $router) {
        $data = $router->getData();
        $category = new CasesCategory($data);

        try {
            DB::table('cases_categories')
                ->delete()
                ->where('id', '=', $category->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Categoría eliminada correctamente',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function deleteCategories(Router $router) {
        $data = $router->getData();

        $categories_ids = [];
        foreach ($data as $category) {
            $categories_ids[] = $category['id'];
        }

        try {
            DB::table('cases_categories')
                ->delete()
                ->whereIn('id', $categories_ids)
                ->execute();

            $response = [
                'status' => 'success',
                'message' => 'Categorías eliminadas correctamente',
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
