var firstTrip = true;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('footer').classList.add('loadedFooter', 'NoResults');
    document.getElementById('buscador').addEventListener('submit', dispararBuscador);
    document.getElementById('category').addEventListener('change', switchCategory);
    cargarEntrada();
});

/**
 * Carga la categoría general deseada, o la de personajes por defecto, de la API.
 * Disparada al cargar la página y al cambiar categorías.
 * @param type - String. El valor de tipo de fetch a hacer (characters, comics, creators, events, series, stories) (characters).
 * @async
 */
async function cargarEntrada(type = 'characters') {
    console.clear();
    const data = await index(type, false);
    if (data === -1) {
        let msg;
        switch (type) {
            case 'characters':
                msg = 'Error al obtener los personajes.';
                break;
            case 'comics':
                msg = 'Error al obtener los comics.';
                break;
            case 'creators':
                msg = 'Error al obtener los creadores.';
                break;
            case 'events':
                msg = 'Error al obtener los eventos.';
                break;
            case 'series':
                msg = 'Error al obtener las series.';
                break;
            case 'stories':
                msg = 'Error al obtener las historias.';
                break;
            default:
                msg = 'Error al cargar.';
                break;
        }
            generarError(msg, document.getElementById('listado'));
            return;
    }
    if (firstTrip) {
        Copyright(data);
        moveFooter(true);
        firstTrip = false;
    }
    switch (type) {
        case 'characters':
            generarPersonajes(data);
            break;
        case 'comics':
            generarComics(data);
            break;
        case 'creators':
            switchAble(false);  //TEMP.
            // generarCreadores(data);
            // TODO
            break;
        case 'events':
            switchAble(false);  //TEMP.
            // generarEventos(data);
            // TODO
            break;
        case 'series':
            switchAble(false);  //TEMP.
            // generarSeries(data);
            // TODO
            break;
        case 'stories':
            switchAble(false);  //TEMP.
            // generarHistorias(data);
            // TODO
            break;
        default:
            break;
    }
}

/**
 * Habilita o deshabilita todos los campos de todos los formularios de búsqueda.
 * 
 * Pensar en: "¿Quiero el atributo disabled?"
 * @param bloquear - Bool. True para deshabilitar, false para habilitar (true).
 */
function switchAble(bloquear = true) {
    const inputs_formulario = document.getElementById('buscador').querySelectorAll('input');
    const selects_formulario = document.getElementById('buscador').querySelectorAll('select');
    const category_select = document.getElementById('category');

    const lista = [...inputs_formulario, ...selects_formulario, category_select];

    lista.forEach(element => {
        element.disabled = bloquear;
        return bloquear;
    });
}

/**
 * Genera elementos de personajes para el listado según la respuesta de la API.
 * @param {Promise} data - Objeto que contiene la respuesta inmediata de la API.
 */
function generarPersonajes(data) {
    const listado = document.getElementById('listado');
    const resultados_index = document.getElementById('resultados');
    const results = data.data.results;
    if (results.length === 0) {
        resultados_index.textContent = '';
        listado.innerHTML = '';
        generarError('No se encontraron personajes.', listado);
        switchAble(false);
        return;
    }
    listado.innerHTML = '';
    results.forEach(personaje => {
        const article = document.createElement('article');
        article.className = 'personaje_banner';

        const img = document.createElement('img');
        img.className = 'personaje_img';

        const a = document.createElement('a');
        a.className = 'personaje_name';

        // const br = document.createElement('br');

        img.src = personaje.thumbnail.path + '.' + personaje.thumbnail.extension;
        img.alt = personaje.name;
        a.textContent = personaje.name;
        a.href = '/personaje' + '?id=' + personaje.id;

        article.appendChild(img);
        // article.appendChild(br);
        article.appendChild(a);
        listado.appendChild(article);

    });
    resultados_index.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset) + "/" + (data.data.total);
    switchAble(false);
}

/**
 * Genera elementos de cómics para el listado según la respuesta de la API.
 * @param {Promise} data - Objeto que contiene la respuesta inmediata de la API.
 */
function generarComics(data) {
    const listado = document.getElementById('listado');
    const resultados_index = document.getElementById('resultados');
    const results = data.data.results;
    if (results.length === 0) {
        resultados_index.textContent = '';
        listado.innerHTML = '';
        generarError('No se encontraron comics.', listado);
        switchAble(false);
        return;
    }
    listado.innerHTML = '';
    results.forEach(comic => {
        const article = document.createElement('article');
        article.className = 'comic_banner';

        const img = document.createElement('img');
        img.className = 'comic_img';

        const a = document.createElement('a');
        a.className = 'comic_title';

        img.src = comic.thumbnail.path + '.' + comic.thumbnail.extension;
        img.alt = comic.title;
        a.textContent = comic.title;
        a.href = '/comic' + '?id=' + comic.id;

        article.appendChild(img);
        article.appendChild(a);
        listado.appendChild(article);
    });
    resultados_index.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset) + "/" + (data.data.total);
    switchAble(false);
}

