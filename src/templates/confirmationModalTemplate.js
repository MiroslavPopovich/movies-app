import { html } from "../lib.js";

export const confirmationModalTemplate = (
    showHideModalHendlar,
    onDeleteHandler,
    serverError
) =>
    html`
        <div class="overlay">
            <div class="modal">
                <p>Are you sure?</p>
                ${serverError.error
                    ? html`<p>${serverError.errorMsg}</p>`
                    : null}
                <div class="flex-row">
                    <button class="btn btn-del" @click=${onDeleteHandler}>
                        Delete
                    </button>
                    <button class="btn btn-edit" @click=${showHideModalHendlar}>
                        Cancle
                    </button>
                </div>
            </div>
        </div>
    `;
