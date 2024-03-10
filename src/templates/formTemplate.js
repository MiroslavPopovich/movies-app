import { html } from "../lib.js";
function onClick() {
    window.history.back(-1);
}
export const formTemplate = (
    formId,
    formGroups,
    title,
    onSubmit,
    serverError
) => html`
    <div class="container flex-col form">
        <section>
            <form @submit=${onSubmit} id=${formId}>
                <fieldset>
                    <legend>${title}</legend>
                    ${html`${formGroups}`}
                    ${serverError.error
                        ? html`<p>${serverError.errorMsg}</p>`
                        : html`<p></p>`}
                    <div
                        class=${formId === "loginForm" ||
                        formId === "registerForm"
                            ? null
                            : "flex-row"}>
                        <button type="submit" class="btn btn-add btn-center">
                            ${title}
                        </button>
                        ${formId === "loginForm"
                            ? html`
                                <p class="field">
                                    <span>
                                        If you don't have profile click
                                        <a href="/register">here</a>
                                    </span>
                                </p>`
                            : formId === "registerForm"
                            ? html`
                                <p class="field">
                                    <span>
                                        To login click
                                        <a href="/login">here</a>
                                    </span>
                                </p>`
                            : html`
                                <button
                                    type="button"
                                    @click=${onClick}
                                    class="btn btn-back btn-center">
                                    Go Back
                                </button>`}
                    </div>
                </fieldset>
            </form>
        </section>
    </div>`;
