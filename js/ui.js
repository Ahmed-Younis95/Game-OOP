export class UI {
    constructor(gamesData, loading, detailsContent, gamesContent, detailsPage) {
        this.gamesData = gamesData;
        this.loading = loading;
        this.detailsContent = detailsContent;
        this.gamesContent = gamesContent;
        this.detailsPage = detailsPage;
    }

    displayGames(data, clickedIndexCallback, getGamesCallback) {
        this.gamesData.innerHTML = data.map((game, index) => `
            <div class="col">
                <div data-id="${game.id}" class="card h-100 bg-transparent" role="button">
                    <div class="card-body">
                        <figure class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${game.thumbnail}" alt="Game">
                        </figure>
                        <figcaption>
                            <div class="hstack justify-content-between">
                                <h3 class="h6 small">${game.title}</h3>
                                <span class="badge text-bg-primary p-2">Free</span>
                            </div>
                            <p class="card-text small text-center opacity-50">
                                ${game.short_description}
                            </p>
                        </figcaption>
                    </div>
                    <footer class="card-footer small hstack justify-content-between">
                        <span class="badge badge-color">${game.genre}</span>
                        <span class="badge badge-color">${game.platform}</span>
                    </footer>
                </div>
            </div>
        `).join('');

        this.loading.classList.add('d-none');

        const cardList = document.querySelectorAll('.card');
        cardList.forEach((card, index) => {
            card.addEventListener('click', async () => {
                clickedIndexCallback(index);
                this.loading.classList.remove('d-none');
                await getGamesCallback('?id', data[index].id);
                
                this.gamesContent.classList.add('d-none');
                this.detailsPage.classList.remove('d-none');
                this.loading.classList.add('d-none');
            });
        });
    }

    displayGameDetails(data) {
        const innerCode = `
            <div class="col-md-4">
                <img src="${data.thumbnail}" class="w-100" alt="image details">
            </div>
            <div class="col-md-8">
                <h3>Title: ${data.title}</h3>
                <p>Category: <span class="badge text-bg-info"> ${data.genre}</span> </p>
                <p>Platform: <span class="badge text-bg-info"> ${data.platform}</span> </p>
                <p>Status: <span class="badge text-bg-info"> Live</span> </p>
                <p class="small">${data.description}</p>
                <a class="btn btn-outline-warning" target="_blank" href="${data.game_url}">Show Game</a>
            </div>
        `;
        this.detailsContent.innerHTML = innerCode;
    }
}
