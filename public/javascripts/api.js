// https://gateway.marvel.com:443/v1/public/characters?name=IronMan&apikey=b79f16edb36f348e91d53ef2bf364c6d
// Ejemplo API Marvel. Solicitar en v1/public por el nombre de personaje "IronMan". Requiere APIkey b79f16edb36f348e91d53ef2bf364c6d

const KEY_PUBLIC = 'b79f16edb36f348e91d53ef2bf364c6d';
const KEY_PRIVATE = '31815d4440e266e989eb16be6959c875684ae745'
const API = 'https://gateway.marvel.com:443/v1/public/';
var ts = new Date().getTime();
var hash = CryptoJS.MD5(ts + KEY_PRIVATE + KEY_PUBLIC).toString();

/**
 * Fetch COMPLETO del listado de personajes de la API de Marvel.
 * @Returns data IF successful, -1 IF error.
 */
async function index() {
    // Obtener listado de personajes
    try {
        const response = await fetch(help('characters', true));
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return (-1);
    }
}
/**
 * Muestra en consola la URL para obtener el listado de personajes completo.
 * La URL incluye el APIkey, timestamp y hash correspondientes.
 * Solo es para poder visitar la API rápidamente y ver el formato de la response.
 * @param value El valor de tipo de fetch a hacer (characters).
 * @param print Si se quiere imprimir la URL en consola (false).
 * @Returns URL text.
 */
function help(value = 'characters', print = false) {
    urli = (API + value + '?apikey=' + KEY_PUBLIC + '&ts=' + ts + '&hash=' + hash).toString();
    if (print) {
        console.log(urli)
    }
    return urli;
}