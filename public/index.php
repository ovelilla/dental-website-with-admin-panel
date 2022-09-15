<?php 
require '../application/app.php';

use Models\Session;
use Models\Router;

use Controllers\PagesController;
use Controllers\UserController;
use Controllers\CasesController;
use Controllers\CasesCategoriesController;
use Controllers\BlogController;
use Controllers\BlogCategoriesController;
use Controllers\PatientsController;
use Controllers\TreatmentsController;
use Controllers\BudgetsController;
use Controllers\InvoicesController;
use Controllers\ConsentsController;
use Controllers\DoctorsController;


$session = new Session();
$router = new Router($session);

$router->get('/', [PagesController::class, 'index'], false);

$router->get('/sobre-nosotros', [PagesController::class, 'aboutUs'], false);
$router->get('/equipo', [PagesController::class, 'team'], false);
$router->get('/equipo/dra-claudia', [PagesController::class, 'claudia'], false);
$router->get('/equipo/dr-joan', [PagesController::class, 'joan'], false);
$router->get('/instalaciones', [PagesController::class, 'installations'], false);
$router->get('/financiacion', [PagesController::class, 'financing'], false);
$router->get('/tratamientos', [PagesController::class, 'treatments'], false);
$router->get('/login', [PagesController::class, 'login'], false);
$router->get('/contacto', [PagesController::class, 'contact'], false);

$router->get('/tratamientos/implantes-dentales', [PagesController::class, 'dentalImplants'], false);
$router->get('/tratamientos/blanqueamiento-dental', [PagesController::class, 'teethWhitening'], false);
$router->get('/tratamientos/ortodoncia-invisible', [PagesController::class, 'invisalign'], false);
$router->get('/tratamientos/ortodoncia', [PagesController::class, 'orthodontics'], false);
$router->get('/tratamientos/periodoncia', [PagesController::class, 'periodontics'], false);
$router->get('/tratamientos/endodoncia', [PagesController::class, 'endodontics'], false);
$router->get('/tratamientos/estetica-dental', [PagesController::class, 'dentalAesthetics'], false);
$router->get('/tratamientos/rehabilitacion-oral-protesis-dentales', [PagesController::class, 'oralRehabilitationDentalProsthesis'], false);
$router->get('/tratamientos/cirugia-dental', [PagesController::class, 'dentalSurgery'], false);
$router->get('/tratamientos/odontopediatria', [PagesController::class, 'pediatricDentistry'], false);
$router->get('/tratamientos/odontologia-conservadora', [PagesController::class, 'conservativeDentistry'], false);
$router->get('/tratamientos/bruxismo', [PagesController::class, 'bruxism'], false);
$router->get('/tratamientos/apnea-sueno-roncopatia', [PagesController::class, 'sleepApneaSnoring'], false);
$router->get('/tratamientos/acido-hialuronico', [PagesController::class, 'hyaluronicAcid'], false);
$router->get('/tratamientos/halitosis', [PagesController::class, 'halitosis'], false);

$router->get('/casos', [PagesController::class, 'cases'], false);
$router->get('/casos/page/{page}', [PagesController::class, 'cases'], false);
$router->get('/casos/search/{search}', [PagesController::class, 'casesSearch'], false);
$router->get('/casos/search/{search}/page/{page}', [PagesController::class, 'casesSearch'], false);
$router->get('/casos/{category}', [PagesController::class, 'casesCategory'], false);
$router->get('/casos/{category}/page/{page}', [PagesController::class, 'casesCategory'], false);
$router->get('/casos/{category}/{post}', [PagesController::class, 'casesPost'], false);

$router->get('/blog', [PagesController::class, 'blog'], false);
$router->get('/blog/page/{page}', [PagesController::class, 'blog'], false);
$router->get('/blog/search/{search}', [PagesController::class, 'blogSearch'], false);
$router->get('/blog/search/{search}/page/{page}', [PagesController::class, 'blogSearch'], false);
$router->get('/blog/{category}', [PagesController::class, 'blogCategory'], false);
$router->get('/blog/{category}/page/{page}', [PagesController::class, 'blogCategory'], false);
$router->get('/blog/{category}/{post}', [PagesController::class, 'blogPost'], false);

