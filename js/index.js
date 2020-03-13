//let searchedText = [];
let searchedText = '';
const gifBox = document.getElementById('gifBox');
const results = document.getElementById('results');
// let wenOpenend = true;
// Un écouteur est placé pour chaque touche entrée au clavier
document.getElementById('searchBar').addEventListener('keydown' , (event) => {
    const key = event.key;
    isInputEmpty();
    /*if(key === 'Backspace'){
        searchedText.pop();
    } else if(key === 'Meta' || key === 'CapsLock') {
        searchedText.pop();
    }
    else*/ if(key === 'Enter'){
        searchedText = document.getElementById('searchBar').value;
        console.log(searchedText);
        const stringToSend = searchedText.toString().split(',').join('');
        const searchParams = new URLSearchParams();
        searchParams.set("search", stringToSend);
        const URLToReplace = new URL(document.location);
        URLToReplace.searchParams.set("q", stringToSend);
        window.history.pushState( {} , stringToSend, URLToReplace );

        httpGetData("GET", 'http://api.giphy.com/v1/gifs/search?q='+ stringToSend +'&api_key=PbQ4RGo0tMei3k2s6ppnW9zNVsMTH45Y').then(responseData => {
            console.log(responseData);
        });
    } /*else {
        searchedText.push(key);
    }*/
    // Test temps réel
    //const url = 'http://api.giphy.com/v1/gifs/search?q=' + searchedText + '&api_key=PbQ4RGo0tMei3k2s6ppnW9zNVsMTH45Y&'
    //console.log(url);
});
// Gérer la recherche de manière asynchrone ? exemple recherche chaque seconde ?

const httpGetData = (method, url, data) => {
    const loader = document.getElementById('loader');
    console.log('visible');
    loader.style.visibility = "visible";
    return fetch(url/*, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type' : 'application/json'} : {}
    }*/)
        .then(response => response.json())
        .then(content => {
            // console.log('hidden');
            loader.style.visibility = "hidden";
            //Créer une balise pour afficher les résultats

            if(content.data.length === 0) {
                results.innerHTML = "Désolé, cette recherche n'a retourné aucun résultat";
            }
            content.data.forEach(gif => {
                //Décentraliser pour éviter la redondence
                //createGifElement(gif);
                console.log(gif);
                const gifItem = document.createElement('li');
                const gifImg = document.createElement('img');
                const overlay = document.createElement('div');
                const fav = document.createElement('img');
                fav.src = './img/heart.svg';
                overlay.classList.add('heart');
                gifImg.src = gif.images.downsized.url;
                const gifBox = document.getElementById('gifBox');
                //gifImg.appendChild(overlay);
                overlay.appendChild(fav);
                gifItem.appendChild(overlay);
                gifItem.appendChild(gifImg);
                gifBox.appendChild(gifItem);
                gifItem.addEventListener('click', () => {

                    if(localStorage.getItem(gif.id)){
                        console.log("déjà présent");
                        localStorage.removeItem(gif.id);
                    } else {
                    localStorage.setItem(gif.id, gif.images.downsized.url);
                    console.log(localStorage.getItem(gif.id));
                    }
                });
                results.innerHTML = content.data.length + " résultats";
                //trier à l'envers pour les plus relevant en premier ?
            });
            loader.parentNode.insertBefore(results, loader.nextSibling);
            console.log('META', content.meta);
        })
        .catch(err => {
            console.log(err);
        });
};

// Affiche la croix ou non si le champ est rempli
const isInputEmpty = () => {
    const cross = document.getElementById('cross');
    if(searchedText.length !== 0){
        cross.style.visibility = 'visible';
    } else {
        cross.style.visibility = 'hidden';
    }
    cross.addEventListener('click', () => {
        document.getElementById('searchBar').value = '';
        searchedText = [];
        cross.style.visibility = 'hidden';
        gifBox.innerHTML = '';
        results.innerHTML = '';
    });
    // Issue : Selection global avec la souris
};

const urlParams = new URLSearchParams(window.location.search);
const param  = urlParams.get('q');
// A lancer à l'ouverture de la page
if(param){
    console.log(param);
    httpGetData("GET", 'http://api.giphy.com/v1/gifs/search?q='+ param +'&api_key=PbQ4RGo0tMei3k2s6ppnW9zNVsMTH45Y').then(responseData => {
        console.log(responseData);
    });
    searchedText = param;
    document.getElementById('searchBar').value = param;

    console.log(searchedText);
}

//Génère et affiche les éléments qui contiennent gif et fav
const createGifElement = (page, gif, gifId) => {
    console.log(gif);
    const gifItem = document.createElement('li');
    const gifImg = document.createElement('img');
    const overlay = document.createElement('div');
    const fav = document.createElement('img');
    fav.src = './img/heart.svg';
    overlay.classList.add('heart');
    if(document.getElementById('favoritedGifBox')) {
        console.log(gif);
    gifImg.src = gif;
    const gifBox = document.getElementById('favoritedGifBox');
    overlay.appendChild(fav);
    gifItem.appendChild(overlay);
    gifItem.appendChild(gifImg);
    gifBox.appendChild(gifItem);
    }
    //Click on one fav to remove from Local Storage
    gifItem.addEventListener('click', () => {
        console.log(gifId);
            localStorage.removeItem(gifId);
            //Remove here from page
        console.log(localStorage);

    });
};


/* Favorite page */
//document.getElementById('favoritedGifBox');

//Liste les gif dans le LocalStorage
const item = { ...localStorage};
console.log(item);
for (let [key, value] of Object.entries(item)) {
    console.log(`${value}`);
    createGifElement('favorite', value, key);
}



/*
const values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;

while ( i-- ) {
    values.push( localStorage.getItem(keys[i]) );
}
console.log('values : ' + values);
*/
