import { homeViewTemplate } from "../templates/homeViewTemplate.js";
import { parseQuerystring } from "../services/util.js";
import { categoryCardTemplate } from "../templates/categoryCardTemplate.js";
import * as categoryService from "../services/categoriesService.js";
import { html } from "../lib.js";

export function homeView(ctx) {
    const query = parseQuerystring(ctx.querystring);
    const search = query.search || "";
    ctx.searchForm.reset();

    async function loadCategoryCards() {
        const data = await categoryService.getAllCategories();

        let currentSection = null;
        if (data.results.length === 0) {
            currentSection = html`<p>No Movie Categories!</p>`;
        } else {
            const cards = data.results.map((category) =>
                categoryCardTemplate(category)
            );

            currentSection = html`
                <section class="container flex-row h-a">${cards}</section>
            `;
        }
        return currentSection;
    }
    const categoryCards = loadCategoryCards();

    ctx.render(homeViewTemplate(categoryCards));
    ctx.updateNav(search);
}
