import { render, page } from "./lib.js";
import { headerTemplate } from "./templates/headerTemplate.js";

const headerRoot = document.getElementById("header");
const mainRoot = document.getElementById("main");

function loadNav() {
    render(headerTemplate(), headerRoot);
}

loadNav();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, mainRoot);
    ctx.updateNav = (search) => loadNav(search);
    next();
}

page(decorateContext);
page.start();
