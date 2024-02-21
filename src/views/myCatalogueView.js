import { myCatalogueCardTemplate } from "../templates/myCatalogueCardTemplate.js";
import { catalogueViewTemplate } from "../templates/catalogueViewTemplate.js";
import * as articleService from "../services/articleService.js";
import { paginatorTemplate } from "../templates/paginatorTemplate.js";
import { getUserData, parseQuerystring } from "../services/util.js";
import { html } from "../lib.js";

export async function myCatalogueView(ctx) {
    const auth = getUserData();
    let isLoggedIn = false;
    if (auth) {
        isLoggedIn = true;
    } else {
        return ctx.page.redirect("/login");
    }
    const currentPathName = ctx.pathname;
    const query = parseQuerystring(ctx.querystring);
    const page = Number(query.page || 1);
    const search = "";
    ctx.searchForm.reset();
    ctx.updateNav(search);
    async function loadCatalogueCards(page) {
        const data = await articleService.getArticlesByOwner(auth.id, page);
        const pages = Math.ceil(data.count / articleService.articlesPerPage);
        let currentSection = null;
        if (data.results.length === 0) {
            currentSection = html`<p>No Movies in Catalogue!</p>`;
        } else {
            const cards = data.results.map((article) =>
                myCatalogueCardTemplate(article)
            );
            const paginator = paginatorTemplate(
                currentPathName,
                page,
                pages,
                search
            );
            currentSection = html`<section id="movies" class="flex-row">
                    ${cards}
                </section>
                ${paginator}`; //
        }
        return currentSection;
    }

    const catalogueCards = loadCatalogueCards(page);

    ctx.render(catalogueViewTemplate(isLoggedIn, catalogueCards));
}
