import { get } from "./restService.js";

export const articlesPerPage = 8;
const endPoints = {
    allArticles: `/classes/Articles?order=-updatedAt&count=1&limit=${articlesPerPage}&skip=`,
};

export async function getAllArticles(page, search) {
    let url = endPoints.allArticles + (page - 1) * articlesPerPage;
    if (search) {
        url += "&where=" + `{"title":{"$regex":"${search}","$options":"i"}}`;
    }
    return get(url);
}