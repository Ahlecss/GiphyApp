let searchedText = '';
const gifBox = document.querySelector('#gif_box');
const results = document.querySelector('#results');
const loader = document.querySelector('.loader');
const favs = document.querySelector('.favs');
const favoritedGifsBox = document.querySelector('.favorites--gif_box');
const searchedInput = document.getElementById('search--input');
let favOpened = false;
// let wenOpenend = true;

favs.addEventListener('click', () => {
    if(favOpened){
        favOpened = false;
        favoritedGifsBox.classList.remove('isOpen');
        document.querySelector('.mainpage').classList.remove('isClosed');
        favoritedGifsBox.innerHTML= '';
        favs.innerHTML = 'Favoris';
    } else {
        favOpened = true;
        favoritedGifsBox.classList.add('isOpen');
        const back = document.createElement('img');
        document.querySelector('.mainpage').classList.add('isClosed');
        back.src = './img/back.svg';
        favs.innerHTML = '';
        favs.appendChild(back);
        getFavsFromLocalStorage();
    }
});

// Un écouteur est placé pour chaque touche entrée au clavier
const handleSearchInput = (event) => {
    const key = event.key;
    isInputEmpty();
    if(key === 'Enter'){
        searchedText = searchedInput.value;
        const stringToSend = searchedText;
        const searchParams = new URLSearchParams();
        searchParams.set("search", stringToSend);
        const URLToReplace = new URL(document.location);
        URLToReplace.searchParams.set("q", stringToSend);
        window.history.pushState( {} , stringToSend, URLToReplace );
        httpGetData("GET", 'http://api.giphy.com/v1/gifs/search?q='+ stringToSend +'&api_key=PbQ4RGo0tMei3k2s6ppnW9zNVsMTH45Y').then(responseData => {
            console.log(responseData);
        });
    }
};
searchedInput.addEventListener('keydown', (event) => handleSearchInput(event));

// Découper
const httpGetData = (method, url, data) => {
    loader.style.visibility = "visible";
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type' : 'application/json'} : {}
    })
        .then(response => response.json())
        .then(content => showGifs(content) )
        .catch(err => {
            console.log(err);
        });
};

const showGifs = (content) => {
    loader.style.visibility = "hidden";
    loader.parentNode.insertBefore(results, loader.nextSibling);
    if(content.data.length === 0) {
        results.innerHTML = "Désolé, cette recherche n'a retourné aucun résultat";
    } else {
        results.innerHTML = content.data.length + " résultats";
    }
    content.data.forEach(gif => {
        createGifElement('search', gif.images.downsized.url, gif.id);
        //trier à l'envers pour les plus relevant en premier ?
    });

};

//Génère et affiche les éléments qui contiennent gif et fav
const createGifElement = (page, gif, gifId) => {
    const gifItem = document.createElement('li');
    const gifImg = document.createElement('img');
    const overlay = document.createElement('div');
    const fav = document.createElement('img');
    overlay.classList.add('heart');
    overlay.appendChild(fav);
    gifItem.appendChild(overlay);
    gifItem.appendChild(gifImg);

    if(page === "search") {

        gifItem.classList.add(gifId);
        fav.src = './img/emptyHeart.svg';
        gifImg.src = gif;
        gifBox.appendChild(gifItem);
        getFromLocalStorage();

        const handleGifLocalStorage = () => {
            if(localStorage.getItem(gifId)){
                fav.src = './img/emptyHeart.svg';
                localStorage.removeItem(gifId);
            } else {
                fav.src = './img/fullHeart.svg';
                localStorage.setItem(gifId, gif);
            }
        };
        gifItem.addEventListener('click', (event) => handleGifLocalStorage(event));

    } else if(page === "favorites") {
        gifItem.classList.add(gifId);
        fav.src = './img/fullHeart.svg';
        gifImg.src = gif;
        favoritedGifsBox.appendChild(gifItem);
        //Click on one fav to remove from Local Storage
        //Virer les listeners inutiles
        const handleRemoveFromLocalStorage = () => {
            const gifToRemove = document.querySelector('.' + gifId);
            gifToRemove.parentNode.removeChild(gifToRemove);
            localStorage.removeItem(gifId);
        };
        gifItem.addEventListener('click', () => handleRemoveFromLocalStorage())
    }
};

//Liste les gif dans le LocalStorage
const getFavsFromLocalStorage = () => {
    const item = { ...localStorage};
    for (let [key, value] of Object.entries(item)) {
        createGifElement('favorites', value, key);
    }
};
// A l'arrivée sur la page d'accueil, faire un check des ID des Gifs présents dans le local sto et les comparer avec ceux venant de s'afficher
const getFromLocalStorage = () => {
    const item = { ...localStorage};
    for (let [key, value] of Object.entries(item)) {
    }
};

// Affiche la croix ou non si le champ est rempli
const isInputEmpty = () => {
    const cross = document.getElementById('search--cross');
    if(searchedText.length !== 0){
        cross.style.visibility = 'visible';
    } else {
        cross.style.visibility = 'hidden';
    }
    //Remove les event listeners
    cross.addEventListener('click', () => {
        searchedInput.value = '';
        cross.style.visibility = 'hidden';
        gifBox.innerHTML = '';
        results.innerHTML = '';
    });
    // Issue : Selection global avec la souris
};

const searchWhenParamsAlready = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const param  = urlParams.get('q');
    // A lancer à l'ouverture de la page
    if(param){
        httpGetData("GET", 'http://api.giphy.com/v1/gifs/search?q='+ param +'&api_key=PbQ4RGo0tMei3k2s6ppnW9zNVsMTH45Y').then(responseData => {
            console.log(responseData);
        });
        searchedText = param;
        searchedInput.value = param;
    }
};
searchWhenParamsAlready();