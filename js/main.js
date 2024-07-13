import { UI } from './ui.js';

class GameApp {
    constructor() {
        this.gamesData = document.getElementById('gameData');
        this.navList = document.querySelectorAll('.nav-item .nav-link');
        this.loading = document.querySelector('.loading');
        this.detailsContent = document.getElementById('detailsContent');
        this.gamesContent = document.querySelector('.games');
        this.detailsPage = document.querySelector('.details');
        this.btnClose = document.getElementById('btnClose');
        
        this.prevIndex = 0;
        this.gameList = [];
        this.selectedIndex = 0;

        this.ui = new UI(this.gamesData, this.loading, this.detailsContent, this.gamesContent, this.detailsPage);

        this.init();
    }

    init() {
        this.navList.forEach((navItem, index) => {
            navItem.addEventListener('click', (e) => {
                this.handleNavClick(e, index);
            });
        });

        this.btnClose.addEventListener('click', () => {
            this.closeDetails();
        });

        document.addEventListener('keydown', (e) => {
            if (this.gamesContent.classList.contains('d-none') && e.key === 'Escape') {
                this.closeDetails();
            }
        });

        this.getGames('s?category', 'mmorpg');
    }

    async getGames(site, category) {
        this.loading.classList.remove('d-none');

        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game${site}=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '6287c3e85amsh1e508da3772964ap17340ajsnfda91dc5f641',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            },
            cache: 'default'
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (response.status == 200) {
                if (site === 's?category') {
                    this.ui.displayGames(result, (index) => this.clickedIndex(index), (site, id) => this.getGames(site, id));
                } else if (site === '?id') {
                    this.ui.displayGameDetails(result);
                }
            } else {
                this.showError();
            }

        } catch (error) {
            this.showError();
        }
    }

    showError() {
        Swal.fire({
            title: "Error",
            text: "Something wrong, please check the internet connection!",
            icon: "error"
        });
    }

    handleNavClick(e, index) {
        let clickedItem = e.target;
        this.getGames('s?category', clickedItem.text);

        this.navList[this.prevIndex].classList.remove('active');
        this.navList[index].classList.add('active');
        this.prevIndex = index;
    }

    clickedIndex(i) {
        this.selectedIndex = i;
    }

    closeDetails() {
        this.gamesContent.classList.remove('d-none');
        this.detailsPage.classList.add('d-none');
    }
}

const gameApp = new GameApp();
