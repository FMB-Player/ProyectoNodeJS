// https://gateway.marvel.com:443/v1/public/characters?name=IronMan&apikey=b79f16edb36f348e91d53ef2bf364c6d
// Ejemplo API Marvel. Solicitar en v1/public por el nombre de personaje "IronMan". Requiere APIkey b79f16edb36f348e91d53ef2bf364c6d

const KEY = 'b79f16edb36f348e91d53ef2bf364c6d';
const API = 'https://gateway.marvel.com:443/v1/public/';

function index() {
    // Obtener listado de personajes

    // TESTING
    fetch(API + 'characters?name=IronMan&apikey=' + KEY)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}