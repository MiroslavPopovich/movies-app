import { formTemplate } from "../templates/formTemplate.js";
import { formGroupTemplate } from "../templates/formGroupTemplate.js";
import * as userService from "../services/userService.js";
import { setUserData, parseQuerystring } from "../services/util.js";

export function loginView(ctx) {
    //Form Fields
    const query = parseQuerystring(ctx.querystring);
    const search = query.search || "";
    ctx.searchForm.reset();
    ctx.updateNav(search);

    const userName = {
        tag: "input",
        lable: "Username",
        id: "username",
        type: "text",
        placeholder: "Username",
        name: "username",
    };

    const password = {
        tag: "input",
        lable: "Password",
        id: "password",
        type: "password",
        placeholder: "Password",
        name: "password",
    };

    const formId = "loginForm";
    let serverError = { error: false, errorMsg: "" };
    let errors = {};
    let errorMsgs = {};

    function update(errors, errorMsgs, serverError) {
        const groups = [userName, password];
        const formGroups = groups.map((group) =>
            formGroupTemplate({
                group: group,
                errors: errors,
                errorMsgs: errorMsgs,
            })
        );
        ctx.render(
            formTemplate(formId, formGroups, "Login", onSubmit, serverError)
        );
    }

    update(errors, errorMsgs, serverError);
    const form = document.getElementById(formId);
    form.reset();

    async function onSubmit(event) {
        event.preventDefault();
        const formData = [...new FormData(event.target)];
        const data = formData.reduce(
            (acc, [k, v]) => Object.assign(acc, { [k]: v.trim() }),
            {}
        );
        const emptyFields = formData.filter(([k, v]) => v.trim() == "");
        const nonEmptyFields = formData.filter(([k, v]) => v.trim() != "");

        try {
            const emptyErr = emptyFields.reduce(
                (acc, [k]) => Object.assign(acc, { [k]: true }),
                {}
            );
            const nonEmptyErr = nonEmptyFields.reduce(
                (acc, [k]) => Object.assign(acc, { [k]: false }),
                {}
            );

            const emptyErrMsgs = emptyFields.reduce(
                (acc, [k]) =>
                    Object.assign(acc, { [k]: "The field is required." }),
                {}
            );
            const nonEmptyErrMsgs = nonEmptyFields.reduce(
                (acc, [k]) => Object.assign(acc, { [k]: "" }),
                {}
            );
            errors = { ...emptyErr, ...nonEmptyErr };
            errorMsgs = { ...emptyErrMsgs, ...nonEmptyErrMsgs };

            if (emptyFields.length > 0) {
                throw {
                    error: new Error(),
                    errors,
                    errorMsgs,
                    serverError,
                };
            } else {
                update(errors, errorMsgs, serverError);
                const hasErrors = Object.values(errors).includes(true);
                if (!hasErrors) {
                    try {
                        serverError.error = false;
                        serverError.errorMsg = "";
                        const result = await userService.login(
                            data.username,
                            data.password
                        );
                        setUserData(result);
                        event.target.reset();

                        ctx.page.redirect(`/catalogue`);
                        ctx.updateNav(search);
                    } catch (err) {
                        serverError.error = true;
                        serverError.errorMsg = `${err.error}`;
                    }
                    if (serverError.error) {
                        throw {
                            error: new Error(),
                            errors,
                            errorMsgs,
                            serverError,
                        };
                    }
                }
            }
        } catch (err) {
            update(err.errors, err.errorMsgs, err.serverError);
        }
    }
}
