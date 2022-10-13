<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\CasesPost;
use Models\Image;
use Models\File;

use Exception;
use Error;


class CasesController {
    public static function readPosts(Router $router) {
        $page = $router->getValue('page');
        $limit = $router->getValue('limit');

        try {
            $posts = DB::table('cases_posts')
                ->select('cases_posts.id', 'cases_posts.before_id', 'cases_posts.after_id', 'cases_posts.title', 'cases_posts.alias', 'cases_posts.description', 'cases_posts.created_at', 'users.name AS author', 'cases_categories.alias AS category_alias')
                ->join('users', 'cases_posts.user_id', 'users.id')
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->orderBy('cases_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('cases_posts')
                ->count()
                ->getOne();

            $ids = [];

            foreach ($posts as $post) {
                $ids[] = $post['before_id'];
                $ids[] = $post['after_id'];
            }

            $images = DB::table('images')
                ->select()
                ->whereIn('id', $ids)
                ->get();

            foreach ($posts as $key => $value) {
                $posts[$key]['images'] = [];

                foreach ($images as $image) {
                    if ($value['before_id'] == $image['id']) {
                        $posts[$key]['images']['before'] = $image;
                    }
                    if ($value['after_id'] == $image['id']) {
                        $posts[$key]['images']['after'] = $image;
                    }
                }
            }

            $response = [
                'status' => 'success',
                'message' => 'Casos obtenidos correctamente',
                'posts' => $posts,
                'auth' => $router->session()->get('auth'),
                'total' => $count['COUNT(*)']
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readPostsByCategory(Router $router) {
        $category = $router->getValue('category');
        $page = $router->getValue('page');
        $limit = $router->getValue('limit');

        try {
            $posts = DB::table('cases_posts')
                ->select('cases_posts.id', 'cases_posts.before_id', 'cases_posts.after_id', 'cases_posts.title', 'cases_posts.alias', 'cases_posts.description', 'cases_posts.created_at', 'users.name AS author', 'cases_categories.alias AS category_alias')
                ->join('users', 'cases_posts.user_id', 'users.id')
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->where('cases_categories.alias', '=', $category)
                ->orderBy('cases_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('cases_posts')
                ->count()
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->where('cases_categories.alias', '=', $category)
                ->getOne();

            $ids = [];

            foreach ($posts as $post) {
                $ids[] = $post['before_id'];
                $ids[] = $post['after_id'];
            }

            $images = DB::table('images')
                ->select()
                ->whereIn('id', $ids)
                ->get();

            foreach ($posts as $key => $value) {
                $posts[$key]['images'] = [];

                foreach ($images as $image) {
                    if ($value['before_id'] == $image['id']) {
                        $posts[$key]['images']['before'] = $image;
                    }
                    if ($value['after_id'] == $image['id']) {
                        $posts[$key]['images']['after'] = $image;
                    }
                }
            }

            $response = [
                'status' => 'success',
                'message' => 'Posts obtenidos correctamente',
                'posts' => $posts,
                'auth' => $router->session()->get('auth'),
                'total' => $count['COUNT(*)']
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readPostsBySearch(Router $router) {
        $search = $router->getValue('search');
        $page = $router->getValue('page');
        $limit = $router->getValue('limit');

        $search = '%' . $search . '%';

        try {
            $posts = DB::table('cases_posts')
                ->select('cases_posts.id', 'cases_posts.before_id', 'cases_posts.after_id', 'cases_posts.title', 'cases_posts.alias', 'cases_posts.description', 'cases_posts.created_at', 'users.name AS author', 'cases_categories.alias AS category_alias')
                ->join('users', 'cases_posts.user_id', 'users.id')
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->where('cases_posts.title', 'like', $search)
                ->orWhere('cases_posts.description', 'like', $search)
                ->orWhere('cases_posts.html', 'like', $search)
                ->orderBy('cases_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('cases_posts')
                ->count()
                ->join('cases_categories', 'cases_posts.category_id', 'cases_categories.id')
                ->where('cases_posts.title', 'like', $search)
                ->orWhere('cases_posts.description', 'like', $search)
                ->orWhere('cases_posts.html', 'like', $search)
                ->getOne();

            $ids = [];

            foreach ($posts as $post) {
                $ids[] = $post['before_id'];
                $ids[] = $post['after_id'];
            }

            $images = DB::table('images')
                ->select()
                ->whereIn('id', $ids)
                ->get();

            foreach ($posts as $key => $value) {
                $posts[$key]['images'] = [];

                foreach ($images as $image) {
                    if ($value['before_id'] == $image['id']) {
                        $posts[$key]['images']['before'] = $image;
                    }
                    if ($value['after_id'] == $image['id']) {
                        $posts[$key]['images']['after'] = $image;
                    }
                }
            }

            $response = [
                'status' => 'success',
                'message' => 'Posts obtenidos correctamente',
                'posts' => $posts,
                'auth' => $router->session()->get('auth'),
                'total' => $count['COUNT(*)']
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function readPost(Router $router) {
        $post_alias = $router->getParam('id');

        try {
            $post = DB::table('cases_posts')
                ->select('id', 'cases_posts.before_id', 'cases_posts.after_id', 'title', 'alias', 'html')
                ->where('alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

            $ids = [$post['before_id'], $post['after_id']];

            $images = DB::table('images')
                ->select()
                ->whereIn('id', $ids)
                ->get();

            $post['images'] = [];

            foreach ($images as $image) {
                if ($post['before_id'] == $image['id']) {
                    $post['images']['before'] = $image;
                }
                if ($post['after_id'] == $image['id']) {
                    $post['images']['after'] = $image;
                }
            }

            $response = [
                'status' => 'success',
                'message' => 'Posts obtenidos correctamente',
                'post' => $post,
                'auth' => $router->session()->get('auth')
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function createPost(Router $router) {
        $data = $router->getData();
        $files = $router->getFiles();

        $post = new CasesPost($data);
        $image_before = new Image($data, 'before-alt');
        $image_after = new Image($data, 'after-alt');
        $file_before = new File($files['before'], 'before', '/build/img/casos/' . date('Y-m-d') . '/');
        $file_after = new File($files['after'], 'after', '/build/img/casos/' . date('Y-m-d') . '/');

        $post_errors = $post->validate();
        $image_before_errors = $image_before->validate();
        $image_after_errors = $image_after->validate();
        $file_before_errors = $file_before->validate();
        $file_after_errors = $file_after->validate();

        $errors = array_merge($post_errors, $image_before_errors, $image_after_errors, $file_before_errors, $file_after_errors);

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'message' => 'Error al crear el post',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $post->setAlias($post->getSlugTitle());
        $image_before->setSrc('/build/img/casos/' . date('Y-m-d') . '/' . $file_before->getSlugName());
        $image_after->setSrc('/build/img/casos/' . date('Y-m-d') . '/' . $file_after->getSlugName());

        $exists_post = DB::table('cases_posts')
            ->select()
            ->where('alias', '=', $post->getAlias())
            ->limit(1)
            ->getOne();

        if ($exists_post) {
            $response = [
                'status' => 'error',
                'errors' => [
                    'title' => 'Ya existe un caso con ese título'
                ]
            ];

            $router->response($response);
            return;
        }

        $success_before = $file_before->move();
        $success_after = $file_after->move();

        if (!$success_before || !$success_after) {
            $response = [
                'status' => 'error',
                'message' => 'Error al subir la imagen',
            ];
            $router->response($response);
            return;
        }

        $post->setUserId($router->session()->get('id'));
        $post->setCreatedAt(date('Y-m-d H:i:s'));
        $post->setUpdatedAt(date('Y-m-d H:i:s'));

        try {
            DB::beginTransaction();

            $insert_before_data = DB::table('images')
                ->insert($image_before->getData())
                ->execute();

            $post->setBeforeId($insert_before_data['insert_id']);

            $insert_after_data = DB::table('images')
                ->insert($image_after->getData())
                ->execute();

            $post->setAfterId($insert_after_data['insert_id']);

            DB::table('cases_posts')
                ->insert($post->getData())
                ->execute();

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Caso creado correctamente',
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

    public static function readPostToUpdate(Router $router) {
        $post_alias = $router->getParam('id');

        try {
            $post = DB::table('cases_posts')
                ->select('id', 'before_id', 'after_id', 'category_id', 'title', 'alias', 'description', 'html')
                ->where('alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

            $ids = [$post['before_id'], $post['after_id']];

            $images = DB::table('images')
                ->select()
                ->whereIn('id', $ids)
                ->get();

            $post['images'] = [];

            foreach ($images as $image) {
                if ($post['before_id'] == $image['id']) {
                    $post['images']['before'] = $image;
                }
                if ($post['after_id'] == $image['id']) {
                    $post['images']['after'] = $image;
                }
            }

            $response = [
                'status' => 'success',
                'message' => 'Post obtenido correctamente',
                'post' => $post,
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function updatePost(Router $router) {
        $data = $router->getData();
        $files = $router->getFiles();

        $post = new CasesPost($data);
        $image_before = new Image($data, 'before-alt');
        $image_after = new Image($data, 'after-alt');
        $file_before = new File($files['before'], 'before', '/build/img/casos/' . date('Y-m-d') . '/');
        $file_after = new File($files['after'], 'after', '/build/img/casos/' . date('Y-m-d') . '/');

        $post_errors = $post->validate();
        $image_before_errors = $image_before->validate();
        $image_after_errors = $image_after->validate();

        if ($file_before->getError() === UPLOAD_ERR_OK) {
            $file_before_errors = $file_before->validate();
        } else {
            $file_before_errors = [];
        }

        if ($file_after->getError() === UPLOAD_ERR_OK) {
            $file_after_errors = $file_after->validate();
        } else {
            $file_after_errors = [];
        }

        $errors = array_merge($post_errors, $image_before_errors, $image_after_errors, $file_before_errors, $file_after_errors);

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $post->setAlias($post->getSlugTitle());

        $exists_post_alias = DB::table('cases_posts')
            ->select('alias')
            ->where('alias', '=', $post->getAlias())
            ->limit(1)
            ->getOne();

        $exists_post_id = DB::table('cases_posts')
            ->select('user_id', 'before_id', 'after_id', 'alias', 'created_at')
            ->where('id', '=', $post->getId())
            ->limit(1)
            ->getOne();

        if ($exists_post_alias && $exists_post_alias['alias'] !== $exists_post_id['alias']) {
            $response = [
                'status' => 'error',
                'errors' => [
                    'title', 'Ya existe un post con ese título',
                ]
            ];

            $router->response($response);
            return;
        }

        $post->setUserId($exists_post_id['user_id']);
        $post->setBeforeId($exists_post_id['before_id']);
        $post->setAfterId($exists_post_id['after_id']);
        $post->setCreatedAt($exists_post_id['created_at']);
        $post->setUpdatedAt(date('Y-m-d H:i:s'));

        if ($file_before->getError() === UPLOAD_ERR_OK) {
            $image_before->setSrc('/build/img/casos/' . date('Y-m-d') . '/' . $file_before->getSlugName());

            $success = $file_before->move();

            if (!$success) {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al subir la imagen',
                ];
                $router->response($response);
                return;
            }
        }

        if ($file_after->getError() === UPLOAD_ERR_OK) {
            $image_after->setSrc('/build/img/casos/' . date('Y-m-d') . '/' . $file_after->getSlugName());

            $success = $file_after->move();

            if (!$success) {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al subir la imagen',
                ];
                $router->response($response);
                return;
            }
        }

        try {
            DB::beginTransaction();

            if ($file_before->getError() === UPLOAD_ERR_OK) {
                $insert_data = DB::table('images')
                    ->insert($image_before->getData())
                    ->execute();

                $post->setBeforeId($insert_data['insert_id']);
            }

            if ($file_after->getError() === UPLOAD_ERR_OK) {
                $insert_data = DB::table('images')
                    ->insert($image_after->getData())
                    ->execute();
                $post->setAfterId($insert_data['insert_id']);
            }

            DB::table('cases_posts')
                ->update($post->getData())
                ->where('id', '=', $post->getId())
                ->execute();

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Post actualizado correctamente',
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

    public static function deletePost(Router $router) {
        $data = $router->getData();
        $post = new CasesPost($data);

        try {
            DB::beginTransaction();

            DB::table('cases_posts')
                ->delete()
                ->where('id', '=', $post->getId())
                ->execute();

            DB::table('images')
                ->delete()
                ->whereIn('id', [$post->getBeforeId(), $post->getAfterId()])
                ->execute();

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Post eliminado correctamente',
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

    public static function uploadImage(Router $router) {
        $files = $router->getFiles();

        $tmp_name = $files['image']['tmp_name'];
        $destination = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . '/build/img/casos/' . DIRECTORY_SEPARATOR;
        $name = $files['image']['name'];

        $success = move_uploaded_file($tmp_name, $destination . $name);

        if (!$success) {
            $response = [
                'status' => 'error',
                'message' => 'Error al subir la imagen',
            ];
            $router->response($response);
            return;
        }

        $response = [
            'status' => 'success',
            'message' => 'Imagen subida correctamente',
            'url' => '/build/img/casos/' . $name
        ];

        $router->response($response);
    }
}
