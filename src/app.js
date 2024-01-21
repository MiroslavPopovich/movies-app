import { render, page } from "./lib.js";
import { headerTemplate } from "./templates/headerTemplate.js";
import { footerTemplate } from "./templates/footerTemplate.js";
import { getUserData } from "./services/util.js";
import { homeView } from "./views/homeView.js";
import { catalogueView } from "./views/catalogueView.js";
import { registerView } from "./views/registerView.js";

const headerRoot = document.getElementById("header");
const mainRoot = document.getElementById("main");
const footerRoot = document.getElementById("footer");

function loadFooter() {
    render(footerTemplate(), footerRoot);
}

function loadNav() {
    const userData = getUserData();
    render(headerTemplate(userData), headerRoot);
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
page.start();
