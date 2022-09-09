<section class="section blog-header">
    <div class="container">
        <h1>Editor de Casos Dentiny</h1>

        <div class="row">
            <nav>
                <a href="/">Inicio</a>
                <a href="/casos">Casos</a>
                <a href="/editor">Editor</a>
            </nav>

            <a href="/logout" class="logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
                    <path d="M7.5 1v7h1V1h-1z" />
                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" />
                </svg>
            </a>
        </div>
</section>

<section class="section editor">
    <div class="container" id="cases-editor">
        <!-- <form id="case-editor">
            <div class="col">
                <h2>1. Título</h2>
                <p>Máximo 255 caracteres</p>

                <div class="field">
                    <label for="title">Título</label>
                    <input type="text" name="title" id="title" maxlength="255">
                </div>
            </div>

            <div class="col">
                <h2>2. Descripción</h2>
                <p>Máximo 255 caracteres</p>

                <div class="field">
                    <label for="description">Descripción</label>
                    <textarea name="description" id="description" rows="3" maxlength="255"></textarea>
                </div>
            </div>

            <div class="col">
                <h2>3. Categoría</h2>
                <p>Seleccionar la categoría a la que corresponde el post</p>

                <div class="field">
                    <label for="category_id">Categoría</label>
                    <select name="category_id" id="category_id">
                        <option value="" hidden></option>
                        <?php foreach ($categories as $category) : ?>
                            <option value="<?= $category['id'] ?>"><?= $category['name'] ?></option>
                        <?php endforeach ?>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="before">
                    <h2>4. Imagen antes</h2>
                    <p>Imagen antes. Recomendado 750px por 500px</p>

                    <div class="field file">
                        <label for="before">
                            <figure>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" viewBox="0 0 20 17">
                                    <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                </svg>
                            </figure>
                            <span>Selecciona una imagen...</span>
                        </label>

                        <input type="file" name="before" id="before" accept="image/jpeg, image/png">
                    </div>
                </div>

                <div class="after">
                    <h2>5. Imagen despues</h2>
                    <p>Imagen después. Recomendado 750px por 500px</p>

                    <div class="field file">
                        <label for="after">
                            <figure>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" viewBox="0 0 20 17">
                                    <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                </svg>
                            </figure>
                            <span>Selecciona una imagen...</span>
                        </label>

                        <input type="file" name="after" id="after" accept="image/jpeg, image/png">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="before-alt">
                    <h2>6. Descripción imagen antes</h2>
                    <p>Descripción para imagen antes. Máximo 255 caracteres</p>

                    <div class="field">
                        <label for="before-alt">Descripción imagen</label>
                        <input type="text" name="before-alt" id="before-alt" maxlength="255">
                    </div>
                </div>

                <div class="after-alt">
                    <h2>7. Descripción imagen después</h2>
                    <p>Descripción para imagen después. Máximo 255 caracteres</p>

                    <div class="field">
                        <label for="after-alt">Descripción imagen</label>
                        <input type="text" name="after-alt" id="after-alt" maxlength="255">
                    </div>
                </div>
            </div>

            <div class="col">
                <h2>8. Previsualización</h2>
                <p>Vista previa del deslizador antes y después</p>

                <div id="baf-preview" class="field baf-preview"></div>
            </div>

            <div class="col">
                <h2>9. Contenido</h2>
                <p>Contenido principal para el post</p>

                <div class="field">
                    <label for="html">Contenido</label>
                    <textarea name="html" id="html"></textarea>
                </div>
            </div>

            <div class="field">
                <input type="submit" class="btn primary-btn" value="Crear post">
            </div>
        </form> -->
    </div>
</section>