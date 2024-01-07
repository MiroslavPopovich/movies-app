import { render, page } from "./lib.js";
import { headerTemplate } from "./templates/headerTemplate.js";
import { footerTemplate } from "./templates/footerTemplate.js";

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

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, mainRoot);
    ctx.updateNav = (search) => loadNav(search);
    next();
}

page(decorateContext);
page.start();
