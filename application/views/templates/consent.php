<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consentimiento</title>

    <style>
        * {
            margin: 0;
            padding: 0
        }

        @page {
            margin: 60px 80px !important;
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

        .w-100 {
            width: 100%
        }

        .min-w-100 {
            min-width: 100px
        }

        .float-right {
            float: right
        }

        .mt-10 {
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
            margin-top: 80px
        }

        .mt-100 {
            margin-top: 100px
        }

        .text-xs {
            font-size: 13px;
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

        table {
            border-collapse: collapse
        }

        table.items thead {
            background-color: #f0f0f0;
            border-right: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0
        }

        table.items thead tr th {
            padding: 12px 6px;
            white-space: nowrap;
        }

        table.items tbody {
            border-right: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0
        }

        table.items tbody tr td {
            padding: 8px 6px;
            border-bottom: 1px solid #f0f0f0;
            white-space: nowrap;
        }

        table.items tfoot tr td {
            padding: 8px 6px;
            border-right: 1px solid #f0f0f0;
            border-bottom: 1px solid #f0f0f0;
            white-space: nowrap;
        }

        table.items tfoot tr td:first-child {
            border-bottom: none;
        }

        table.items tfoot tr td:nth-child(3) {
            background-color: #f0f0f0;
        }

        table.items tfoot tr td:nth-child(5) {
            background-color: #f0f0f0;
        }
    </style>
</head>

<body>

    <?php
    $image = __DIR__ . '/../../../public/build/img/varios/logo-black.png';
    $imageData = base64_encode(file_get_contents($image));
    $src = 'data:image/png;base64,' . $imageData;

    if ($data['consent_id'] !== 1) {
        if (!empty($data['representative_name']) && !empty($data['representative_nif'])) {
            $description = str_replace("{intro}", "Yo, " . $data['representative_name'] . " , con DNI " . $data['representative_nif'] . " mayor de edad, en calidad de (representante legal) de " . $data['patient']['name'] . " " . $data['patient']['surname'] . " DECLARO:", $data['consent']['description']);
        } else {
            $description = str_replace("{intro}", "Yo, " . $data['patient']['name'] . " " . $data['patient']['surname'] . " (como paciente), con DNI " . $data['patient']['nif'] . ", mayor de edad DECLARO:", $data['consent']['description']);
        }
        $description = str_replace("{doctor}", $data['doctor']['name'] . " " . $data['doctor']['surname'], $description);
        $description = str_replace("{date}", $data['created_at'], $description);
    } else {
        $description = $data['consent']['description'];
    }
    ?>

    <div class="row text-center">
        <img src="<?php echo $src ?>" width="180px" alt="Logo">
    </div>

    <div class="row mt-60 ">
        <p class="text-md font-bold letter-spacing-1">
            <?php echo $data['consent']['name'] ?>
        </p>
    </div>

    <div class="row mt-20">
        <p class="text-justify leading-snug text-xs">
            <?php echo nl2br($description) ?>
        </p>
    </div>

    <div class="row mt-20 text-right">
        <img src="<?php echo $data['signature']['signature'] ?>" width="300px" alt="Firma">
    </div>
</body>

</html>