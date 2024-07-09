// Assignment 13
// Game OOP
// Link: https://routeegy.github.io/GameOOP/
// API Description: https://docs.google.com/presentation/d/1p4dE7NxLzBKG7gSVVSsXIka2objHY8LY/edit#slide=id.p1
// API: https://rapidapi.com/digiwalls/api/free-to-play-games-database

const gamesData = document.getElementById('gameData');
const navList = document.querySelectorAll('.nav-item .nav-link');
const loading = document.querySelector('.loading');
const detailsContent = document.getElementById('detailsContent');
const gamesContent = document.querySelector('.games');
const detailsPage = document.querySelector('.details');
const btnClose = document.getElementById('btnClose');

let prevIndex = 0;
let gameList;
let selectedIndex;

async function getGames(site, category){
    loading.classList.remove('d-none');

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

        if(response.status == 200){
            if(site == 's?category'){
                displayGames(result);
            }else if(site == '?id'){
                displayGameDetails(result);
            }
        }else{
            Swal.fire({
                title: "Error",
                text: "Something wrong, please check the internet connection!",
                icon: "error"
            });
            return;
        }

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Something wrong, please check the internet connection!",
            icon: "error"
        });
    }
}

getGames('s?category', 'mmorpg');

function displayGames(data){
    let innerCode = ``;
    for (let i = 0; i < data.length; i++) {
        innerCode += `
            <div class="col">
                <div data-id="${data[i].id}" class="card h-100 bg-transparent" role="button" onClick="clickedIndex(${i})">
                    <div class="card-body">
                        <figure class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${data[i].thumbnail}" alt="Game">
                        </figure>
                        <figcaption>
                            <div class="hstack justify-content-between">
                                <h3 class="h6 small">${data[i].title}</h3>
                                <span class="badge text-bg-primary p-2">Free</span>
                            </div>
                            <p class="card-text small text-center opacity-50">
                                ${data[i].short_description}
                            </p>
                        </figcaption>
                    </div>
                    <footer class="card-footer small hstack justify-content-between">
                        <span class="badge badge-color">${data[i].genre}</span>
                        <span class="badge badge-color">${data[i].platform}</span>
                    </footer>
                </div>
            </div>
        `
    }
    // data[i].short_description.split(" ").slice(0,8).join(" ")

    gamesData.innerHTML = innerCode;
    loading.classList.add('d-none');

    const cardList = document.querySelectorAll('.card');   
    cardList.forEach(card => {
        card.addEventListener('click', async () => {
            loading.classList.remove('d-none');
            await getGames('?id', data[selectedIndex].id);
            
            gamesContent.classList.add('d-none');
            detailsPage.classList.remove('d-none');
            loading.classList.add('d-none');
        });
    });
}

for (let i = 0; i < navList.length; i++) {
    navList[i].addEventListener('click', function(e){
        let clickedItem = e.target;
        getGames('s?category', clickedItem.text);

        navList[prevIndex].classList.remove('active');
        navList[i].classList.add('active');
        prevIndex = i;
    })
}

function displayGameDetails(data){
    let innerCode = ``;
    innerCode += `
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
        `
        detailsContent.innerHTML = innerCode;
}

function clickedIndex(i){
    selectedIndex = i;
}

document.addEventListener('keydown', function(e){
    if(gamesContent.classList.contains('d-none')){
        if(e.key === 'Escape'){
            gamesContent.classList.remove('d-none');
            detailsPage.classList.add('d-none');
        }
    }       
});

btnClose.addEventListener('click', function(){
    if(gamesContent.classList.contains('d-none')){
        gamesContent.classList.remove('d-none');
        detailsPage.classList.add('d-none');
    }  
})