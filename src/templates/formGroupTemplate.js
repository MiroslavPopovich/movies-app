import { html, until } from "../lib.js";

export const formGroupTemplate = ({
    group,
    errors,
    errorMsgs,
    selectTagOptions = null,
    onBlur = null,
    onChange = null,
} = {}) => html`
    <div class="form-group">
        ${group.tag === "input"
            ? html`
                  <label for="${group.name}">${group.lable}</label>
                  <p>${errorMsgs[group.name]}</p>
                  <input
                      @input=${group.name === "password" ? onChange : null}
                      @blur=${onBlur}
                      id=${group.id}
                      type=${group.type}
                      class=${"form-field" +
                      (errors[group.name] ? " is-invalid" : "")}
                      placeholder=${group.placeholder}
                      name=${group.name}
                      value=${group.value} />
                `
            : group.tag === "select"
            ? html`
                  <label for="${group.name}">${group.lable}</label>
                  <p>${errorMsgs[group.name]}</p>
                  <select
                      class=${"form-field" +
                      (errors[group.name] ? " is-invalid" : "")}
                      id=${group.id}
                      name=${group.name}>
                      ${html`
                            ${until(
                                selectTagOptions,
                                html`
                                <option
                                    value=${group.value}
                                    selected
                                    disabled
                                    hidden>
                                    Loading...
                                </option>
                            `)}
                        `}
                  </select>
                `
            : group.tag === "textarea"
            ? html` 
                <label for="${group.name}">${group.lable}</label>
                <p>${errorMsgs[group.name]}</p>
                <textarea
                    id=${group.id}
                    name=${group.name}
                    rows="6"
                    class=${"form-field" +
                    (errors[group.name] ? " is-invalid" : "")}
                    placeholder=${group.placeholder}>
                    ${group.value}
                </textarea>
            `
            : null}
    </div>
`;
