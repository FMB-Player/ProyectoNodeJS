/**
 * Importa el recurso HTML pasado como parámetro y lo inserta en el nodo con el id especificado.
 * @param {string} resource - El nombre del archivo HTML que se va a importar desde la carpeta "/resources", sin la ruta ni extensión de archivo.
 * @param {string} destination - El id del nodo donde se va a insertar el recurso. Si no se especifica, se utilizará el nombre del recurso.
 */
async function ImportResource(resource, destination = resource) {
    // Importar el HTML que tiene el menu.
    const response = await fetch('/resources/' + resource);
    if (!response.ok) {
        console.log('Error al cargar el recurso \"' + resource + '.html\"');
        return;
    } else {
        // obtener el contenido de texto en el menú.
        const html = await response.text();
        const parser = new DOMParser();
        // Parsear el texto retornado a elementos de HTML.
        const doc = parser.parseFromString(html, 'text/html');
        // Aislar el contenido del template.
        const template = doc.querySelector('template');
        // Obtener el elemento en el que se va a insertar ek menú.
        const header = document.getElementById(destination);
        // Insertar.
        header.appendChild(document.importNode(template.content, true));
        // Gracias GPT, ni sabía que se podía hacer fetch a HTML, tomar el contenido a modo de texto, ni mucho menos que podía hacer un parseo a etiquetas HTML.
    }
}