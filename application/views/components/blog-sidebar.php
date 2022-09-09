<aside class="blog-sidebar">

    <?php if ($auth) : ?>
        <div class="create-post">
            <a href="/editor/blog" class="btn primary-btn">Nuevo post</a>
        </div>
    <?php endif ?>

    <div class="finder">
        <h3>Buscar</h3>
        <form id="blog-search-form" class="mio-form"></form>
    </div>

    <div class="author">
        <h3>Dentiny</h3>
        <div class="image">
            <img src="/build/img/equipo/doctora-claudia-sonrisa.png" alt="Doctora Claudia sonriendo">
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend rhoncus dolor, et tincidunt purus maximus ut. Donec dignissim erat lobortis facilisis porta. Duis ultricies nibh urna, eu feugiat libero tristique a. Suspendisse dictum dapibus dignissim.</p>
    </div>

    <div class="categories">
        <h3>Categorías</h3>
        <nav id="blog-categories"></nav>
    </div>

    <div class="latest-posts">
        <h3>Últimos Posts</h3>
        <div id="blog-latest-posts" class="container"></div>
    </div>
</aside>