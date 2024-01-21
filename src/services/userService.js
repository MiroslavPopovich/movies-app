import { post } from "./restService.js";

const endPoints = {
    register: "/users",
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
