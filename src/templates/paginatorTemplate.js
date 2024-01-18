import { html } from "../lib.js";

function createPageHref(currentPathName, page, step, search) {
    return (
        `${currentPathName}?page=${page + step}` +
        (search ? `&search=${search}` : "")
    );
}
export const paginatorTemplate = (currentPathName, page, pages, search) =>
    html`<div class="flex-row m-s catalogue-page-nav">
        ${page > 1
            ? html`<a
                  class="btn btn-info"
                  href=${createPageHref(currentPathName, page, -1, search)}
                  >&lt; Prev</a
              >`
            : null}
        ${page < pages
            ? html`<a
                  class="btn btn-info"
                  href=${createPageHref(currentPathName, page, 1, search)}
                  >Next &gt;</a
              >`
            : null}
    </div>`;
