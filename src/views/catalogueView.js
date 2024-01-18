import { catalogueViewTemplate } from "../templates/catalogueViewTemplate.js";
import { catalogueCardTemplate } from "../templates/catalogueCardTemplate.js";
import { paginatorTemplate } from "../templates/paginatorTemplate.js";
import { getUserData, parseQuerystring } from "../services/util.js";
import * as articleService from "../services/articleService.js";
import { html } from "../lib.js";

export async function catalogueView(ctx) {
    const auth = getUserData();
    let isLoggedIn = false;
    if (auth) {
        isLoggedIn = true;
    }
    const currentPathName = ctx.pathname;
    const query = parseQuerystring(ctx.querystring);
    const page = Number(query.page || 1);
    const search = query.search || "";
    ctx.searchForm.reset();

    async function loadCatalogueCards(page, search) {
        const data = await articleService.getAllArticles(page, search);
        const pages = Math.ceil(data.count / articleService.articlesPerPage);
        let currentSection = null;
        if (data.results.length === 0) {
            currentSection = html`<p>No Movies in Catalogue!</p>`;
        } else {
            const cards = data.results.map((article) =>
                catalogueCardTemplate(article)
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
                ${paginator}`;
        }
        return currentSection;
    }

    const catalogueCards = loadCatalogueCards(page, search);

    ctx.render(catalogueViewTemplate(isLoggedIn, catalogueCards, search));
    ctx.updateNav(search);
}