$router->get('/editor/blog', [PagesController::class, 'blogEditor'], true);
$router->get('/editor/blog/{post}', [PagesController::class, 'blogEditor'], true);
$router->get('/editor/casos', [PagesController::class, 'casesEditor'], true);
$router->get('/editor/casos/{case}', [PagesController::class, 'casesEditor'], true);

$router->get('/login', [PagesController::class, 'login'], false);
$router->get('/registro', [PagesController::class, 'register'], false);
$router->get('/restaurar', [PagesController::class, 'restore'], false);
$router->get('/logout', [PagesController::class, 'logout'], false);

$router->get('/admin', [PagesController::class, 'admin'], false);
$router->get('/admin/categorias-blog', [PagesController::class, 'blogCategories'], true);
$router->get('/admin/categorias-casos', [PagesController::class, 'casesCategories'], true);
$router->get('/admin/pacientes', [PagesController::class, 'patients'], true);
$router->get('/admin/tratamientos', [PagesController::class, 'adminTreatments'], true);
$router->get('/admin/presupuestos', [PagesController::class, 'budgets'], true);
$router->get('/admin/facturas', [PagesController::class, 'invoices'], true);
$router->get('/admin/consentimientos', [PagesController::class, 'consents'], true);
$router->get('/admin/doctores', [PagesController::class, 'doctors'], true);

$router->post('/api/contact', [PagesController::class, 'sendMessage']);

$router->post('/api/user/login', [UserController::class, 'login'], false);
$router->post('/api/user/register', [UserController::class, 'register'], false);
$router->post('/api/user/restore', [UserController::class, 'restore'], false);

$router->post('/api/blog', [BlogController::class, 'readPosts'], false);
$router->get('/api/blog/latest', [BlogController::class, 'readLatestPosts'], false);
$router->get('/api/blog/post/{id}', [BlogController::class, 'readPost'], false);
$router->post('/api/blog/category', [BlogController::class, 'readPostsByCategory'], false);
$router->post('/api/blog/search', [BlogController::class, 'readPostsBySearch'], false);
$router->get('/api/blog/categories', [BlogCategoriesController::class, 'readCategoriesInUse'], false);
$router->delete('/api/blog', [BlogController::class, 'deletePost'], false);

$router->post('/api/cases', [CasesController::class, 'readPosts'], false);
$router->get('/api/cases/post/{id}', [CasesController::class, 'readPost'], false);
$router->post('/api/cases/category', [CasesController::class, 'readPostsByCategory'], false);
$router->post('/api/cases/search', [CasesController::class, 'readPostsBySearch'], false);
$router->get('/api/cases/categories', [CasesCategoriesController::class, 'readCategoriesInUse'], false);
$router->delete('/api/cases', [CasesController::class, 'deletePost'], false);

$router->post('/api/editor/blog/create', [BlogController::class, 'createPost'], true);
$router->get('/api/editor/blog/read/{id}', [BlogController::class, 'readPostToUpdate'], true);
$router->post('/api/editor/blog/update', [BlogController::class, 'updatePost'], true);
$router->post('/api/editor/blog/upload/image', [BlogController::class, 'uploadImage'], true);

$router->post('/api/editor/cases/create', [CasesController::class, 'createPost'], true);
$router->get('/api/editor/cases/read/{id}', [CasesController::class, 'readPostToUpdate'], true);
$router->post('/api/editor/cases/update', [CasesController::class, 'updatePost'], true);
$router->post('/api/editor/cases/upload/image', [CasesController::class, 'uploadImage'], true);

$router->get('/api/admin/blog-categories', [BlogCategoriesController::class, 'readAllCategories'], true);
$router->post('/api/admin/blog-categories', [BlogCategoriesController::class, 'createCategory'], true);
$router->put('/api/admin/blog-categories', [BlogCategoriesController::class, 'updateCategory'], true);
$router->delete('/api/admin/blog-categories', [BlogCategoriesController::class, 'deleteCategory'], true);
$router->delete('/api/admin/blog-categories/multiple', [BlogCategoriesController::class, 'deleteCategories'], true);

