<header id="main-header" class="main-header <?php echo $page === 'index' ? 'home' : '' ?>" data-page ="<?php echo $page?>">
    <div class="container">
        <div class="logo">
            <a href="/">
                <img loading="lazy" src="/build/img/varios/logo-blue.png" alt="Logo clinica dental Dentiny">
            </a>
        </div>

        <?php include __DIR__ . '/navbar.php' ?>

        <div class="contact">
            <a href="tel:+34666666666">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.44,13c-.22,0-.45-.07-.67-.12a9.44,9.44,0,0,1-1.31-.39,2,2,0,0,0-2.48,1l-.22.45a12.18,12.18,0,0,1-2.66-2,12.18,12.18,0,0,1-2-2.66L10.52,9a2,2,0,0,0,1-2.48,10.33,10.33,0,0,1-.39-1.31c-.05-.22-.09-.45-.12-.68a3,3,0,0,0-3-2.49h-3a3,3,0,0,0-3,3.41A19,19,0,0,0,18.53,21.91l.38,0a3,3,0,0,0,2-.76,3,3,0,0,0,1-2.25v-3A3,3,0,0,0,19.44,13Zm.5,6a1,1,0,0,1-.34.75,1.05,1.05,0,0,1-.82.25A17,17,0,0,1,4.07,5.22a1.09,1.09,0,0,1,.25-.82,1,1,0,0,1,.75-.34h3a1,1,0,0,1,1,.79q.06.41.15.81a11.12,11.12,0,0,0,.46,1.55l-1.4.65a1,1,0,0,0-.49,1.33,14.49,14.49,0,0,0,7,7,1,1,0,0,0,.76,0,1,1,0,0,0,.57-.52l.62-1.4a13.69,13.69,0,0,0,1.58.46q.4.09.81.15a1,1,0,0,1,.79,1Z" />
                </svg>
                <span>622-348-982</span>
            </a>
            <a href="/contacto" class="btn secondary-btn shadow">Cita Online</a>
        </div>

        <button id="hamburguer" class="hamburguer" aria-label="Menú hamburguesa">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>