/**
 * Dispara la función de validación y búsqueda correspondiente según la categoría seleccionada en el select.
 * @param {Event} e - Evento de submit del formulario.
 */
function dispararBuscador(e) {
    e.preventDefault();
    const category = document.getElementById('category').value;
    console.clear();
    console.log("Buscando en la categoría: " + category);
    switch (category) {
        case 'characters':
            buscarPersonajes(e);
            break;
        case 'comics':
            buscarComics(e);
            break;
        case 'creators':
            // buscarCreadores(e);
            // TODO
            break;
        case 'events':
            // buscarEventos(e);
            // TODO
            break;
        case 'series':
            // buscarSeries(e);
            // TODO
            break;
        case 'stories':
            // buscarHistorias(e);
            // TODO
            break;
        default:
            console.log('Error de entrada. Categoría no reconocida.');
            break;
    }
}

/**
 * Busca PERSONAJES en la API de Marvel según los campos del formulario.
 * @param {Event} e - Evento submit del formulario.
 * @async
 */
async function buscarPersonajes(e) {
    const formulario = e.target;
    switchAble();
    limpiarError();

    const name = formulario.characters_name.value.trim();
    const nameStartsWith = formulario.characters_nameStartsWith.value.trim();
    const limit = Math.min(100, Math.max(1, parseInt(formulario.characters_limit.value.trim())));
    const offset = Math.max(0, parseInt(formulario.characters_offset.value.trim()));

    // Logger de debug. Espera campos Nº1, 2, 3 y 4. Confirma si se recibieron vacíos. La API no acepta valores vacíos.
    /* counter = 0;
    errorCounter = 0;
    [isNameValid, isNameStartsWithValid, isLimitValid, isOffsetValid].forEach(rule => {
        counter++;
        if (!rule) {
            errorCounter++;
            console.log('Campo Nº' + counter + ' recibido vacío.');
        }
    });
    console.log(errorCounter + ' campos vacíos recibidos.'); */

    let args = [];
    if (name.length > 0) {
        args.push(('name=' + name).toString());
        console.log('Buscando por el nombre: ' + name);
    }

    if (nameStartsWith.length > 0) {
        args.push(('nameStartsWith=' + nameStartsWith).toString());
        console.log('Buscando por el nombre que comienza con: ' + nameStartsWith);
    }

    if (limit > 0 && limit != 20 && limit <= 100 && limit != NaN && typeof(limit) === 'number') {
        args.push(('limit=' + limit).toString());
        console.log('Limitando a ' + limit + ' resultados.');
    }

    if (offset > 0 && offset != NaN && typeof(offset) === 'number') {
        args.push(('offset=' + offset).toString());
        console.log('Desplazando ' + offset + ' resultados.');
    }

    const data = await buscarAPI('characters', false, ...args);
    if (data === -1) {
        generarError('Error al obtener los personajes.', formulario);
        formulario.reset();
        switchAble(false);
        return;
    }

    generarPersonajes(data);
}

/**
 * Busca CÓMICS en la API de Marvel según los campos del formulario.
 * @param {Event} e - Evento submit del formulario.
 * @async
 */
