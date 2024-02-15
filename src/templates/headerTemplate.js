import { html } from "../lib.js";

export const headerTemplate = (userData, onLogOut, onSearch, search) => html`
    <div class="container">
        <a href="/catalogue?page=1" class="btn btn-secondary">Movies</a>
        <a href="/" class="btn btn-secondary">Home</a>
        <div class="search-bar">
            <form id="search" @submit=${onSearch}>
                <input
                    type="search"
                    name="search"
                    value=${search}
                    placeholder="Search for movies" />
                <button type="submit">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
        </div>
        <nav class="navigation">
            <ul>
                ${userData != null
                    ? html`<li>
                              <a href="/myCatalogue" class="btn btn-primary">
                                  My Movies
                              </a>
                          </li>
                          <li>
                              <a
                                  @click=${onLogOut}
                                  href="javascript:void(0)"
                                  class="btn btn-primary">
                                  Logout
                              </a>
                          </li>`
                    : html`<li>
                              <a href="/login" class="btn btn-primary">
                                  Login
                              </a>
                          </li>
                          <li>
                              <a href="/register" class="btn btn-primary">
                                  Register
                              </a>
                          </li>`}
            </ul>
        </nav>
    </div>
`;
