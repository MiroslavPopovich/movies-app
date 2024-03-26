import { formTemplate } from "../templates/formTemplate.js";
import { formGroupTemplate } from "../templates/formGroupTemplate.js";
import { getAllCategories } from "../services/categoriesService.js";
import { emptyFieldsValidation } from "../validations.js";
import { imageFieldValidation } from "../validations.js";
import { html } from "../lib.js";
import { getUserData, parseQuerystring } from "../services/util.js";
import * as articleService from "../services/articleService.js";

export async function createArticleView(ctx) {
    const auth = getUserData();

    if (!auth) {
        return ctx.page.redirect("/login");
    }

    const query = parseQuerystring(ctx.querystring);
    const search = query.search || "";
    ctx.searchForm.reset();
    ctx.updateNav(search);

    async function getOptions() {
        const data = await getAllCategories();
        const items = data.results.map(
            (item) =>
                html` <option value=${item.objectId}>${item.category}</option> `
        );
        items.unshift(html`
            <option value="" selected hidden>Category</option>
        `);
        return items;
    }

    const selectTagOptions = getOptions();
    const title = {
        tag: "input",
        lable: "Title",
        id: "title",
        type: "text",
        placeholder: "Title",
        name: "title",
    };
    const category = {
        tag: "select",
        lable: "Category",
        id: "category",
        type: "",
        placeholder: "Category",
        name: "categoryId",
    };
    const description = {
        tag: "textarea",
        lable: "Description",
        id: "description",
        type: "",
        placeholder: "Description",
        name: "description",
    };
    const image = {
        tag: "input",
        lable: "Image",
        id: "image",
        type: "file",
        placeholder: "Image",
        name: "image",
    };
    const formId = "articleForm";
    let serverError = { error: false, errorMsg: "" };
    let errors = {};
    let errorMsgs = {};

    async function update(errors, errorMsgs, serverError) {
        const groups = [title, category, description, image];

        const formGroups = groups.map((group) =>
            formGroupTemplate({
                group: group,
                errors: errors,
                errorMsgs: errorMsgs,
                selectTagOptions: selectTagOptions,
                onBlur: onBlur,
            })
        );
        ctx.render(
            formTemplate(formId, formGroups, "Add Movie", onSubmit, serverError)
        );
    }
    
    await update(errors, errorMsgs, serverError);
    const form = document.getElementById(formId);
    form.reset();
    let unsuccessfulSubmits = 0;
    
    function errorHandler(formData, imageObj){
        const currentErrors = {};
        const textFieldsErrors = emptyFieldsValidation([...formData]);
        const fileFieldErros = imageFieldValidation(imageObj, image.name);
        currentErrors.errors = {
            ...textFieldsErrors.errors,
            ...fileFieldErros.errors,
        };
        currentErrors.errorMsgs = {
            ...textFieldsErrors.errorMsgs,
            ...fileFieldErros.errorMsgs,
        };
        currentErrors.emptyFields = [
            ...textFieldsErrors.emptyFields,
            ...fileFieldErros.emptyFields,
        ];
        errors = currentErrors.errors;
        errorMsgs = currentErrors.errorMsgs;

        if (currentErrors.emptyFields.length > 0) {
            unsuccessfulSubmits++;
            throw {
                error: new Error(),
                errors: currentErrors.errors,
                errorMsgs: currentErrors.errorMsgs,
                serverError,
            };
        }

        update(errors, errorMsgs, serverError);
    }
    
    async function onBlur(event) {
        if ( unsuccessfulSubmits > 0){
            const formData = new FormData(event.target.form);
            const imageObj = formData.get("image");
            formData.delete("image");
            try{
                errorHandler(formData, imageObj);
                console.log(false);
            } catch (err) {
                update(err.errors, err.errorMsgs, serverError);
            }
        } 
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const imageObj = formData.get("image");
        formData.delete("image");
        let imageBase64 = "";

        try {
            errorHandler(formData, imageObj);
            await update(errors, errorMsgs, serverError);
            const hasErrors = Object.values(errors).includes(true);
            if (!hasErrors) {
                try {
                    serverError.error = false;
                    serverError.errorMsg = "";
                    const reader = new FileReader();
                    reader.readAsDataURL(imageObj);
                    reader.onload = async () => {
                        imageBase64 = reader.result;
                        const { title, categoryId, description } = Object.fromEntries(formData);
                        const articleData = {
                            title,
                            description,
                            image: imageBase64,
                        };
                            // const auth = getUserData();
                        await articleService.addArticle(
                            articleData,
                            auth.id,
                            categoryId
                        );
                        event.target.reset();
                        ctx.page.redirect(`/catalogue`);
                    };
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
            } else {
                throw {
                    error: new Error(),
                    errors: currentErrors.errors,
                    errorMsgs: currentErrors.errorMsgs,
                    serverError,
                };
            }
        } catch (err) {
            await update(err.errors, err.errorMsgs, err.serverError);
        }
    }
}