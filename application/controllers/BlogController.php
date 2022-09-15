<?php

namespace Controllers;

use Models\Router;
use Models\Session;
use Models\DB;
use Models\BlogPost;
use Models\Image;
use Models\File;

use Error;
use Exception;


class BlogController {
    public static function readPosts(Router $router) {
        $page = $router->getValue('page');
        $limit = $router->getValue('limit');

        try {
            $posts = DB::table('blog_posts')
                ->select('blog_posts.id', 'blog_posts.image_id', 'blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'blog_posts.created_at', 'images.src', 'images.alt', 'users.name AS author', 'blog_categories.alias AS category_alias')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->join('users', 'blog_posts.user_id', 'users.id')
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->orderBy('blog_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('blog_posts')
                ->count()
                ->getOne();

            $response = [
                'status' => 'success',
                'message' => 'Posts obtenidos correctamente',
                'posts' => $posts,
                'auth' => $router->session()->get('auth'),
                'total' => $count['COUNT(*)'],
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
            $posts = DB::table('blog_posts')
                ->select('blog_posts.id', 'blog_posts.image_id', 'blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'blog_posts.created_at', 'images.src', 'images.alt', 'users.name AS author', 'blog_categories.alias AS category_alias')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->join('users', 'blog_posts.user_id', 'users.id')
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->where('blog_categories.alias', '=', $category)
                ->orderBy('blog_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('blog_posts')
                ->count()
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->where('blog_categories.alias', '=', $category)
                ->getOne();

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
            $posts = DB::table('blog_posts')
                ->select('blog_posts.id', 'blog_posts.image_id', 'blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'blog_posts.created_at', 'images.src', 'images.alt', 'users.name AS author', 'blog_categories.alias AS category_alias')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->join('users', 'blog_posts.user_id', 'users.id')
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->where('blog_posts.title', 'like', $search)
                ->orWhere('blog_posts.description', 'like', $search)
                ->orWhere('blog_posts.html', 'like', $search)
                ->orderBy('blog_posts.created_at', 'desc')
                ->paginate($page, $limit)
                ->get();

            $count = DB::table('blog_posts')
                ->count()
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->where('blog_posts.title', 'like', $search)
                ->orWhere('blog_posts.description', 'like', $search)
                ->orWhere('blog_posts.html', 'like', $search)
                ->getOne();

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

    public static function readLatestPosts(Router $router) {
        try {
            $posts = DB::table('blog_posts')
                ->select('blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'blog_posts.created_at', 'images.src', 'images.alt', 'users.name AS author', 'blog_categories.alias AS category_alias')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->join('users', 'blog_posts.user_id', 'users.id')
                ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
                ->orderBy('blog_posts.created_at', 'desc')
                ->limit(5)
                ->get();

            $response = [
                'status' => 'success',
                'message' => 'Posts obtenidos correctamente',
                'posts' => $posts,
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

    public static function readPost(Router $router) {
        $post_alias = $router->getParam('id');

        try {
            $post = DB::table('blog_posts')
                ->select('id', 'image_id', 'title', 'alias', 'html')
                ->where('alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

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

        $post = new BlogPost($data);
        $image = new Image($data, 'alt');
        $file = new File($files['image'], 'image', '/build/img/blog/');

        $post_errors = $post->validate();
        $image_errors = $image->validate();
        $file_errors = $file->validate();

        $errors = array_merge($post_errors, $image_errors, $file_errors);

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
        $image->setSrc($file->getSlugName());

        $exists_post = DB::table('blog_posts')
            ->select()
            ->where('alias', '=', $post->getAlias())
            ->limit(1)
            ->getOne();

        if ($exists_post) {
            $post->setError('title', 'Ya existe un post con ese título');
            $errors = $post->getErrors();

            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        $success = $file->move();

        if (!$success) {
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

            $insert_data = DB::table('images')
                ->insert($image->getData())
                ->execute();

            $post->setImageId($insert_data['insert_id']);

            DB::table('blog_posts')
                ->insert($post->getData())
                ->execute();

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => 'Post creado correctamente',
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
        try {
            $post_alias = $router->getParam('id');

            $post = DB::table('blog_posts')
                ->select('blog_posts.id', 'blog_posts.category_id', 'blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'blog_posts.html', 'images.id AS image_id', 'images.src', 'images.alt')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->where('blog_posts.alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

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

        $post = new BlogPost($data);
        $image = new Image($data, 'alt');
        $file = new File($files['image'], 'image', '/build/img/blog/');

        $post_errors = $post->validate();
        $image_errors = $image->validate();

        if ($file->getError() === UPLOAD_ERR_OK) {
            $file_errors = $file->validate();
        } else {
            $file_errors = [];
        }

        $errors = array_merge($post_errors, $image_errors, $file_errors);

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors,
            ];
            $router->response($response);
            return;
        }

        $post->setAlias($post->getSlugTitle());

        try {
            $exists_post_alias = DB::table('blog_posts')
                ->select('alias')
                ->where('alias', '=', $post->getAlias())
                ->limit(1)
                ->getOne();

            $exists_post_id = DB::table('blog_posts')
                ->select('blog_posts.user_id', 'blog_posts.image_id', 'blog_posts.alias', 'blog_posts.created_at', 'images.src')
                ->join('images', 'blog_posts.image_id', 'images.id')
                ->where('blog_posts.id', '=', $post->getId())
                ->limit(1)
                ->getOne();

            if ($exists_post_alias && $exists_post_alias['alias'] !== $exists_post_id['alias']) {
                $post->setError('title', 'Ya existe un post con ese título');
                $errors = $post->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $post->setUserId($exists_post_id['user_id']);
            $post->setImageId($exists_post_id['image_id']);
            $post->setCreatedAt($exists_post_id['created_at']);
            $post->setUpdatedAt(date('Y-m-d H:i:s'));

            if ($file->getError() === UPLOAD_ERR_OK) {
                $image->setSrc($file->getSlugName());

                $success = $file->move();

                if (!$success) {
                    $response = [
                        'status' => 'error',
                        'message' => 'Error al subir la imagen',
                    ];
                    $router->response($response);
                    return;
                }
            }


            DB::beginTransaction();

            if ($file->getError() === UPLOAD_ERR_OK) {
                $insert_data = DB::table('images')
                    ->insert($image->getData())
                    ->execute();

                $post->setImageId($insert_data['insert_id']);
            }

            DB::table('blog_posts')
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
        $post = new BlogPost($data);

        try {
            DB::beginTransaction();

            DB::table('blog_posts')
                ->delete()
                ->where('id', '=', $post->getId())
                ->execute();

            DB::table('images')
                ->delete()
                ->where('id', '=', $post->getImageId())
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
        $destination = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . '/build/img/blog/' . DIRECTORY_SEPARATOR;
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
            'url' => '/build/img/blog/' . $name
        ];

        $router->response($response);
    }
}
