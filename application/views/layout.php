<!DOCTYPE html>
<html lang="es-ES">

<head>
    <!-- <meta name="robots" content="noindex"> -->

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">

    <meta property="og:title" content="Clínica dental Castellón | Odontología | Dentiny">
    <meta property="og:description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">
    <meta property="og:type" content="">
    <meta property="og:url" content="">
    <meta property="og:image" content="">

    <meta property="twitter:card" content="">
    <meta property="twitter:url" content="">
    <meta property="twitter:title" content="Clínica dental Castellón | Odontología | Dentiny">
    <meta property="twitter:description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">
    <meta property="twitter:image" content="">

    <title>Clínica dental Castellón | Odontología | Dentiny | <?php echo $title ?></title>

    <link rel="shortcut icon" href="/build/img/iconos/icono16-light.ico">

    <link rel="icon" type="image/png" href="/build/img/iconos/icono16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/build/img/iconos/icono32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/build/img/iconos/icono96.png" sizes="96x96">

    <link rel="apple-touch-icon" href="/build/img/iconos/icono120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/build/img/iconos/icono152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/build/img/iconos/icono167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/build/img/iconos/icono180.png">

    <link rel="preload" href="/build/css/app.css" as="style">
    <link rel="stylesheet" href="/build/css/app.css">

    <meta name="theme-color" content="#f7fafd">
</head>

<body>
    <?php
    include __DIR__ . '/layout/header.php';
    include __DIR__ . '/layout/sidebar.php';
    ?>

    <main>
        <?php echo $content ?>
    </main>

    <?php include __DIR__ . '/layout/footer.php' ?>

    <script src="/build/js/app.js" type="module"></script>
</body>

</html>