<aside class="cases-sidebar">

    <?php if ($auth) : ?>
        <div class="create-post">
            <a href="/editor/casos" class="btn primary-btn">Nuevo caso</a>
        </div>
    <?php endif ?>

    <div class="finder">
        <h3>Buscar</h3>
        <form id="cases-search-form" class="mio-form"></form>
    </div>

    <div class="categories">
        <h3>Categorías</h3>
        <nav id="cases-categories"></nav>
    </div>
</aside>