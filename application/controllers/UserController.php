<?php

namespace Controllers;

use Models\Router;
use Models\DB;
use Models\User;

use Exception;
use Error;

class UserController {
    public static function login(Router $router) {
        $auth = $router->session()->get('auth');
        $data = $router->getData();

        if ($auth) {
            $response = [
                'status' => 'error',
                'msg' => 'Already logged in'
            ];
            $router->response($response);
            return;
        }

        $user = new User($data);

        $errors = $user->validateLogin();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            $user_exists = DB::table('users')
                ->select()
                ->where('email', '=', $user->getEmail())
                ->limit(1)
                ->getOne();

            if (!$user_exists) {
                $user->setError('email', 'El usuario no existe');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->setData($user_exists);

            if (!$user->checkPassword($data['password'])) {
                $user->setError('password', 'Password incorrecto');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            if (!$user->getConfirmed()) {
                $user->setError('email', 'El usuario no esta confirmado');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $router->session()->set('id', $user->getId());
            $router->session()->set('name', $user->getName());
            $router->session()->set('email', $user->getEmail());
            $router->session()->set('auth', true);

            $response = [
                'status' => 'success',
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()
                ]
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function register(Router $router) {
        $auth = $router->session()->get('auth');
        $data = $router->getData();

        if ($auth) {
            $response = [
                'status' => 'error',
                'msg' => 'Already logged in'
            ];
            $router->response($response);
            return;
        }

        $values = [
            'name' => 'Dentiny',
            'email' => 'admin@dentiny.es',
            'password' => "V1x!mA93*s%RQ3z#",
        ];

        $user = new User($values);

        $errors = $user->validateRegister();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            $user_exists = DB::table('users')
                ->select()
                ->where('email', '=', $user->getEmail())
                ->limit(1)
                ->getOne();

            if ($user_exists) {
                $user->setError('email', 'El usuario ya está registrado');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->hashPassword();


            DB::table('users')
                ->insert($user->getData())
                ->execute();

            $response = [
                'status' => 'success',
                'msg' => 'Usuario registrado correctamente'
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function confirm(Router $router) {
        $auth = $router->session()->get('auth');
        $data = $router->getData();

        if ($auth) {
            $response = [
                'status' => 'error',
                'msg' => 'Already logged in'
            ];
            $router->response($response);
            return;
        }

        try {
            $user = new User($data);

            $user_exists = DB::table('users')
                ->select()
                ->where('token', '=', $user->getToken())
                ->limit(1)
                ->getOne();

            if (!$user_exists) {
                $user->setError('token', 'Token no válido');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->setData($user_exists);
            $user->setConfirmed('1');
            $user->setToken('');

            DB::table('users')
                ->update($user->getData())
                ->where('id', '=', $user->getId())
                ->execute();

            $response = [
                'user' => $user,
                'status' => 'success',
                'msg' => '¡Cuenta confirmada correctamente!'
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function recover(Router $router) {
        $auth = $router->session()->get('auth');
        $data = $router->getData();

        if ($auth) {
            $response = [
                'status' => 'error',
                'msg' => 'Already logged in'
            ];
            $router->response($response);
            return;
        }

        $values = [
            'email' => 'admin@dentiny.es',
        ];

        $user = new User($values);

        $errors = $user->validateRecover();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            $user_exists = DB::table('users')
                ->select()
                ->where('email', '=', $user->getEmail())
                ->limit(1)
                ->getOne();

            if (!$user_exists) {
                $user->setError('email', 'El usuario no existe');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'user' => $user,
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->setData($user_exists);

            if (!$user->getConfirmed()) {
                $user->setError('email', 'El usuario no esta confirmado');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->createToken();

            DB::table('users')
                ->update($user->getData())
                ->where('id', '=', $user->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'msg' => 'Email enviado correctamente'
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

        $router->response($response);
    }

    public static function restore(Router $router) {
        $auth = $router->session()->get('auth');
        $data = $router->getData();

        if ($auth) {
            $response = [
                'status' => 'error',
                'msg' => 'Already logged in'
            ];
            $router->response($response);
            return;
        }

        $values = [
            'email' => 'admin@dentiny.es',
            'password' => 123456,
        ];

        $user = new User($values);

        $errors = $user->validateRestore();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'user' => $user,
                'errors' => $errors
            ];

            $router->response($response);
            return;
        }

        try {
            // $user_exists = DB::table('users')
            //     ->select()
            //     ->where(['token' => $user->getToken()])
            //     ->limit(1)
            //     ->getOne();

            $user_exists = DB::table('users')
                ->select()
                ->where('email', '=', $user->getEmail())
                ->limit(1)
                ->getOne();

            if (!$user_exists) {
                $user->setError('token', 'Token no válido');
                $errors = $user->getErrors();

                $response = [
                    'status' => 'error',
                    'errors' => $errors
                ];

                $router->response($response);
                return;
            }

            $user->setData($user_exists);
            $user->hashPassword();
            // $user->setToken('');

            DB::table('users')
                ->update($user->getData())
                ->where('id', '=', $user->getId())
                ->execute();

            $response = [
                'status' => 'success',
                'msg' => '¡Contraseña actualizada correctamente!',
            ];
        } catch (Exception | Error $e) {
            $response = [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

        $router->response($response);
    }
}
