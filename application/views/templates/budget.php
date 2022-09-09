<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presupuesto</title>

    <style>
        * {
            margin: 0;
            padding: 0
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            width: 210mm
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

        .mt-100 {
            margin-top: 100px
        }

        .text-lg {
            font-size: 1.125rem
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

        .font-bold {
            font-weight: 700
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

        .wrapper {
            margin: 80px;
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

    $date = DateTime::createFromFormat('d/m/Y', $data['created_at']);
    $format = new IntlDateFormatter('es_ES', IntlDateFormatter::FULL, IntlDateFormatter::FULL, 'Europe/Madrid', IntlDateFormatter::GREGORIAN, "d 'de' LLLL 'de' yyyy");

    $discount = false;
    $subtotal = 0;
    $total = 0;

    foreach ($data['budgeteds'] as $budgeted) {
        if (!$discount && $budgeted['discount'] > 0) {
            $discount = true;
        }
        $subtotal += $budgeted['unit_price'];
        $total += $budgeted['unit_price'] - $budgeted['unit_price'] * $budgeted['discount'] / 100;
    }
    ?>

    <div class="wrapper">
        <div class="row">
            <h1 class="col-6">
                <img src="<?php echo $src ?>" alt="Logo">
            </h1>

            <div class="col-6">
                <h2>Presupuesto</h2>
                <hr class="mt-10">
                <p class="mt-20">PACIENTE: <?php echo $data['full_patient_name'] ?></p>
                <p class="mt-10">FECHA: <?php echo $format->format($date) ?></p>
            </div>
        </div>

        <div class="row mt-60">
            <table class="items col-12">
                <thead>
                    <tr>
                        <th class="text-left">Tratamiento</th>
                        <th class="text-center">Pieza</th>
                        <?php if ($discount) : ?>
                            <th class="text-right">Precio u.</th>
                            <th class="text-center">Descuento</th>
                            <th class="text-right">Total</th>
                        <?php else : ?>
                            <th class="text-right">Precio</th>
                        <?php endif; ?>
                    </tr>
                </thead>

                <tbody>
                    <?php foreach ($data['budgeteds'] as $budgeted) : ?>
                        <tr>
                            <td class="w-100 text-left"><?php echo $budgeted['treatment']['name'] ?></td>
                            <?php if ($discount) : ?>
                                <td class="text-right"><?php echo $budgeted['piece'] ?></td>
                                <td class="text-right"><?php echo number_format($budgeted['unit_price'], 2, ',', '') ?> €</td>
                                <td class="text-center"><?php echo number_format($budgeted['discount'], 2, ',', '') ?> %</td>
                                <td class="text-right"><?php echo number_format($budgeted['total_price'], 2, ',', '') ?> €</td>
                            <?php else : ?>
                                <td class="min-w-100 text-right"><?php echo $budgeted['piece'] ?></td>
                                <td class="min-w-100 text-right"><?php echo number_format($budgeted['total_price'], 2, ',', '') ?> €</td>
                            <?php endif; ?>
                        </tr>
                    <?php endforeach ?>
                </tbody>

                <tfoot>
                    <tr>
                        <?php if ($discount) : ?>
                            <td></td>
                            <td class="text-right font-bold">Total</td>
                            <td class="text-right font-bold"><?php echo number_format($subtotal, 2, ',', '') ?> €</td>
                            <td class="text-right font-bold">Total con dto.</td>
                            <td class="text-right font-bold"><?php echo number_format($total, 2, ',', '') ?> €</td>
                        <?php else : ?>
                            <td></td>
                            <td class="text-right font-bold">Total</td>
                            <td class="text-right font-bold"><?php echo number_format($total, 2, ',', '') ?> €</td>
                        <?php endif; ?>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="row mt-60">
            <div class="col-12 text-left leading-loose">
                <p><?php echo $data['comment'] ?></p>
            </div>
        </div>
    </div>

</body>

</html>