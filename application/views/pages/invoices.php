<section class="section blog-header">
    <div class="container">
        <h1>Facturas</h1>

        <div class="row">
            <nav>
                <a href="/">Inicio</a>
                <a href="/admin">Dashboard</a>
                <a href="/admin/facturas">Facturas</a>
            </nav>

            <a href="/logout" class="logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
                    <path d="M7.5 1v7h1V1h-1z" />
                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" />
                </svg>
            </a>
        </div>
</section>

<section class="section admin">
    <div class="container">
        <div class="row">
            <form id="invoices-search" class="mio-form search" novalidate></form>
        </div>

        <div id="invoices-table"></div>
    </div>
</section>