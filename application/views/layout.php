<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo empty($description) ? 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.' : $description ?>">

    <meta property="og:title" content="<?php echo empty($title) ? 'Dentista en Castellón - Clínica dental Dentiny' : $title ?>">
    <meta property="og:description" content="<?php echo empty($description) ? 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.' : $description ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:image" content="/build/img/varios/og.jpg">
    <meta property="og:locale:alternate" content="es_ES" />

    <meta property="twitter:card" content="summary">
    <meta property="twitter:url" content="<?php echo 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>">
    <meta property="twitter:title" content="<?php echo empty($title) ? 'Dentista en Castellón - Clínica dental Dentiny' : $title ?>">
    <meta property="twitter:description" content="<?php echo empty($description) ? 'Clínica dental en Castellón. Odontología estética y restauradora. Ortodoncia invisible. Implantología avanzada. Periodoncia. Prótesis. Blanqueamiento dental.' : $description ?>">
    <meta property="twitter:image" content="/build/img/varios/og.jpg">

    <meta name="author" content="Oscar Velilla Abril" />
    <meta name="copyright" content="Dentiny" />

    <title><?php echo empty($title) ? 'Dentista en Castellón - Clínica dental Dentiny' : $title ?></title>

    <link rel="shortcut icon" href="/build/img/iconos/icono-svg.svg">

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