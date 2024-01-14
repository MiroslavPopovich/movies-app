import { html, until } from "../lib.js";

export const homeViewTemplate = (categoryCards) => html`
    <div class="container">
        <section id="homeView" class="flex-col home">
            <figure>
                <img
                    src="https://res.cloudinary.com/diebeaf02/image/upload/v1698591879/Repos/cropped-movie-banner-e1408372575210_b8upbd.jpg"
                    alt="Cinema"
                    width="1260"
                    height="261" />
            </figure>
            <section>
                <h1>Movies</h1>
                <p>Unlimited movies and TV shows articles and more.</p>
                <p>Create your own article and share opinion anytime.</p>
            </section>

            ${until(categoryCards, html`<p>Loading...</p>`)}
        </section>
    </div>
`;
