document.addEventListener('DOMContentLoaded', () => {
    cargarPersonajes();
    ImportResource('menu');
    ImportResource('footer');
    document.getElementById('buscador').addEventListener('submit', buscarPersonaje);
});

async function cargarPersonajes() {
    const data = await index();
    if (data === -1) {
        generarError('Error al obtener los personajes.', document.getElementById('listado'));
        return;
    }

    generarPersonajes(data);
}

function generarPersonajes(data) {
    const listado = document.getElementById('listado');
    const results = data.data.results;
    if (results.length === 0) {
        generarError('No se encontraron personajes.', listado);
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

        const resultados = document.getElementById('resultados');
        resultados.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset + 1) + "/" + (data.data.total + 1);
    });
}

async function buscarPersonaje(e) {
    e.preventDefault();
    submit = document.getElementById('submit');
    submit.disabled = true;
    formulario = e.target;
    let p = document.getElementById('error');
    if (p) {
        p.remove();
    }

    const name = formulario.name.value.trim();
    const nameStartsWith = formulario.nameStartsWith.value.trim();
    const limit = Math.min(100, Math.max(1, parseInt(formulario.limit.value.trim())));
    const offset = formulario.offset.value.trim();

    const isNameNotEmpty = name !== '';
    const isNameStartsWithNotEmpty = nameStartsWith !== '';
    const isLimitNotEmpty = limit !== '';
    const isOffsetNotEmpty = offset !== '';
    counter = 0;
    errorCounter = 0;
    [isNameNotEmpty, isNameStartsWithNotEmpty, isLimitNotEmpty, isOffsetNotEmpty].forEach(rule => {
        counter++;
        if (!rule) {
            errorCounter++;
            console.log('Campo Nº' + counter + ' recibido vacío.');
        }
    });
    console.log(errorCounter + ' campos vacíos recibidos.');

    let args = [];
    if (isNameNotEmpty) args.push('name=' + name);
    if (isNameStartsWithNotEmpty) args.push('nameStartsWith=' + nameStartsWith);
    if (isLimitNotEmpty) args.push('limit=' + limit);
    if (isOffsetNotEmpty) args.push('offset=' + offset);

    const data = await buscarPersonajes('characters', true, ...args);
    submit.disabled = false;
    if (data === -1) {
        generarError('Error al obtener los personajes.', formulario);
        formulario.reset();
        return;
    }

    generarPersonajes(data);
}

function generarError(msg, parent) {
    p = document.createElement('p');
    p.id = 'error';
    p.textContent = msg;
    parent.appendChild(p);
    console.log(msg);
}