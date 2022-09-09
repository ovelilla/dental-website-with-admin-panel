<nav id="navbar">
    <button aria-label="open menu" aria-expanded="false">
        <span>Clínica</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    <?php include __DIR__ . '/clinic-menu.php' ?>
    
    <button aria-label="open menu" aria-expanded="false">
        <span>Tratamientos</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    <?php include __DIR__ . '/treatments-menu.php' ?>

    <a href="/casos"><span>Casos</span></a>
    <a href="/blog"><span>Blog</span></a>
    <a href="/contacto"><span>Contacto</span></a>
</nav>