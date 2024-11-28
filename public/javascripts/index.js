document.addEventListener('DOMContentLoaded', () => {
    cargarPersonajes();
    ImportResource('menu');
    ImportResource('footer');
});

async function cargarPersonajes() {
    const data = await index();
    const results = data.data.results;

    
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
        document.getElementById('listado').appendChild(article);
    });
}
