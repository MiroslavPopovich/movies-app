import { html, until } from "../lib.js";
import { confirmationModalTemplate } from "./confirmationModalTemplate.js";

export const catalogueCardDetailsTemplate = (
    article,
    totalLikes,
    isLoggedIn,
    isOwner,
    likedByCurrentUser,
    showHideModalHendlar,
    onDeleteHandler,
    onLikeHandler,
    onDislikeHandler,
    showModal,
    serverError
) =>
    html`
        <div class="container ">
            <section id="articleDetails" class="flex-col">
                <h1 class="m-l">Movie title: ${article.title}</h1>

                <figure class="card-details-img m-s">
                    <img src=${article.image} alt="Movie" />
                </figure>
                <div class="flex-col m-l">
                    <h3 class="m-s">Movie Description</h3>
                    <p class="m-s">${article.description}</p>
                    <span class="span-info">Liked ${totalLikes.count}</span>
                    ${isLoggedIn
                        ? html`
                              <div class="m-s">
                                  ${isOwner
                                      ? html`<button
                                                class="btn btn-del"
                                                @click=${showHideModalHendlar}>
                                                Delete
                                            </button>
                                            <a
                                                class="btn btn-edit "
                                                href="/editArticle/${article.objectId}">
                                                Edit
                                            </a>`
                                      : html`${likedByCurrentUser
                                            ? html`<button
                                                  class="btn btn-info "
                                                  @click=${onDislikeHandler}>
                                                  Dislike
                                              </button>`
                                            : html`<button
                                                  class="btn btn-info "
                                                  @click=${onLikeHandler}>
                                                  Like
                                              </button>`}`}
                                </div>
                            `
                        : null}
                </div>
            </section>
        </div>
        ${showModal
            ? confirmationModalTemplate(
                  showHideModalHendlar,
                  onDeleteHandler,
                  serverError
              )
            : null}
    `;
