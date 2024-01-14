import { get } from "./restService.js";

const endPoints = {
    allCategories: "/classes/Categories",
};

export async function getAllCategories() {
    return get(endPoints.allCategories); // returns promise
}
