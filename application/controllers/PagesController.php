<?php

namespace Controllers;

use Models\Router;
use Models\Session;
use Models\DB;
use Models\Contact;
use Models\Email;

use Exception;
use Error;


class PagesController {
    public static function index(Router $router) {
        $posts = DB::table('blog_posts')
            ->select('blog_posts.title', 'blog_posts.alias', 'blog_posts.description', 'images.src', 'images.alt', 'blog_categories.alias AS category_alias')
            ->join('images', 'blog_posts.image_id', 'images.id')
            ->join('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
            ->orderBy('blog_posts.created_at', 'DESC')
            ->limit(3)
            ->get();

        $router->render('pages/index', [
            'title' => 'Página principal',
            'page' => 'index',
            'posts' => $posts
        ]);
    }

    public static function aboutUs(Router $router) {
        $router->render('pages/about-us', [
            'title' => 'Sobre nosotros',
            'page' => 'about-us'
        ]);
    }

    public static function team(Router $router) {
        $router->render('pages/team', [
            'title' => 'Equipo',
            'page' => 'team'
        ]);
    }

    public static function claudia(Router $router) {
        $router->render('pages/claudia', [
            'title' => 'Dra. Claudia',
            'page' => 'claudia'
        ]);
    }

    public static function joan(Router $router) {
        $router->render('pages/joan', [
            'title' => 'Dra. Joan',
            'page' => 'joan'
        ]);
    }

    public static function installations(Router $router) {
        $router->render('pages/installations', [
            'title' => 'Instalaciones',
            'page' => 'installations'
        ]);
    }

    public static function financing(Router $router) {
        $router->render('pages/financing', [
            'title' => 'Financiación',
            'page' => 'financing'
        ]);
    }

    public static function treatments(Router $router) {
        $router->render('pages/treatments', [
            'title' => 'Tratamientos',
            'page' => 'treatments'
        ]);
    }

    public static function contact(Router $router) {
        $router->render('pages/contact', [
            'title' => 'Contacto',
            'page' => 'contact'
        ]);
    }

    public static function sendMessage(Router $router) {
        $data = $router->getData();

        $contact = new Contact($data);

        $errors = $contact->validate();

        if (!empty($errors)) {
            $response = [
                'status' => 'error',
                'errors' => $errors
            ];

            echo json_encode($response);
            return;
        }

        $email = new Email($contact);
        $email->sendContactMessage();

        $response = [
            'status' => 'success',
            'msg' => 'Mensaje enviado correctamente'
        ];
        echo json_encode($response);
    }

    public static function dentalImplants(Router $router) {
        $router->render('pages/treatment-dental-implants', [
            'title' => 'Implantes dentales',
            'page' => 'treatment-dental-implants'
        ]);
    }

    public static function teethWhitening(Router $router) {
        $router->render('pages/treatment-teeth-whitening', [
            'title' => 'Blanqueamiento dental',
            'page' => 'treatment-teeth-whitening'
        ]);
    }

    public static function invisalign(Router $router) {
        $router->render('pages/treatment-invisalign', [
            'title' => 'Ortodoncia invisible',
            'page' => 'treatment-invisalign'
        ]);
    }

    public static function orthodontics(Router $router) {
        $router->render('pages/treatment-orthodontics', [
            'title' => 'Ortodoncia',
            'page' => 'treatment-orthodontics'
        ]);
    }

    public static function periodontics(Router $router) {
        $router->render('pages/treatment-periodontics', [
            'title' => 'Periodoncia',
            'page' => 'treatment-periodontics'
        ]);
    }

    public static function endodontics(Router $router) {
        $router->render('pages/treatment-endodontics', [
            'title' => 'Endodoncia',
            'page' => 'treatment-endodontics'
        ]);
    }

    public static function dentalAesthetics(Router $router) {
        $router->render('pages/treatment-dental-aesthetics', [
            'title' => 'Estética dental',
            'page' => 'treatment-dental-aesthetics'
        ]);
    }

    public static function oralRehabilitationDentalProsthesis(Router $router) {
        $router->render('pages/treatment-oral-rehabilitation-dental-prosthesis', [
            'title' => 'Rehabilitación oral y prótesis dentales',
            'page' => 'treatment-oral-rehabilitation-dental-prosthesis'
        ]);
    }

    public static function dentalSurgery(Router $router) {
        $router->render('pages/treatment-dental-surgery', [
            'title' => 'Cirugía dental',
            'page' => 'treatment-'
        ]);
    }

    public static function pediatricDentistry(Router $router) {
        $router->render('pages/treatment-pediatric-dentistry', [
            'title' => 'Odontopediatría',
            'page' => 'treatment-pediatric-dentistry'
        ]);
    }

    public static function conservativeDentistry(Router $router) {
        $router->render('pages/treatment-conservative-dentistry', [
            'title' => 'Odontología conservadora',
            'page' => 'treatment-conservative-dentistry'
        ]);
    }

    public static function bruxism(Router $router) {
        $router->render('pages/treatment-bruxism', [
            'title' => 'Bruxismo',
            'page' => 'treatment-bruxism'
        ]);
    }

    public static function sleepApneaSnoring(Router $router) {
        $router->render('pages/treatment-sleep-apnea-snoring', [
            'title' => 'Apnea del sueño y roncopatía',
            'page' => 'treatment-sleep-apnea-snoring'
        ]);
    }

    public static function hyaluronicAcid(Router $router) {
        $router->render('pages/treatment-hyaluronic-acid', [
            'title' => 'Acido hialurónico',
            'page' => 'treatment-hyaluronic-acid'
        ]);
    }

    public static function halitosis(Router $router) {
        $router->render('pages/treatment-halitosis', [
            'title' => 'Halitosis',
            'page' => 'treatment-halitosis'
        ]);
    }

    public static function cases(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/cases', [
            'title' => 'Casos',
            'page' => 'cases',
            'auth' => $auth
        ]);
    }

    public static function casesCategory(Router $router) {
        $category_alias = $router->getParam('category');
        $auth = $router->session()->get('auth');

        try {
            $category = DB::table('cases_categories')
                ->select('name', 'alias')
                ->where('alias', '=', $category_alias)
                ->limit(1)
                ->getOne();

            if (empty($category)) {
                $router->redirect('/casos');
            }

            $router->render('pages/cases-category', [
                'title' => 'Casos',
                'page' => 'cases-category',
                'category' => $category,
                'auth' => $auth
            ]);
        } catch (Exception | Error $e) {
            $router->redirect('/casos');
        }
    }

    public static function casesSearch(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/cases-search', [
            'title' => 'Casos',
            'page' => 'cases-search',
            'auth' => $auth
        ]);
    }

    public static function casesPost(Router $router) {
        $post_alias = $router->getParam('post');
        $category_alias = $router->getParam('category');
        $auth = $router->session()->get('auth');

        try {
            $post = DB::table('cases_posts')
                ->select('title', 'alias')
                ->where('alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

            if (empty($post)) {
                $router->redirect('/casos');
            }

            $category = DB::table('cases_categories')
                ->select('name', 'alias')
                ->where('alias', '=', $category_alias)
                ->limit(1)
                ->getOne();

            $router->render('pages/cases-post', [
                'title' => 'Casos',
                'page' => 'cases-post',
                'post' => $post,
                'category' => $category,
                'auth' => $auth
            ]);
        } catch (Exception | Error $e) {
            $router->redirect('/casos');
        }
    }

    public static function casesEditor(Router $router) {
        $router->render('pages/cases-editor', [
            'title' => 'Casos',
            'page' => 'cases-editor',
        ]);
    }

    public static function casesCategories(Router $router) {
        $router->render('pages/cases-categories', [
            'title' => 'Categorías casos',
            'page' => 'cases-categories',
        ]);
    }

    public static function blog(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/blog', [
            'title' => 'Blog',
            'page' => 'blog',
            'auth' => $auth
        ]);
    }

    public static function blogCategory(Router $router) {
        $category_alias = $router->getParam('category');
        $auth = $router->session()->get('auth');

        try {
            $category = DB::table('blog_categories')
                ->select('name', 'alias')
                ->where('alias', '=', $category_alias)
                ->limit(1)
                ->getOne();

            if (empty($category)) {
                $router->redirect('/blog');
            }

            $router->render('pages/blog-category', [
                'title' => 'Blog',
                'page' => 'blog-category',
                'category' => $category,
                'auth' => $auth
            ]);
        } catch (Exception | Error $e) {
            $router->redirect('/blog');
        }
    }

    public static function blogSearch(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/blog-search', [
            'title' => 'Blog',
            'page' => 'blog-search',
            'auth' => $auth
        ]);
    }

    public static function blogPost(Router $router) {
        $post_alias = $router->getParam('post');
        $category_alias = $router->getParam('category');
        $auth = $router->session()->get('auth');

        try {
            $post = DB::table('blog_posts')
                ->select('title', 'alias')
                ->where('alias', '=', $post_alias)
                ->limit(1)
                ->getOne();

            if (empty($post)) {
                $router->redirect('/blog');
            }

            $category = DB::table('blog_categories')
                ->select('name', 'alias')
                ->where('alias', '=', $category_alias)
                ->limit(1)
                ->getOne();

            $router->render('pages/blog-post', [
                'title' => 'Blog',
                'page' => 'blog-post',
                'post' => $post,
                'category' => $category,
                'auth' => $auth
            ]);
        } catch (Exception | Error $e) {
            $router->redirect('/blog');
        }
    }

    public static function blogEditor(Router $router) {
        $router->render('pages/blog-editor', [
            'title' => 'Editor',
            'page' => 'blog-editor',
        ]);
    }

    public static function blogCategories(Router $router) {
        $router->render('pages/blog-categories', [
            'title' => 'Categorías blog',
            'page' => 'blog-categories',
        ]);
    }

    public static function login(Router $router) {
        $auth = $router->session()->get('auth');

        if ($auth) {
            $router->redirect('/admin');
        }

        $router->render('pages/login', [
            'title' => 'Login',
            'page' => 'login'
        ]);
    }

    public static function register(Router $router) {
        $router->render('pages/register', [
            'title' => 'Registro',
            'page' => 'register'
        ]);
    }

    public static function restore(Router $router) {
        $router->render('pages/restore', [
            'title' => 'Restaurar',
            'page' => 'restore'
        ]);
    }

    public static function logout(Router $router) {
        $router->session()->destroy();

        header('Location: /blog');
    }

    public static function admin(Router $router) {
        $router->render('pages/admin', [
            'title' => 'Dashboard',
            'page' => 'admin'
        ]);
    }

    public static function patients(Router $router) {
        $router->render('pages/patients', [
            'title' => 'Pacientes',
            'page' => 'patients'
        ]);
    }

    public static function adminTreatments(Router $router) {
        $router->render('pages/admin-treatments', [
            'title' => 'Tratamientos',
            'page' => 'admin-treatments'
        ]);
    }

    public static function budgets(Router $router) {
        $router->render('pages/budgets', [
            'title' => 'Presupuestos',
            'page' => 'budgets'
        ]);
    }

    public static function invoices(Router $router) {
        $router->render('pages/invoices', [
            'title' => 'Facturas',
            'page' => 'invoices'
        ]);
    }

    public static function consents(Router $router) {
        $router->render('pages/consents', [
            'title' => 'Consentimientos',
            'page' => 'consents'
        ]);
    }

    public static function doctors(Router $router) {
        $router->render('pages/doctors', [
            'title' => 'Doctores',
            'page' => 'doctors'
        ]);
    }

    public static function error(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $response = [
                'post' => 'error',
            ];

            echo json_encode($response);
            return;
        }

        $router->render('pages/error', [
            'title' => 'Página no encontrada',
        ]);
    }
}
