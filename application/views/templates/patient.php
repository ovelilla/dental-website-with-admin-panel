<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paciente</title>

    <style>
        * {
            margin: 0;
            padding: 0
        }

        @page {
            margin: 40px !important;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
        }

        .row {
            clear: both
        }

        .row:after {
            content: ".";
            display: block;
            clear: both;
            visibility: hidden;
            height: 0;
            line-height: 0
        }

        [class*="col-"] {
            float: left;
            margin-left: 2%
        }

        [class*="col-"]:first-child {
            margin-left: 0
        }

        .col-1 {
            width: 6.5%
        }

        .col-2 {
            width: 15%
        }

        .col-3 {
            width: 23.5%
        }

        .col-4 {
            width: 32%
        }

        .col-5 {
            width: 40.5%
        }

        .col-6 {
            width: 49%
        }

        .col-7 {
            width: 57.5%
        }

        .col-8 {
            width: 66%
        }

        .col-9 {
            width: 74.5%
        }

        .col-10 {
            width: 83%
        }

        .col-11 {
            width: 91.5%
        }

        .col-12 {
            width: 100%
        }

        .float-right {
            float: right
        }

        .mt-6 {
            margin-top: 6px
        }

        .mt-10 {
            margin-top: 10px
        }

        .mt-15 {
            margin-top: 10px
        }

        .mt-20 {
            margin-top: 20px
        }

        .mt-30 {
            margin-top: 30px
        }

        .mt-40 {
            margin-top: 40px
        }

        .mt-50 {
            margin-top: 50px
        }

        .mt-60 {
            margin-top: 60px
        }

        .mt-80 {
            margin-top: 100px
        }

        .mt-100 {
            margin-top: 100px
        }

        .px-2 {
            padding-top: 2px;
            padding-bottom: 2px
        }

        .py-4 {
            padding-right: 4px;
            padding-left: 4px
        }

        .text-xs {
            font-size: 12px
        }

        .text-sm {
            font-size: 14px
        }

        .text-md {
            font-size: 16px
        }

        .text-lg {
            font-size: 18px
        }

        .text-right {
            text-align: right
        }

        .text-left {
            text-align: left
        }

        .text-center {
            text-align: center
        }

        .text-justify {
            text-align: justify
        }

        .text-last-left {
            text-align-last: left
        }

        .font-bold {
            font-weight: 700
        }

        .letter-spacing-1 {
            letter-spacing: -1px
        }

        .leading-snug {
            line-height: 1.375
        }

        .leading-normal {
            line-height: 1.5
        }

        .leading-relaxed {
            line-height: 1.625
        }

        .leading-loose {
            line-height: 2
        }

        .uppercase {
            text-transform: uppercase
        }

        .underline {
            text-decoration: underline
        }

        h1 {
            font-size: 28px;
            font-weight: 700;
        }

        h2 {
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase
        }

        h3 {
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase
        }

        .border {
            border: 1px solid #333
        }

        table {
            border-collapse: collapse
        }

        table thead {
            background-color: #f0f0f0;
            border-right: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0
        }

        table thead tr th {
            padding: 12px 6px;
            white-space: nowrap;
        }

        table tbody {
            border-right: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0
        }

        table tbody tr td {
            padding: 8px 6px;
            border-bottom: 1px solid #f0f0f0;
            /* white-space: nowrap; */
        }
    </style>
</head>

