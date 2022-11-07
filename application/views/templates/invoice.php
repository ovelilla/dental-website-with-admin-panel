<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura</title>

    <style>
        * {
            margin: 0;
            padding: 0
        }

        @page {
            margin: 80px !important;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
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
    $image = $_SERVER['DOCUMENT_ROOT'] . '/build/img/varios/logo-black.png';
    $imageData = base64_encode(file_get_contents($image));
    $src = 'data:image/png;base64,' . $imageData;

    $formatDate = new DateTime($data['created_at']);

    $discount = false;
    $subtotal = 0;
    $total = 0;

    foreach ($data['budget']['budgeteds'] as $budgeted) {
        if (!$discount && $budgeted['discount'] > 0) {
            $discount = true;
        }
        $subtotal += $budgeted['unit_price'];
        $total += $budgeted['unit_price'] - $budgeted['unit_price'] * $budgeted['discount'] / 100;
    }
    ?>

    <div class="row">
        <h1 class="col-6">
            <img src="<?php echo $src ?>" alt="Logo">
        </h1>
        <h3 class="col-6 text-right uppercase">Factura nº <?php echo $data['number'] ?></h3>
    </div>

    <div class="row mt-20">
        <div class="col-12 leading-snug">
            <p class="text-right"><?php echo $data['full_patient_name'] ?></p>
            <p class="text-right"><?php echo $data['patient']['nif'] ?></p>
            <p class="text-right"><?php echo $data['patient']['address'] ?></p>
            <p class="text-right"><?php echo $data['patient']['postcode'] . " " . $data['patient']['location'] ?> </p>
        </div>
    </div>

    <div class="row">
        <div class="col-12 leading-snug">
            <p class="font-bold uppercase">Dentiny S.C</p>
            <p>J44514651</p>
            <p>C/Marqués de la Ensenada, 42</p>
            <p>12003 Castellón</p>
            <p>Tel. 964 09 97 21</p>
        </div>
    </div>

    <div class="row">
        <div class="col-12 leading-snug">
            <p class="uppercase text-right">Fecha: <?php echo $formatDate->format('d/m/Y'), PHP_EOL ?></p>
        </div>
    </div>

    <div class="row mt-20">
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
                <?php foreach ($data['budget']['budgeteds'] as $budgeted) : ?>
                    <tr>
                        <td class="w-100 text-left"><?php echo $budgeted['treatment']['name'] ?></td>
                        <?php if ($discount) : ?>
                            <td class="text-right"><?php echo $budgeted['piece'] ?></td>
                            <td class="text-right"><?php echo number_format($budgeted['unit_price'], 2, ',', '') ?> €</td>
                            <td class="text-center"><?php  echo $budgeted['discount'] ? number_format($budgeted['discount'], 2, ',', '') . ' %' : '' ?></td>
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

</body>

</html>