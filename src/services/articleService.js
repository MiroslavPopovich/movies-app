import { 
    get,
    put,
    post,
    del,
    createPointerQuery,
    addOwner,
    addCategory,
} from "./restService.js";

export const articlesPerPage = 8;
const endPoints = {
    allArticles: `/classes/Articles?order=-updatedAt&count=1&limit=${articlesPerPage}&skip=`,
    articleById: (articleId) => `/classes/Articles/${articleId}`,
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
        addArticle: "/classes/Articles",
        editArticle: "/classes/Articles/",
        deleteArticle: "/classes/Articles/",
};

export async function getAllArticles(page, search) {
    let url = endPoints.allArticles + (page - 1) * articlesPerPage;
    if (search) {
        url += "&where=" + `{"title":{"$regex":"${search}","$options":"i"}}`;
    }
    return get(url);
}

export async function getArticleById(articleId) {
    return get(endPoints.articleById(articleId));
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

export async function addArticle(articleData, ownerId, categoryId) {
    // profileData item must be object
    addOwner(articleData, ownerId);
    addCategory(articleData, categoryId);
    return post(endPoints.addArticle, articleData); // returns promise
}

export async function editArticle(articleData, articleId) {
    return put(endPoints.editArticle + articleId, articleData);
}

export async function deleteArticle(articleId) {
    return del(endPoints.deleteArticle + articleId);
}