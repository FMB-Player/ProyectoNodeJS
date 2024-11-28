document.addEventListener('DOMContentLoaded', cargarPersonajes);

async function cargarPersonajes() {
    const data = await index();

    data.data.results.forEach(personaje => {
        li = document.createElement('li');
        li.innerHTML = personaje.name;
        document.getElementById('personajes').appendChild(li);
    });
}
