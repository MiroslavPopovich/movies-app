import { html, until } from "../lib.js";

export const catalogueViewTemplate = (isLoggedIn, catalogueCards, search) =>
    html`
        <div class="container flex-col catalogue">
            ${search
                ? html`<h1>All Movies containing "${search}"</h1>`
                : html`<h1>All Movies</h1>`}
            ${isLoggedIn
                ? html`<a href="/createArticle" class="btn btn-add">
                      Add Movie
                  </a>`
                : null}
            ${until(catalogueCards, html`<p>Loading...</p>`)}
        </div>
    `;
