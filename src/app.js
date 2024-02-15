import { render, page } from "./lib.js";
import { headerTemplate } from "./templates/headerTemplate.js";
import { footerTemplate } from "./templates/footerTemplate.js";
import { getUserData, clearUserData } from "./services/util.js";
import { logout } from "./services/userService.js";
import { homeView } from "./views/homeView.js";
import { catalogueView } from "./views/catalogueView.js";
import { registerView } from "./views/registerView.js";
import { loginView } from "./views/loginView.js";

const headerRoot = document.getElementById("header");
const mainRoot = document.getElementById("main");
const footerRoot = document.getElementById("footer");

const params = new URLSearchParams(window.location.search);
const search = params.get("search") || "";

function loadFooter() {
    render(footerTemplate(), footerRoot);
}

function loadNav(search) {
    const userData = getUserData();
    render(headerTemplate(userData, onLogOut, onSearch, search), headerRoot);

    async function onLogOut(event) {
        event.preventDefault();
        try {
            await logout();
            clearUserData();
            loadNav();
            page.redirect("/");
        } catch (err) {
            //alert(err.message);
            clearUserData();
            loadNav();
            page.redirect("/");
        }
    }

    function onSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const searchParam = formData.get("search").trim();

        console.log("search");
    }
}

loadNav();
loadFooter();
const searchForm = document.getElementById("search");
function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, mainRoot);
    ctx.updateNav = (search) => loadNav(search);
    ctx.searchForm = searchForm;
    next();
}

page(decorateContext);
page("/", homeView);
page("/catalogue", catalogueView);
page("/register", registerView);
page("/login", loginView);
page.start();
