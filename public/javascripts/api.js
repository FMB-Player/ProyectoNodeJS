const KEY_PUBLIC = 'b79f16edb36f348e91d53ef2bf364c6d';
const KEY_PRIVATE = '31815d4440e266e989eb16be6959c875684ae745'
const API = 'https://gateway.marvel.com:443/v1/public/';
var ts = new Date().getTime().toString();
var hash = CryptoJS.MD5(ts + KEY_PRIVATE + KEY_PUBLIC).toString();

/**
 * Fetch COMPLETO del listado deseado de la API de Marvel.
 * Es la función principal que se llama en index.js y representa al fetch de bienvenida.
 * 
 * También se dispara al cambiar entre categorías.
 * @param type String. El valor de tipo de fetch a hacer (characters).
 * @param print Bool. Si se quiere imprimir la URL en consola (false).
 * @returns {Response | -1} data IF successful, -1 IF error.
 * @async
 */
async function index(type = 'characters', print = false) {
    try {
        const response = await fetch(URLsearchCategory(type, print));
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return (-1);
    }
}
/**
 * Fetch de personajes con los filtros especificados.
 * @param {String} type String. El valor de tipo de fetch a hacer (characters, comics, creators, events, series, stories).
 * @param {Bool} print Bool. Si se quiere imprimir la URL en consola.
 * @param {String} attributes Array. "attributeName=value"
 * @returns {Response | -1} data IF successful, -1 IF error.
 * @async
 */
async function buscarAPI(type, print, ...attributes) {
    if (!attributes) {
        try {
            const response = await index(type, print);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return (-1);
        }
    } else {
        try {
            const response = await fetch(URLsearchBy(type, print, ...attributes), {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return (-1);
        }
    }
}

/**
 * Retorna la URL para obtener el listado de personajes completo, o el value de especificarse.
 * La URL incluye el APIkey, timestamp y hash correspondientes.
 * Print solo es para poder visitar la API rápidamente y ver el formato de la response.
 * 
 * Usada para el índice de cada categoría.
 * @param value String. El valor de tipo de fetch a hacer (characters).
 * @param print Bool. Si se quiere imprimir la URL en consola (false).
 * @returns {String} String. URL text.
 */
function URLsearchCategory(value = 'characters', print = false) {
    url = (API + value + '?apikey=' + KEY_PUBLIC + '&ts=' + ts + '&hash=' + hash).toString();
    if (print) {
        console.log(url)
    }
    return url;
}

/**
 * Retorna la URL para obtener el listado deseado con los filtros especificados.
 * @param {String} type String. El valor de tipo de fetch a hacer (characters, comics, creators, events, series, stories).
 * @param {Bool} print Bool. Si se quiere imprimir la URL en consola.
 * @param {String} args Array. "attributeName=value"
 * @returns {String} String. URL text.
 */
function URLsearchBy(type, print, ...args) {
    let req = API + type;
    let hasFoundFirstElement = false;
    args.forEach(arg => {
        if (!hasFoundFirstElement) {
            req += '?';
            hasFoundFirstElement = true;
        } else {
            req += '&';
        }
        req += arg;
    });
    if (hasFoundFirstElement) {
        req += '&';
    } else {
        req += '?';
    }
    req += 'apikey=' + KEY_PUBLIC + '&ts=' + ts + '&hash=' + hash;
    if (print) {
        console.log(req);
    }
    return req;
}