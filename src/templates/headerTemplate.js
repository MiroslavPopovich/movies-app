import { html } from "../lib.js";

export const headerTemplate = () => html`
    <div class="container">
        <a href="/" class="btn btn-secondary">Home</a>
        <a href="/catalogue?page=1" class="btn btn-secondary">Movies</a>
        <div class="search-bar">
            <form id="search" @submit=${null}>
                <input
                    type="search"
                    name="search"
                    value=${null}
                    placeholder="Search for movies" />
                <button type="submit">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
        </div>
        <nav class="navigation"></nav>
    </div>
`;
