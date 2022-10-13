<?php

namespace Models;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
    private string $domain;

    private string $mail_host;
    private string $mail_user;
    private string $mail_pass;
    private string $mail_port;

    private object $data;

    public function __construct($data) {
        $this->domain = $_ENV['DOMAIN'];

        $this->mail_host = $_ENV['MAIL_HOST'];
        $this->mail_user = $_ENV['MAIL_USER'];
        $this->mail_pass = $_ENV['MAIL_PASS'];
        $this->mail_port = $_ENV['MAIL_PORT'];

        $this->data = $data;
    }

    public function sendContactMessage(): void {
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->SMTPAuth = 'ssl';
        $mail->SMPTSecure = true;
        $mail->Host = $this->mail_host;
        $mail->Port = $this->mail_port;
        $mail->Username = $this->mail_user;
        $mail->Password = $this->mail_pass;

        $mail->setFrom('policlinica@dentiny.es', 'dentiny.es');
        $mail->addAddress('policlinica@dentiny.es', 'dentiny.es');
        $mail->addReplyTo($this->data->getEmail(), $this->data->getName());
        $mail->Subject = 'Mensaje de contacto desde la web';

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $title = 'Mensaje de contacto desde la web';

        ob_start();
        include __DIR__ . "/../views/templates/contact.php";
        $content = ob_get_contents();
        ob_end_clean();

        $mail->Body = $content;

        $mail->send();
    }
}
