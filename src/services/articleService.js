import { get, createPointerQuery } from "./restService.js";

export const articlesPerPage = 8;
const endPoints = {
    allArticles: `/classes/Articles?order=-updatedAt&count=1&limit=${articlesPerPage}&skip=`,
    allArticlesByCategoryId: (categoryId) =>
        `/classes/Articles?where={${createPointerQuery(
            "category",
            "Categories",
            categoryId
        )}}&order=-updatedAt&count=1&limit=${articlesPerPage}&skip=`,
    allArticlesByOwnerId: (ownerId) =>
        `/classes/Articles?where={${createPointerQuery(
            "owner",
            "_User",
            ownerId
        )}}&order=-updatedAt&count=1&limit=${articlesPerPage}&skip=`,
};

export async function getAllArticles(page, search) {
    let url = endPoints.allArticles + (page - 1) * articlesPerPage;
    if (search) {
        url += "&where=" + `{"title":{"$regex":"${search}","$options":"i"}}`;
    }
    return get(url);
}

export async function getArticlesByCategory(categoryId, page) {
    let url =
        endPoints.allArticlesByCategoryId(categoryId) +
        (page - 1) * articlesPerPage;
    return get(url);
}

export async function getArticlesByOwner(ownerId, page) {
    let url =
        endPoints.allArticlesByOwnerId(ownerId) + (page - 1) * articlesPerPage;
    return get(url);
}
