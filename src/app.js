import { render, page } from "./lib.js";
import { headerTemplate } from "./templates/headerTemplate.js";
import { footerTemplate } from "./templates/footerTemplate.js";
import { homeView } from "./views/homeView.js";
import { catalogueView } from "./views/catalogueView.js";

const headerRoot = document.getElementById("header");
const mainRoot = document.getElementById("main");
const footerRoot = document.getElementById("footer");

function loadFooter() {
    render(footerTemplate(), footerRoot);
}

function loadNav() {
    render(headerTemplate(), headerRoot);
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
page.start();
