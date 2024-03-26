import { formTemplate } from "../templates/formTemplate.js";
import { formGroupTemplate } from "../templates/formGroupTemplate.js";
import {
    userNameValidation,
    passwordValidation,
    repeatPasswordValidation,
} from "../validations.js";

import * as userService from "../services/userService.js";
import { setUserData, parseQuerystring } from "../services/util.js";

export function registerView(ctx) {
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

    const repeatPassword = {
        tag: "input",
        lable: "Repeat Password",
        id: "repeatPassword",
        type: "password",
        placeholder: "Repeat Password",
        name: "repeatPassword",
    };

    const formId = "registerForm";
    let serverError = { error: false, errorMsg: "" };
    let errors = {};
    let errorMsgs = {};

    function update(errors, errorMsgs, serverError) {
        const groups = [userName, password, repeatPassword];
        const formGroups = groups.map((group) =>
            formGroupTemplate({
                group: group,
                errors: errors,
                errorMsgs: errorMsgs,
                onBlur: onBlur,
                onChange: onChange,
            })
        );
        ctx.render(
            formTemplate(formId, formGroups, "Register", onSubmit, serverError)
        );
    }

    update(errors, errorMsgs, serverError);
    const form = document.getElementById(formId);
    form.reset();
    const repeatPasswordField = document.getElementById("repeatPassword");
    repeatPasswordField.disabled = true;

    async function onChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        if (passwordValidation(fieldName, fieldValue).error) {
            repeatPasswordField.disabled = true;
            errors[repeatPasswordField.name] = false;
            errorMsgs[repeatPasswordField.name] = "";
            update(errors, errorMsgs, serverError);
        } else {
            repeatPasswordField.disabled = false;
        }
        repeatPasswordField.value = "";
    }

    async function onBlur(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        try {
            if (fieldName == userName.name) {
                const currentError = userNameValidation(fieldName, fieldValue);
                if (currentError.error) {
                    errors[fieldName] = true;
                    errorMsgs[fieldName] = currentError.errorMsg;
                    throw {
                        error: new Error(currentError.errorMsg),
                        errors,
                        errorMsgs,
                    };
                } else {
                    errors[fieldName] = false;
                    errorMsgs[fieldName] = "";
                    update(errors, errorMsgs, serverError);
                }
            }
            if (fieldName == password.name) {
                const currentError = passwordValidation(fieldName, fieldValue);
                if (currentError.error) {
                    errors[fieldName] = true;
                    errorMsgs[fieldName] = currentError.errorMsg;
                    throw {
                        error: new Error(currentError.errorMsg),
                        errors,
                        errorMsgs,
                    };
                } else {
                    errors[fieldName] = false;
                    errorMsgs[fieldName] = "";
                    repeatPasswordField.disabled = false;
                    update(errors, errorMsgs, serverError);
                }
            }
            if (fieldName == repeatPassword.name) {
                const password = document.getElementById("password").value;
                const currentError = repeatPasswordValidation(
                    fieldValue,
                    password
                );
                if (currentError.error) {
                    errors[fieldName] = true;
                    errorMsgs[fieldName] = currentError.errorMsg;
                    throw {
                        error: new Error(currentError.errorMsg),
                        errors,
                        errorMsgs,
                    };
                } else {
                    errors[fieldName] = false;
                    errorMsgs[fieldName] = "";
                    update(errors, errorMsgs, serverError);
                }
            }
        } catch (err) {
            update(err.errors, err.errorMsgs, serverError);
        }
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = [...new FormData(event.target)];
        const data = formData.reduce(
            (acc, [k, v]) => Object.assign(acc, { [k]: v }),
            {}
        );
        const emptyFields = formData.filter(([k, v]) => v == "");
        try {
            if (emptyFields.length > 0) {
                errors = emptyFields.reduce(
                    (acc, [k, v]) => Object.assign(acc, { [k]: true }),
                    errors
                );
                errorMsgs = emptyFields.reduce(
                    (acc, [k, v]) =>
                        Object.assign(acc, { [k]: `The field is required.` }),
                    errorMsgs
                );
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
                        const result = await userService.register(
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
