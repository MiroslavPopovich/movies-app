import { post } from "./restService.js";

const endPoints = {
    register: "/users",
    logIn: "/login",
    logOut: "/logout",
};

export async function register(username, password) {
    const result = await post(endPoints.register, { username, password });
    const userData = {
        username,
        id: result.objectId,
        token: result.sessionToken,
    };
    return userData;
}

export async function login(username, password) {
    const result = await post(endPoints.logIn, { username, password });

    const userData = {
        username: result.username,
        id: result.objectId,
        token: result.sessionToken,
    };

    return userData;
}

export async function logout() {
    const result = await post(endPoints.logOut);
    return result;
}
