const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 22;
const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 16;

const hasWhiteSpace = new RegExp("^$|\\s");
const hasRightLength = (min, max) => new RegExp(`^.{${min},${max}}$`);
const hasNumber = new RegExp("^(?=.*[0-9])");
const hasCapitalLetter = new RegExp("^(?=.*[A-Z])");
const hasSmallLetter = new RegExp("^(?=.*[a-z])");
const hasSpecialChar = new RegExp("^(?=.*[!@#$%^&*])");

export function userNameValidation(fieldName, fieldValue) {
    let userNameError = { error: true, errorMsg: "" };

    if (fieldValue.length < 1) {
        userNameError["errorMsg"] = `Please fill in your ${fieldName} !`;
    } else if (hasWhiteSpace.test(fieldValue)) {
        userNameError[
            "errorMsg"
        ] = `The ${fieldName} cannot contain white spaces!`;
    } else if (
        !hasRightLength(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH).test(
            fieldValue
        )
    ) {
        userNameError[
            "errorMsg"
        ] = `Your ${fieldName} should be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} digits long!`;
    } else {
        userNameError = { error: false, errorMsg: "" };
    }
    return userNameError;
}

export function passwordValidation(fieldName, fieldValue) {
    let passwordError = { error: true, errorMsg: "" };

    if (fieldValue.length < 1) {
        passwordError["errorMsg"] = `Please fill in your ${fieldName} !`;
    } else if (hasWhiteSpace.test(fieldValue)) {
        passwordError[
            "errorMsg"
        ] = `The ${fieldName} cannot contain white spaces!`;
    } else if (
        !hasRightLength(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH).test(
            fieldValue
        )
    ) {
        passwordError[
            "errorMsg"
        ] = `Your ${fieldName} should be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} digits long!`;
    } else if (!hasNumber.test(fieldValue)) {
        passwordError[
            "errorMsg"
        ] = `Your ${fieldName} should contain at least one number`;
    } else if (!hasCapitalLetter.test(fieldValue)) {
        passwordError[
            "errorMsg"
        ] = `Your ${fieldName} should contain at least one capital letter`;
    } else if (!hasSmallLetter.test(fieldValue)) {
        passwordError[
            "errorMsg"
        ] = `Your ${fieldName} should contain at least one lowercase letter`;
    } else if (!hasSpecialChar.test(fieldValue)) {
        passwordError[
            "errorMsg"
        ] = `Your ${fieldName} should contain at least one special character`;
    } else {
        passwordError = { error: false, errorMsg: "" };
    }
    return passwordError;
}

export function repeatPasswordValidation(fieldValue, password) {
    let repeatPasswordError = { error: true, errorMsg: "" };
    if (fieldValue.length < 1) {
        repeatPasswordError["errorMsg"] = `Please repeat your password!`;
    } else if (fieldValue !== password) {
        repeatPasswordError["errorMsg"] = `Passwords don't match!`;
    } else {
        repeatPasswordError = { error: false, errorMsg: "" };
    }
    return repeatPasswordError;
}

export function emptyFieldsValidation(formData) {
    const emptyFields = formData.filter(([k, v]) => v.trim() == "");
    const nonEmptyFields = formData.filter(([k, v]) => v.trim() != "");
    const emptyErr = emptyFields.reduce(
        (acc, [k]) => Object.assign(acc, { [k]: true }),
        {}
    );
    const nonEmptyErr = nonEmptyFields.reduce(
        (acc, [k]) => Object.assign(acc, { [k]: false }),
        {}
    );

    const emptyErrMsgs = emptyFields.reduce(
        (acc, [k]) => Object.assign(acc, { [k]: "The field is required." }),
        {}
    );
    const nonEmptyErrMsgs = nonEmptyFields.reduce(
        (acc, [k]) => Object.assign(acc, { [k]: "" }),
        {}
    );
    const errors = { ...emptyErr, ...nonEmptyErr };
    const errorMsgs = { ...emptyErrMsgs, ...nonEmptyErrMsgs };
    return { errors, errorMsgs, emptyFields };
}
