import {
    get,
    post,
    del,
    addOwner,
    addArticle,
    addArticleOwner,
    createPointerQuery,
} from "./restService.js";

const endPoints = {
    addLike: "/classes/Likes",
    deleteLike: "/classes/Likes/",
    countLikesByArticleId: (articleId) =>
        `/classes/Likes?where=%7B${createPointerQuery(
            "article",
            "Articles",
            articleId
        )}%7D&count=1&limit=0`,
    allLikesByArticleId: (articleId) =>
        `/classes/Likes?where=%7B${createPointerQuery(
            "article",
            "Articles",
            articleId
        )}%7D&count=1&keys=objectId`,
    allLikesByArticleIdByOwnerId: (articleId, ownerId) =>
        `/classes/Likes?where=%7B${createPointerQuery(
            "article",
            "Articles",
            articleId
        )},${createPointerQuery(
            "owner",
            "_User",
            ownerId
        )}%7D&count=1&keys=objectId`, //&limit=0
};

export async function addLike(likeData, ownerId, articleId, articleOwnerId) {
    // profileData item must be object
    addOwner(likeData, ownerId);
    addArticle(likeData, articleId);
    addArticleOwner(likeData, articleOwnerId);
    return post(endPoints.addLike, likeData); // returns promise
}

export async function deleteLike(likeId) {
    return del(endPoints.deleteLike + likeId);
}

export async function countLikesByArticle(articleId) {
    return get(endPoints.countLikesByArticleId(articleId)); // returns promise
}

export async function allLikesByArticle(articleId) {
    return get(endPoints.allLikesByArticleId(articleId)); // returns promise
}

export async function getLikesByArticleIdByOwnerId(articleId, ownerId) {
    return get(endPoints.allLikesByArticleIdByOwnerId(articleId, ownerId)); // returns promise
}
