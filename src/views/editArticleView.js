import { formTemplate } from "../templates/formTemplate.js";
import { formGroupTemplate } from "../templates/formGroupTemplate.js";
import { emptyFieldsValidation } from "../validations.js";
import { imageFieldValidation } from "../validations.js";
import { html } from "../lib.js";
import { parseQuerystring, getUserData } from "../services/util.js";
import * as articleService from "../services/articleService.js";
import * as categoryService from "../services/categoriesService.js";
export async function editArticleView(ctx) {
    const auth = getUserData();

    if (!auth) {
        return ctx.page.redirect("/login");
    }
    const query = parseQuerystring(ctx.querystring);
    const search = query.search || "";
    ctx.searchForm.reset();
    ctx.updateNav(search);
    const articleId = ctx.params.articleId;
    const articleData = await articleService.getArticleById(articleId);
    async function getOptions(articleCategory) {
        const [categoriesData, currentCategory] = await Promise.all([
            categoryService.getAllCategories(),
            categoryService.getCategoryById(articleCategory.objectId),
        ]);

        const items = categoriesData.results.map(
            (item) =>
                html` <option value=${item.objectId}>${item.category}</option> `
        );
        items.unshift(html`
            <option value="${currentCategory.objectId}" selected hidden>
                ${currentCategory.category}
            </option>
        `);
        return items;
    }

    const selectTagOptions = getOptions(articleData.category);
    const title = {
        tag: "input",
        lable: "Title",
        id: "title",
        type: "text",
        placeholder: "Title",
        name: "title",
        value: articleData.title,
    };

    const category = {
        tag: "select",
        lable: "Category",
        id: "category",
        type: "",
        placeholder: "Category",
        name: "categoryId",
        value: "",
    };

    const description = {
        tag: "textarea",
        lable: "Description",
        id: "description",
        type: "",
        placeholder: "Description",
        name: "description",
        value: articleData.description,
    };

    const image = {
        tag: "input",
        lable: "Image",
        id: "image",
        type: "file",
        placeholder: "Image",
        name: "image",
        value: "",
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
            })
        );
        ctx.render(
            formTemplate(
                formId,
                formGroups,
                "Edit Movie",
                onSubmit,
                serverError
            )
        );
    }
    await update(errors, errorMsgs, serverError);
    const form = document.getElementById(formId);
    form.reset();

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const imageObj = formData.get("image");
        formData.delete("image");
        let imageBase64 = articleData.image;

        // const data = [...formData].reduce(
        //     (acc, [k, v]) => Object.assign(acc, { [k]: v }),
        //     {}
        // );
        // console.log(data);
        // const { image, ...others } = data;

        try {
            const currentErrors = {};
            const textFieldsErrors = emptyFieldsValidation([...formData]);

            const fieldName = image.name;
            let fileFieldErros = {
                errors: { image: false },
                errorMsgs: { image: "" },
                emptyFields: [],
            };
            if (imageObj.name != "") {
                fileFieldErros = imageFieldValidation(imageObj, fieldName);
            }

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
                throw {
                    error: new Error(),
                    errors: currentErrors.errors,
                    errorMsgs: currentErrors.errorMsgs,
                    serverError,
                };
            } else {
                await update(errors, errorMsgs, serverError);
                const hasErrors = Object.values(errors).includes(true);
                if (!hasErrors) {
                    try {
                        serverError.error = false;
                        serverError.errorMsg = "";
                        const reader = new FileReader();
                        reader.readAsDataURL(imageObj);
                        reader.onload = async () => {
                            if (imageObj.name != "") {
                                imageBase64 = reader.result;
                            }

                            const { title, categoryId, description } =
                                Object.fromEntries(formData);
                            const newArticleData = {
                                title,
                                category: {
                                    __type: "Pointer",
                                    className: "Categories",
                                    objectId: `${categoryId}`,
                                },
                                description,
                                image: imageBase64,
                            };
                            await articleService.editArticle(
                                newArticleData,
                                articleId
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
            }
        } catch (err) {
            await update(err.errors, err.errorMsgs, err.serverError);
        }
    }
}