$router->get('/api/admin/cases-categories', [CasesCategoriesController::class, 'readAllCategories'], true);
$router->post('/api/admin/cases-categories', [CasesCategoriesController::class, 'createCategory'], true);
$router->put('/api/admin/cases-categories', [CasesCategoriesController::class, 'updateCategory'], true);
$router->delete('/api/admin/cases-categories', [CasesCategoriesController::class, 'deleteCategory'], true);
$router->delete('/api/admin/cases-categories/multiple', [CasesCategoriesController::class, 'deleteCategories'], true);

$router->get('/api/admin/patients', [PatientsController::class, 'readAllPatients'], true);
$router->post('/api/admin/patients', [PatientsController::class, 'createPatient'], true);
$router->put('/api/admin/patients', [PatientsController::class, 'updatePatient'], true);
$router->put('/api/admin/patients/active', [PatientsController::class, 'updatePatientActive'], true);
$router->put('/api/admin/patients/history', [PatientsController::class, 'updatePatientHistory'], true);
$router->delete('/api/admin/patients', [PatientsController::class, 'deletePatient'], true);
$router->delete('/api/admin/patients/multiple', [PatientsController::class, 'deletePatients'], true);
$router->post('/api/admin/patients/pdf', [PatientsController::class, 'generatePDF'], true);

$router->get('/api/admin/treatments', [TreatmentsController::class, 'readAllTreatments'], true);
$router->post('/api/admin/treatments', [TreatmentsController::class, 'createTreatment'], true);
$router->put('/api/admin/treatments', [TreatmentsController::class, 'updateTreatment'], true);
$router->delete('/api/admin/treatments', [TreatmentsController::class, 'deleteTreatment'], true);
$router->delete('/api/admin/treatments/multiple', [TreatmentsController::class, 'deleteTreatments'], true);

$router->get('/api/admin/budgets', [BudgetsController::class, 'readAllBudgets'], true);
$router->post('/api/admin/budgets', [BudgetsController::class, 'createBudget'], true);
$router->put('/api/admin/budgets', [BudgetsController::class, 'updateBudget'], true);
$router->delete('/api/admin/budgets', [BudgetsController::class, 'deleteBudget'], true);
$router->delete('/api/admin/budgets/multiple', [BudgetsController::class, 'deleteBudgets'], true);
$router->post('/api/admin/budgets/pdf', [BudgetsController::class, 'generatePDF'], true);

$router->get('/api/admin/pieces', [BudgetsController::class, 'readAllPieces'], true);
$router->get('/api/admin/groups', [BudgetsController::class, 'readAllGroups'], true);

$router->get('/api/admin/invoices', [InvoicesController::class, 'readAllInvoices'], true);
$router->post('/api/admin/invoices', [InvoicesController::class, 'createInvoice'], true);
$router->put('/api/admin/invoices', [InvoicesController::class, 'updateInvoice'], true);
$router->delete('/api/admin/invoices', [InvoicesController::class, 'deleteInvoice'], true);
$router->delete('/api/admin/invoices/multiple', [InvoicesController::class, 'deleteInvoices'], true);
$router->post('/api/admin/invoices/pdf', [InvoicesController::class, 'generatePDF'], true);

$router->get('/api/admin/consents', [ConsentsController::class, 'readAllConsents'], true);
$router->post('/api/admin/consents', [ConsentsController::class, 'createConsent'], true);
$router->put('/api/admin/consents', [ConsentsController::class, 'updateConsent'], true);
$router->delete('/api/admin/consents', [ConsentsController::class, 'deleteConsent'], true);
$router->delete('/api/admin/consents/multiple', [ConsentsController::class, 'deleteConsents'], true);
$router->post('/api/admin/consents/pdf', [ConsentsController::class, 'generatePDF'], true);
$router->post('/api/admin/consents/accepted', [ConsentsController::class, 'createConsentAccepted'], true);

$router->get('/api/admin/doctors', [DoctorsController::class, 'readAllDoctors'], true);
$router->post('/api/admin/doctors', [DoctorsController::class, 'createDoctor'], true);
$router->put('/api/admin/doctors', [DoctorsController::class, 'updateDoctor'], true);
$router->delete('/api/admin/doctors', [DoctorsController::class, 'deleteDoctor'], true);
$router->delete('/api/admin/doctors/multiple', [DoctorsController::class, 'deleteDoctors'], true);

$router->check();