<body>

    <?php
    $logo = __DIR__ . '/../../../public/build/img/varios/logo-black.png';
    $logo_data = base64_encode(file_get_contents($logo));
    $logo_src = 'data:image/png;base64,' . $logo_data;

    $teeth = __DIR__ . '/../../../public/build/img/varios/teeth.png';
    $teeth_data = base64_encode(file_get_contents($teeth));
    $teeth_src = 'data:image/png;base64,' . $teeth_data;

    ?>

    <div class="row">
        <h1 class="col-6">
            <img src="<?php echo $logo_src ?>" alt="Logo" width="180px">
        </h1>
        <p class="col-6 text-right text-md">Historia clínica: <?php echo str_pad($data['id'], 5, '0', STR_PAD_LEFT) ?></p>
    </div>

    <div class="row mt-30 px-2 py-4 border">
        <p class="col-12">Paciente: <?php echo $data['name'] . " " . $data['surname'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-4">DNI/NIF: <?php echo $data['nif'] ?></p>
        <p class="col-4">Fecha de nacimiento: <?php echo $data['birth_date'] ?></p>
        <p class="col-4">Género: <?php echo $data['gender'] === 'male' ? 'Hombre' : 'mujer' ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-6">Teléfono: <?php echo $data['phone'] ?></p>
        <p class="col-6">Email: <?php echo $data['email'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-8">Dirección: <?php echo $data['address'] ?></p>
        <p class="col-4">Código postal: <?php echo $data['postcode'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-4">Localidad: <?php echo $data['location'] ?></p>
        <p class="col-4">Provincia: <?php echo $data['province'] ?></p>
        <p class="col-4">País: <?php echo $data['country'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <?php
        $meet = '';
        switch ($data['meet']):
            case 'recommendation':
                $meet = 'Recomendación';
                break;
            case 'social-media':
                $meet = 'Redes sociales';
                break;
            case 'web':
                $meet = 'Web';
                break;
            case 'street':
                $meet = 'Calle';
                break;
            case 'insurance':
                $meet = 'Seguro';
                break;
            case 'other':
                $meet = 'Otro';
                break;
        endswitch;
        ?>
        <p class="<?php echo $data['meet'] === 'insurance' ? 'col-6' : 'col-12' ?>">¿Cómo nos ha conocido?: <?php echo $meet ?></p>
        <?php if ($data['meet'] === 'insurance') : ?>
            <p class="col-6">Seguro: <?php echo $data['insurance'] ?></p>
        <?php endif; ?>
    </div>

    <div class="row mt-10">
        <p class="col-12 text-sm font-bold">Anamnesis:</p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-12">Motivo de la consulta: <?php echo $data['reason'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-12">Medicación: <?php echo $data['medication'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-12">Alergias: <?php echo $data['allergies'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <p class="col-12">Enfermedades: <?php echo $data['diseases'] ?></p>
    </div>

    <div class="row mt-6 px-2 py-4 border">
        <?php
        $infectious = '';
        switch ($data['infectious']):
            case 'none':
                $infectious = 'Ninguna';
                break;
            case 'hiv':
                $infectious = 'VIH - Sida';
                break;
            case 'tuberculosis':
                $infectious = 'Tuberculosis';
                break;
            case 'hepatitis_b':
                $infectious = 'Hepatitis B';
                break;
            case 'hepatitis_c':
                $infectious = 'Hepatitis C';
                break;
            case 'hepatitis_d':
                $infectious = 'Hepatitis D';
                break;
            case 'other':
                $infectious = 'Otras';
                break;
        endswitch;
        ?>
        <p class="col-6">Fumador: <?php echo $data['smoker'] === '1' ? 'Sí' : 'No' ?></p>
        <p class="col-6">Enfermedades infecciosas: <?php echo $infectious ?></p>
    </div>

    <div class="row mt-10">
        <p class="col-12 text-sm font-bold">Exploración y plan de tratamiento:</p>
    </div>

    <div class="row mt-6">
        <div class="col-6">
            <img src="<?php echo $teeth_src ?>" alt="Dientes" width="340px">
        </div>

        <div class="col-6 border" style=" height: 230px">
        </div>
    </div>

    <div class="row mt-15 px-2 py-4 border" style="min-height: 150px;">
        <p class="col-12 text-justify"><?php echo nl2br($data['history']['examination']) ?></p>
    </div>

    <div class="row mt-6 px-2 py-4" style="font-size: 8px">
        <p class="col-12 text-justify">Protección de datos personales. Los datos de carácter personal que nos faciliten se incluirán en ficheros manuales y/o automatizados cuya titularidad corresponde a DENTINY, S.C. La finalidad de estos ficheros es facilitar la prestación de los servicios sanitarios solicitados y la gestión administrativa de los datos que contienen. En todo momento el interesado podrá ejercer su derecho de acceso, rectificación, cancelación y oposición de sus datos de carácter personal enviando un email a la dirección de policlinica@dentiny.es, o mediante solicitud escrita, fechada y firmada con indicación de su nombre, apellidos, domicilio y fotocopia del DNI dirigida a DENTINY, S.C., responsable del fichero y su tratamiento, con domicilio en C/ Marqués de la Ensenada 42, 12003 Castellón. Los datos personales serán tratados de forma confidencial de acuerdo con lo dispuesto en la ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales. Puede consultar la información adicional y detallada sobre Protección de Datos Personales solicitándola al personal de recepción o página web.</p>
    </div>

    <div class="row mt-10">
        <div class="col-6 text-center">
            <p class="text-sm font-bold uppercase underline">Titular de los datos</p>
            <?php
            if (isset($data['consents'][0]['signature']['signature'])) :
            ?>
                <img src="<?php echo $data['consents'][0]['signature']['signature'] ?>" width="300px" alt="Firma">
            <?php
            endif;
            ?>

        </div>
    </div>

    <div class="row" style="min-height: 500px;">
        <table class="col-12">
            <thead>
                <tr>
                    <th class="text-left uppercase">Fecha</th>
                    <th class="text-left uppercase">Descripción</th>
                </tr>
            </thead>

            <tbody>
                <?php foreach ($data['history']['reports'] as $report) : ?>
                    <tr>
                        <td class="" style="vertical-align: top; min-width: 80px;"><?php echo $report['date'] ?></td>
                        <td class="" style="width: 100%;"><?php echo nl2br($report['description']) ?></td>
                    </tr>
                <?php endforeach ?>
            </tbody>
        </table>
    </div>
</body>

</html>