<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dentiny | <?php echo $title ?? '' ?></title>
</head>

<body style="background-color: #f6f6f6;font-family: sans-serif;font-size: 14px;line-height: 1.4;margin: 0;padding: 0;">
    <span class="preheader" style="color: transparent;display: none;height: 0;max-height: 0;max-width: 0;opacity: 0;overflow: hidden;visibility: hidden;width: 0;">Mensaje de Dentiny</span>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate;width: 100%;background-color: #f6f6f6;">
        <tr>
            <td class="container" style="font-family: sans-serif;font-size: 14px;display: block;max-width: 580px;padding: 10px;width: 580px;margin: 0 auto !important;">
                <div class="content" style="box-sizing: border-box;display: block;margin: 0 auto;max-width: 580px;padding: 10px;">
                    <table role="presentation" class="main" style="border-collapse: separate;width: 100%;background: #fff;border-radius: 3px;">
                        <tr>
                            <td class="wrapper" style="font-family: sans-serif;font-size: 14px;box-sizing: border-box;padding: 20px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;width: 100%;">
                                    <tr>
                                        <td style="font-family: sans-serif;font-size: 14px;">
                                            <p style="margin: 0;margin-bottom: 30px;text-align: center;">
                                                <img src="cid:logo" alt="Logo Dentiny" style="width: 200px;">
                                            </p>
                                            <p style="font-family: sans-serif;font-size: 14px;font-weight: 400;margin: 0;margin-bottom: 15px;font-weight:bold;"><?php echo str_replace('{name}', $patient->getName(), $this->data['email']->getHeader()) ?></p>
                                            <p style="font-family: sans-serif;font-size: 14px;font-weight: 400;margin: 0;margin-bottom: 15px;"><?php echo str_replace('{name}', $patient->getName(), $this->data['email']->getBody()) ?></p>
                                            <p style="font-family: sans-serif;font-size: 14px;font-weight: 400;margin: 0;margin-bottom: 15px;"><?php echo str_replace('{name}', $patient->getName(), $this->data['email']->getFooter()) ?></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                    <div class="footer" style="clear: both;margin-top: 10px;text-align: center;width: 100%;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;width: 100%;">
                            <tr>
                                <td class="content-block" style="font-family: sans-serif;font-size: 12px;vertical-align: top;padding-bottom: 10px;padding-top: 10px;color: #999;text-align: center;">
                                    <span class="apple-link" style="color: #999;font-size: 12px;text-align: center;">dentiny.es</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    </table>

</body>

</html>