import { html } from "../lib.js";

export const categoryCardTemplate = (category) =>
    html`
        <div class="card flex-col h-s btn-primary">
            <div class="card-body-s flex-col">
                <a href="/catalogue/${category.category}/${category.objectId}">
                    ${category.category}
                </a>
            </div>
        </div>
    `;
