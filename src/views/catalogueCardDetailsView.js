import * as articleService from "../services/articleService.js";
import * as likesService from "../services/likesService.js";
import { getUserData, parseQuerystring } from "../services/util.js";
import { catalogueCardDetailsTemplate } from "../templates/catalogueCardDetailsTemplate.js";

export async function catalogueCardDetailsView(ctx) {
    const articleId = ctx.params.articleId;
    const auth = getUserData();
    const query = parseQuerystring(ctx.querystring);
    const search = query.search || "";
    ctx.searchForm.reset();
    ctx.updateNav(search);
    let currentUserId = "";
    let likedByCurrentUser = false;
    let isLoggedIn = false;
    let isOwner = false;

    let requests = [
        articleService.getArticleById(articleId),
        likesService.countLikesByArticle(articleId),
    ];
    if (auth) {
        isLoggedIn = true;
        currentUserId = auth.id;
        requests.push(
            likesService.getLikesByArticleIdByOwnerId(articleId, auth.id)
        );
    }
    const [article, totalLikes, likedByCurrentUserCount] = await Promise.all(
        requests
    );

    const articleOwnerId = article.owner.objectId;
    if (isLoggedIn && likedByCurrentUserCount.count > 0) {
        likedByCurrentUser = true;
    }

    if (currentUserId === articleOwnerId) {
        isOwner = true;
    }

    let showModal = false;
    let serverError = { error: false, errorMsg: "" };

    function update() {
        ctx.render(
            catalogueCardDetailsTemplate(
                article,
                totalLikes,
                isLoggedIn,
                isOwner,
                likedByCurrentUser,
                showHideModalHendlar,
                onDeleteHandler,
                onLikeHandler,
                onDislikeHandler,
                showModal,
                serverError
            )
        );
    }

    function showHideModalHendlar(event) {
        event.preventDefault();
        showModal = !showModal;
        serverError.error = false;
        serverError.errorMsg = "";
        update();
    }

    async function onDeleteHandler(event) {
        event.preventDefault();
        try {
            const allLikes = await likesService.allLikesByArticle(articleId);
            const onDeleteRequests = allLikes.results.map((like) =>
                likesService.deleteLike(like.objectId)
            );
            onDeleteRequests.push(articleService.deleteArticle(articleId));
            await Promise.all(onDeleteRequests);
            ctx.page.redirect(`/catalogue`);
        } catch (err) {
            serverError.error = true;
            serverError.errorMsg = `${err.error}`;
            update();
        }
    }

    async function onLikeHandler(event) {
        event.preventDefault();
        try {
            const likeData = {};
            await likesService.addLike(
                likeData,
                auth.id,
                articleId,
                articleOwnerId
            );
            ctx.page.redirect(`/catalogue/${articleId}`);
        } catch (err) {
            serverError.error = true;
            serverError.errorMsg = `${err.error}`;
            update();
        }
    }

    async function onDislikeHandler(event) {
        event.preventDefault();
        try {
            const likeId = likedByCurrentUserCount.results[0].objectId;
            await likesService.deleteLike(likeId);
            ctx.page.redirect(`/catalogue/${articleId}`);
        } catch (err) {
            serverError.error = true;
            serverError.errorMsg = `${err.error}`;
            update();
        }
    }
    update();
}
