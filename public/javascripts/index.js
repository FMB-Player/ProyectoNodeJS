document.addEventListener('DOMContentLoaded', () => {
    cargarEntrada();
    ImportResource('menu');
    ImportResource('footer');
    document.getElementById('buscador').addEventListener('submit', dispararBuscador);
    document.getElementById('category').addEventListener('change', switchCategory);
});
/**
 * Carga la categoría general deseada, o la de personajes por defecto, de la API.
 * Disparada al cargar la página y al cambiar categorías.
 * @param type - String. El valor de tipo de fetch a hacer (characters, comics, creators, events, series, stories) (characters).
 */
async function cargarEntrada(type = 'characters') {
    const data = await index(type, true);
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
    switch (type) {
        case 'characters':
            generarPersonajes(data);
            break;
        case 'comics':
            // generarComics(data);
            // TODO
            break;
        case 'creators':
            // generarCreadores(data);
            // TODO
            break;
        case 'events':
            // generarEventos(data);
            // TODO
            break;
        case 'series':
            // generarSeries(data);
            // TODO
            break;
        case 'stories':
            // generarHistorias(data);
            // TODO
            break;
        default:
            break;
    }
}

/**
 * Habilita o deshabilita todos los campos de todos los formularios de búsqueda.
 * @param bloquear - Bool. True para deshabilitar, false para habilitar (true).
 */
function switchAble(bloquear = true) {
    const inputs_formulario = document.getElementById('buscador').querySelectorAll('input');
    const selects_formulario = document.getElementById('buscador').querySelectorAll('select');
    const category_select = document.getElementById('category');

    const lista = [...inputs_formulario, ...selects_formulario, category_select];
    if (bloquear) {
        lista.forEach(element => {
            element.disabled = true;
            return true;
        });
    } else {
        lista.forEach(element => {
            element.disabled = false;
            return false;
        });
    }
}

/**
 * Genera elementos de personajes para el listado según la respuesta de la API.
 * @param data - Objeto que contiene la respuesta inmediata de la API.
 */
function generarPersonajes(data) {
    const listado = document.getElementById('listado');
    const resultados = document.getElementById('resultados');
    const results = data.data.results;
    if (results.length === 0) {
        resultados.textContent = '';
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
    resultados.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset) + "/" + (data.data.total);
    switchAble(false);
}

function dispararBuscador(e) {
    e.preventDefault();
    categoria = document.getElementById('category').value;
    console.log("Buscando en la categoría: " + categoria);
    switch (categoria) {
        case 'characters':
            buscarPersonaje(e);
            break;
        case 'comics':
            buscarComic(e);
            break;
        case 'creators':
            buscarCreador(e);
            break;
        case 'events':
            buscarEvento(e);
            break;
        case 'series':
            buscarSerie(e);
            break;
        case 'stories':
            buscarHistoria(e);
            break;
        default:
            console.log('Categoría no reconocida.');
            break;
    }
}

/**
 * Busca PERSONAJES en la API de Marvel según los campos del formulario.
 * @param {Event} e - Evento submit del formulario.
 * @async
 */
async function buscarPersonaje(e) {
    formulario = e.target;
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
        args.push('name=' + name);
        console.log('Buscando por el nombre: ' + name);
    }

    if (nameStartsWith.length > 0) {
        args.push('nameStartsWith=' + nameStartsWith);
        console.log('Buscando por el nombre que comienza con: ' + nameStartsWith);
    }

    if (limit > 0 && limit <= 100 && limit != NaN && typeof(limit) === 'number') {
        args.push('limit=' + limit);
        console.log('Limitando a ' + limit + ' resultados.');
    }

    if (offset > 0 && offset != NaN && typeof(offset) === 'number') {
        args.push('offset=' + offset);
        console.log('Desplazando ' + offset + ' resultados.');
    }

    const data = await buscarAPI('characters', true, ...args);
    if (data === -1) {
        generarError('Error al obtener los personajes.', formulario);
        formulario.reset();
        switchAble(false);
        return;
    }

    generarPersonajes(data);
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
}

/**
 * Función que se llama al cambiar el select de categorías.
 * Intercambia el formulario que se muestra dependiendo de la categoría seleccionada. Requiere la clase 'TrueHidden'.
 * Recibe el evento automáticamente, no enviar ningún argumento.
 */
function switchCategory(e) {
    const formulario = document.getElementById('buscador');
    const select = e.target;

    const fieldsets = formulario.querySelectorAll('fieldset');
    fieldsets.forEach(fieldset => {
        if (fieldset.id === 'buscador-' + select.value) {
            fieldset.classList.remove('TrueHidden');
        } else {
            fieldset.classList.add('TrueHidden');
        }
    });
    cargarEntrada(select.value);
    switchAble(true);
}