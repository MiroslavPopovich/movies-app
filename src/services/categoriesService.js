import { get } from "./restService.js";

const endPoints = {
    allCategories: "/classes/Categories",
    categoryById: (categoryId) => `/classes/Categories/${categoryId}`,
};

export async function getAllCategories() {
    return get(endPoints.allCategories); // returns promise
}

export async function getCategoryById(categoryId) {
    return get(endPoints.categoryById(categoryId));
}