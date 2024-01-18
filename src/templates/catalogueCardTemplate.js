import { html } from "../lib.js";

export const catalogueCardTemplate = (article) =>
    html`
        <div class="card">
            <figure class="card-img">
                <img src=${article.image} alt="Card image cap" width="400" />
            </figure>
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
