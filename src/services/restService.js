import { getUserData } from "./util.js";
import * as keys from "./apiKeys.js";
const host = "https://parseapi.back4app.com";
const applicationId = keys.APPLICATION_ID;
const restApiKey = keys.REST_API_KEY;

async function request(url, options) {
    try {
        const response = await fetch(host + url, options);
        if (response.ok === false) {
            const error = await response.json();
            throw error;
        }
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
}
function createOption(method = "GET", data) {
    const options = {
        method,
        headers: {
            "X-Parse-Application-Id": applicationId,
            "X-Parse-REST-API-Key": restApiKey,
        },
    };

    const userData = getUserData();

    if (
        userData !== null &&
        !(Object.keys(userData).length === 0 && userData.constructor === Object)
    ) {
        options.headers["X-Parse-Session-Token"] = userData.token;
    }

    if (data !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data); // data must be object
    }

    return options;
}

function createPointer(className, objectId) {
    return {
        __type: "Pointer",
        className,
        objectId,
    };
}

function createQuery(query) {
    return encodeURIComponent(query);
}

export function addOwner(record, id) {
    record.owner = createPointer("_User", id);
    return record;
}

export function addCategory(record, id) {
    record.category = createPointer("Categories", id);
    return record;
}

export function createPointerQuery(propName, className, objectId) {
    return createQuery(
        `"${propName}": ${JSON.stringify(createPointer(className, objectId))}`
    );
}

// POST request
export async function post(url, data) {
    return request(url, createOption("POST", data));
}
// GET request
export async function get(url, data) {
    return request(url, createOption("GET", data));
}
// PUT request
export async function put(url, data) {
    return request(url, createOption("PUT", data));
}
// DELETE request
export async function del(url) {
    return request(url, createOption("DELETE"));
}