async function buscarComics(e) {
    const formulario = e.target;
    switchAble();
    limpiarError();

    const title = formulario.comics_title.value.trim();
    const titleStartsWith = formulario.comics_titleStartsWith.value.trim();
    const format = formulario.comics_format.value.trim();
    const formatType = formulario.comics_formatType.value.trim();
    const startYear = parseInt(formulario.comics_startYear.value.trim());
    const issueNumber = parseInt(formulario.comics_issueNumber.value.trim());
    const noVariants = formulario.comics_noVariants.checked;
    const hasDigitalIssue = formulario.comics_hasDigitalIssue.checked;
    const limit = Math.min(100, Math.max(1, parseInt(formulario.comics_limit.value.trim())));
    const offset = Math.max(0, parseInt(formulario.comics_offset.value.trim()));

    const AÑO_ACTUAL = new Date().getFullYear();

    let args = [];
    if (title.length > 0) {
        args.push(('title=' + title).toString());
        console.log('Buscando por el nombre: ' + title);
    }

    if (titleStartsWith.length > 0) {
        args.push(('titleStartsWith=' + titleStartsWith).toString());
        console.log('Buscando por el nombre que comienza con: ' + titleStartsWith);
    }

    if (format.length > 0) {
        args.push(('format=' + format).toString());
        console.log('Buscando por el formato: ' + format);
    }

    if (formatType.length > 0) {
        args.push(('formatType=' + formatType).toString());
        console.log('Buscando por el tipo de formato: ' + formatType);
    }

    if (startYear > 0 && startYear <= AÑO_ACTUAL && startYear != NaN && typeof(startYear) === 'number') {
        args.push(('startYear=' + startYear).toString());
        console.log('Buscando por el año de inicio: ' + startYear);
    }

    if (issueNumber > 0 && issueNumber != NaN && typeof(issueNumber) === 'number') {
        args.push(('issueNumber=' + issueNumber).toString());
        console.log('Buscando por el número de issue: ' + issueNumber);
    }

    if (noVariants) {
        args.push('noVariants=true');
        console.log('Buscando cómics sin variantes.');
    }

    if (hasDigitalIssue) {
        args.push('hasDigitalIssue=true');
        console.log('Buscando cómics con versión digital.');
    }

    if (limit > 0 && limit != 20 && limit <= 100 && limit != NaN && typeof(limit) === 'number') {
        args.push(('limit=' + limit).toString());
        console.log('Limitando a ' + limit + ' resultados.');
    }

    if (offset > 0 && offset != NaN && typeof(offset) === 'number') {
        args.push(('offset=' + offset).toString());
        console.log('Desplazando ' + offset + ' resultados.');
    }

    const data = await buscarAPI('comics', false, ...args);
    if (data === -1) {
        generarError('Error al obtener los comics.', formulario);
        formulario.reset();
        switchAble(false);
        return;
    }

    generarComics(data);
}

/**
 * Limpia el párrafo de error generado por generarError().
 */
function limpiarError() {
    let p = document.getElementById('error');
    if (p) {
        p.remove();
    }
}

/**
 * Genera un párrafo de error en el contenedor padre.
 * @param {String} msg - Mensaje de error.
 * @param {HTMLElement} parent - Contenedor padre.
 * @returns {void} Log de error a la consola.
 */
function generarError(msg, parent) {
    p = document.createElement('p');
    p.id = 'error';
    p.textContent = msg;
    parent.appendChild(p);
    console.log(msg);
    switchAble(false);
}

/**
 * Función que se llama al cambiar el select de categorías.
 * Intercambia el formulario que se muestra dependiendo de la categoría seleccionada. Requiere la clase 'TrueHidden'.
 * Recibe el evento automáticamente, no enviar ningún argumento.
 */
function switchCategory(e) {
    const formulario = document.getElementById('buscador');
    const category = e.target.value;
    const listado = document.getElementById('listado');
    const title = document.getElementById('category-title');
    let value;

    switch (category) {
        case "characters":
            value = "personajes";
            break;

        case "comics":
            value = "cómics";
            break;

        case "creators":
            value = "creadores";
            break;

        case "events":
            value = "eventos";
            break;

        case "series":
            value = "series";
            break;

        case "stories":
            value = "historias";
            break;
        default:
            value = "";
            break;
    }
    if (value !== "") {
        title.textContent = "Listado de " + value;
    } else {
        title.textContent = "Página de listados";
    }

    const fieldsets = formulario.querySelectorAll('fieldset');
    fieldsets.forEach(fieldset => {
        if (fieldset.id === 'buscador-' + category) {
            fieldset.classList.remove('TrueHidden');
        } else {
            fieldset.classList.add('TrueHidden');
        }
    });
    formulario.reset();
    listado.innerHTML = '';
    cargarEntrada(category);
    switchAble(true);
}

/**
 * Coloca el attributionText de un llamado a API en el link de copyright del footer.
 * 
 * @param {String} data - resultado inmediato del retorno de llamado a la API.
 */
function Copyright(data) {
    const footerCopy = document.getElementById('copyright');
    footerCopy.textContent = data.attributionText;
}

/**
 * Mueve el pie de página [fondo o libre] según sea necesario.
 * 
 * IF results, se quita la clase 'NoResults', lo que hace que el footer se ubique libremente para que los resultados lo desplace.
 * 
 * IF NOT results, se le pone la clase, lo que hace que se fuerce a mostrar en el fondo de la pantalla.
 * @param {Boolean} results - si hay resultados o no en vista (true).
 */
function moveFooter(results = true) {
    const footer = document.getElementById('footer');
    results ? footer.classList.remove('NoResults') : footer.classList.add('NoResults');
}   // FIXME

// FIXME: @moveFooter: Esto no es atractivo ni ágil, hay que mejorarlo y hacer que no se necesite andar cambiando clases.