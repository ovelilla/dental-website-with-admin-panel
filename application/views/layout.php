<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">
    <meta name="keywords" content="clinica dental castellon, dentista castellon, dentista urgencias, carillas dentales, centro quirúrgico dental, periodoncista, implantes dentales, ortodoncia, ortodoncia invisible">

    <meta property="og:title" content="Clínica dental Castellón | Odontología | Dentiny">
    <meta property="og:description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.dentiny.es/">
    <meta property="og:image" content="/build/img/varios/og.jpg">
    <meta property="og:locale:alternate" content="es_ES" />

    <meta property="twitter:card" content="summary">
    <meta property="twitter:url" content="https://www.dentiny.es/">
    <meta property="twitter:title" content="Clínica dental Castellón | Odontología | Dentiny">
    <meta property="twitter:description" content="Odontología Estética y Restauradora. Tac dental 3D. Implantologia avanzada. Ortodoncia invisible. Periodoncia. Protesis. Blanqueamiento.">
    <meta property="twitter:image" content="/build/img/varios/og.jpg">

    <meta name="author" content="Oscar Velilla Abril" />
    <meta name="copyright" content="Oscar Velilla Abril" />

    <title>Clínica dental Castellón | Odontología | Dentiny<?php echo empty($title) ? '' : ' | ' . $title ?></title>

    <link rel="shortcut icon" href="/build/img/iconos/icono-svg.svg">

    <!-- <link rel="icon" type="image/png" href="/build/img/iconos/icono16-blue.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/build/img/iconos/icono32-blue.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/build/img/iconos/icono96-blue.png" sizes="96x96">

    <link rel="apple-touch-icon" href="/build/img/iconos/icono120-blue.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/build/img/iconos/icono152-blue.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/build/img/iconos/icono167-blue.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/build/img/iconos/icono180-blue.png"> -->

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