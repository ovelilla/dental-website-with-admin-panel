<?php

namespace Controllers;

use Models\Router;
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
            'title' => 'Dentista en Castellón - Clínica dental Dentiny',
            'description' => 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.',
            'page' => 'index',
            'posts' => $posts
        ]);
    }

    public static function aboutUs(Router $router) {
        $router->render('pages/about-us', [
            'title' => 'Sobre nosotros - Clínica dental Castellón - Dentiny',
            'description' => ': Clínica dental en Castellón. Tu dentista en Castellón de confianza. Equipo multidisciplinar. Resultados excepcionales.',
            'page' => 'about-us'
        ]);
    }

    public static function team(Router $router) {
        $router->render('pages/team', [
            'title' => 'Equipo- Clínica dental Castellón - Dentiny',
            'description' => 'En Dentiny, clínica dental en Castellón, contamos con los mejores dentistas de la provincia. Equipo multidisciplinar de especialistas dentales.',
            'page' => 'team'
        ]);
    }

    public static function claudia(Router $router) {
        $router->render('pages/claudia', [
            'title' => 'Dra. Claudia Rada - Clínica dental Castellón - Dentiny',
            'description' => 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.',
            'page' => 'claudia'
        ]);
    }

    public static function joan(Router $router) {
        $router->render('pages/joan', [
            'title' => 'Dr. Joan Llop - Clínica dental Castellón - Dentiny',
            'description' => 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.',
            'page' => 'joan'
        ]);
    }

    public static function aurora(Router $router) {
        $router->render('pages/aurora', [
            'title' => 'Dra. Aurora Deza - Clínica dental Castellón - Dentiny',
            'description' => 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.',
            'page' => 'aurora'
        ]);
    }

    public static function installations(Router $router) {
        $router->render('pages/installations', [
            'title' => 'Instalaciones - Clínica dental Castellón - Dentiny',
            'description' => 'Visita las instalaciones de nuestra clínica dental en Castellón. Instalaciones modernas y acogedoras. Contamos con la mejor tecnología y equipamiento.',
            'page' => 'installations'
        ]);
    }

    public static function financing(Router $router) {
        $router->render('pages/financing', [
            'title' => 'Financiación- Clínica dental Castellón - Dentiny',
            'description' => 'En Dentiny, clínica dental en Castellón sabemos que el coste de algunos tratamientos puede ser elevado, así que, ofrecemos planes flexibles de financiación.',
            'page' => 'financing'
        ]);
    }

    public static function treatments(Router $router) {
        $router->render('pages/treatments', [
            'title' => 'Tratamientos- Clínica dental Castellón - Dentiny',
            'description' => 'En Dentiny, clínica dental en Castellón, disponemos de todos los tratamientos para ofrecerte la mejor atención de la mano de los mejores dentistas.',
            'page' => 'treatments'
        ]);
    }

    public static function contact(Router $router) {
        $router->render('pages/contact', [
            'title' => 'Contacto - Clínica dental Castellón -Dentiny',
            'description' => 'Contacta con nosotros en Dentiny, clínica dental en Castellón. Puedes llamarnos, enviarnos un email o rellenar el formulario de contacto.',
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
            'title' => 'Implantes dentales en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en implantes dentales en Castellón. Tu implante dental al mejor precio. Tornillo de titanio.',
            'page' => 'treatment-dental-implants'
        ]);
    }

    public static function teethWhitening(Router $router) {
        $router->render('pages/treatment-teeth-whitening', [
            'title' => 'Blanqueamiento dental en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en blanqueamiento dental en Castellón. Aclarar el color de los dientes, elimina las manchas y la decoloración al mejor precio.',
            'page' => 'treatment-teeth-whitening'
        ]);
    }

    public static function invisalign(Router $router) {
        $router->render('pages/treatment-invisalign', [
            'title' => 'Ortodoncia invisible en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en ortodoncia invisible en Castellón. Alineadores invisibles al mejor precio. Mejora la estética de tu sonrisa.',
            'page' => 'treatment-invisalign'
        ]);
    }

    public static function orthodontics(Router $router) {
        $router->render('pages/treatment-orthodontics', [
            'title' => 'Ortodoncia brackets en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en ortodoncia brackets en Castellón. Brackets metálicos al mejor precio. Ortodoncia convencional para niños y adultos.',
            'page' => 'treatment-orthodontics'
        ]);
    }

    public static function periodontics(Router $router) {
        $router->render('pages/treatment-periodontics', [
            'title' => 'Especialistas en Periodoncia en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en periodoncia en Castellón. Tratamiento de la enfermedad periodontal al mejor precio. Elimina la inflamación de las encías.',
            'page' => 'treatment-periodontics'
        ]);
    }

    public static function endodontics(Router $router) {
        $router->render('pages/treatment-endodontics', [
            'title' => 'Especialistas en Endodoncia en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en endodoncia en Castellón. Tratamiento de la pulpa dental al mejor precio. Elimina el dolor de muelas y dientes.',
            'page' => 'treatment-endodontics'
        ]);
    }

    public static function dentalAesthetics(Router $router) {
        $router->render('pages/treatment-dental-aesthetics', [
            'title' => 'Estética dental en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en estética dental en Castellón. Mejora la estética de tu sonrisa al mejor precio. Blanqueamiento dental, carillas, coronas.',
            'page' => 'treatment-dental-aesthetics'
        ]);
    }

    public static function oralRehabilitationDentalProsthesis(Router $router) {
        $router->render('pages/treatment-oral-rehabilitation-dental-prosthesis', [
            'title' => 'Prótesis dentales en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en prótesis dentales en Castellón. Prótesis fija, prótesis removible, prótesis dental sobre implantes, prótesis sobre dientes.',
            'page' => 'treatment-oral-rehabilitation-dental-prosthesis'
        ]);
    }

    public static function dentalSurgery(Router $router) {
        $router->render('pages/treatment-dental-surgery', [
            'title' => 'Cirugía dental en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en cirugía dental en Castellón. Extracción de dientes, cirugía de encías, cirugía de implantes, regeneración ósea.',
            'page' => 'treatment-'
        ]);
    }

    public static function pediatricDentistry(Router $router) {
        $router->render('pages/treatment-pediatric-dentistry', [
            'title' => 'Especialistas en odontopediatría en Castellón - Dentiny',
            'description' => 'Clínica dental infantil especializada en odontopediatría en Castellón. Dentista para niños y niñas. Salud bucodental para tus hijos al mejor precio.',
            'page' => 'treatment-pediatric-dentistry'
        ]);
    }

    public static function conservativeDentistry(Router $router) {
        $router->render('pages/treatment-conservative-dentistry', [
            'title' => 'Odontología conservadora en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en odontología conservadora en Castellón. Tratamiento de caries, fisuras, fracturas, endodoncia, periodoncia, al mejor precio.',
            'page' => 'treatment-conservative-dentistry'
        ]);
    }

    public static function bruxism(Router $router) {
        $router->render('pages/treatment-bruxism', [
            'title' => 'Especialistas en Bruxismo en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en bruxismo en Castellón. Elimina el dolor al mejor precio. Tratamiento con férulas rígidas de tipo Michigan o de descarga.',
            'page' => 'treatment-bruxism'
        ]);
    }

    public static function sleepApneaSnoring(Router $router) {
        $router->render('pages/treatment-sleep-apnea-snoring', [
            'title' => 'Apnea del Sueño en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en apnea del sueño en Castellón. Oclusión temporal de la vía respiratoria. Tratamiento para la apnea del sueño y roncopatía.',
            'page' => 'treatment-sleep-apnea-snoring'
        ]);
    }

    public static function hyaluronicAcid(Router $router) {
        $router->render('pages/treatment-hyaluronic-acid', [
            'title' => 'Tratamientos con ácido hialurónico en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en tratamientos con ácido hialurónico en Castellón. Regeneración de encías y la mucosa dental al mejor precio.',
            'page' => 'treatment-hyaluronic-acid'
        ]);
    }

    public static function halitosis(Router $router) {
        $router->render('pages/treatment-halitosis', [
            'title' => 'Especialistas en Halitosis en Castellón - Dentiny',
            'description' => 'Clínica dental especializada en halitosis en Castellón. Elimina el mal aliento al mejor precio. Tratamiento de la halitosis por nuestros especialistas.',
            'page' => 'treatment-halitosis'
        ]);
    }

    public static function cases(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/cases', [
            'title' => 'Casos - Clínica dental Castellón - Dentiny',
            'description' => 'Casos de éxito de nuestros pacientes. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
                'title' => 'Casos- Clínica dental Castellón - Dentiny',
                'description' => 'Casos de éxito de nuestros pacientes. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
            'title' => 'Casos - Clínica dental Castellón - Dentiny',
            'description' => 'Casos de éxito de nuestros pacientes. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
                'title' => 'Casos - Clínica dental Castellón - Dentiny',
                'description' => 'Casos de éxito de nuestros pacientes. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
            'title' => 'Editor Casos - Clínica dental Castellón - Dentiny',
            'page' => 'cases-editor',
        ]);
    }

    public static function casesCategories(Router $router) {
        $router->render('pages/cases-categories', [
            'title' => 'Categorías casos - Clínica dental Castellón - Dentiny',
            'page' => 'cases-categories',
        ]);
    }

    public static function blog(Router $router) {
        $auth = $router->session()->get('auth');

        $router->render('pages/blog', [
            'title' => 'Blog - Clínica dental Castellón - Dentiny',
            'description' => 'Blog de odontología. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
                'title' => 'Blog - Clínica dental Castellón - Dentiny',
                'description' => 'Blog de odontología. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
            'title' => 'Blog - Clínica dental Castellón - Dentiny',
            'description' => 'Blog de odontología. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
                'title' => 'Blog - Clínica dental Castellón - Dentiny',
                'description' => 'Blog de odontología. Tratamientos de odontología conservadora, estética dental, periodoncia, endodoncia, prótesis dental, cirugía dental.',
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
            'title' => 'Editor Blog - Clínica dental Castellón - Dentiny',
            'page' => 'blog-editor',
        ]);
    }

    public static function blogCategories(Router $router) {
        $router->render('pages/blog-categories', [
            'title' => 'Categorías Blog - Clínica dental Castellón - Dentiny',
            'page' => 'blog-categories',
        ]);
    }

    public static function login(Router $router) {
        $auth = $router->session()->get('auth');

        if ($auth) {
            $router->redirect('/admin');
        }

        $router->render('pages/login', [
            'title' => 'Login - Clínica dental Castellón - Dentiny',
            'page' => 'login'
        ]);
    }

    public static function register(Router $router) {
        $router->render('pages/register', [
            'title' => 'Registro - Clínica dental Castellón - Dentiny',
            'page' => 'register'
        ]);
    }

    public static function restore(Router $router) {
        $router->render('pages/restore', [
            'title' => 'Restaurar - Clínica dental Castellón - Dentiny',
            'page' => 'restore'
        ]);
    }

    public static function logout(Router $router) {
        $router->session()->destroy();

        header('Location: /');
    }

    public static function admin(Router $router) {
        $router->render('pages/admin', [
            'title' => 'Dashboard - Clínica dental Castellón - Dentiny',
            'page' => 'admin'
        ]);
    }

    public static function patients(Router $router) {
        $router->render('pages/patients', [
            'title' => 'Pacientes - Clínica dental Castellón - Dentiny',
            'page' => 'patients'
        ]);
    }

    public static function adminTreatments(Router $router) {
        $router->render('pages/admin-treatments', [
            'title' => 'Tratamientos - Clínica dental Castellón - Dentiny',
            'page' => 'admin-treatments'
        ]);
    }

    public static function budgets(Router $router) {
        $router->render('pages/budgets', [
            'title' => 'Presupuestos - Clínica dental Castellón - Dentiny',
            'page' => 'budgets'
        ]);
    }

    public static function invoices(Router $router) {
        $router->render('pages/invoices', [
            'title' => 'Facturas - Clínica dental Castellón - Dentiny',
            'page' => 'invoices'
        ]);
    }

    public static function consents(Router $router) {
        $router->render('pages/consents', [
            'title' => 'Consentimientos - Clínica dental Castellón - Dentiny',
            'page' => 'consents'
        ]);
    }

    public static function doctors(Router $router) {
        $router->render('pages/doctors', [
            'title' => 'Doctores - Clínica dental Castellón - Dentiny',
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
            'title' => 'Página no encontrada - Clínica dental Castellón - Dentiny',
            'page' => 'error'
        ]);
    }
}
