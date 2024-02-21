import { html } from "../lib.js";

export const myCatalogueCardTemplate = (article) =>
    html`
        <div class="card">
            <div class="card-body flexible">
                <h4 class="card-title">${article.title}</h4>
            </div>
            <div class="card-footer">
                <a class="btn btn-info" href="/catalogue/${article.objectId}">
                    Details
                </a>
            </div>
        </div>
    `;
