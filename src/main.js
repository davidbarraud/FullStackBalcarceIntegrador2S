// Importar api desde api.js
import { api } from "./api/api.js";

// Elementos del DOM
const cardContenedor = document.querySelector(".contenedorCard");
const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");
const textoBotones = document.getElementById("textoBotones");
const checkEstado = document.getElementById("checkEstado");
const selectEstado = document.getElementById("selectEstado");
const checkGenero = document.getElementById("checkGenero");
const selectGenero = document.getElementById("selectGenero");

//Variables usadas
let paginaInicial = 1;
let totalPaginas = 42;
let paginaActual = paginaInicial;
let filtroEstado = "";
let filtroGenero = "";
let filtrosActivos = false;


//Crear una card usando la API y creando también el modal con código html que crea la propia función.

  async function crearCard(id) {
        const apiInfo = await api.getApiInfo(id);
        const { name, status, species, type, gender, image } = apiInfo;
        if (apiInfo.error) {
            console.error(`Error: ${apiInfo.status} - ${apiInfo.message}`);
            return;
        }
        cardContenedor.innerHTML += `
        <div class="card mb-3 cardFondo" >
                <div class="row g-0 ">
                  <div class="col-md-12 ">
                    <a class="card-title textoBlanco nombreLink" href="#" data-bs-toggle="modal" data-bs-target="#modal-${id}">#${id} ${name}</a>
                    <img src="${image}" class="img-fluid rounded-start imagenCard" alt="${name}">
                  </div>
                </div>
        </div>
         `;
          // Crea el modal sin tocar body.innerHTML
        const modal = document.createElement("div");
        modal.innerHTML = `
          <div class="modal fade " id="modal-${id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel-${id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content modalFondo">
                <div class="modal-header">
                  <h1 class="modal-title fs-5 textoBlanco" id="modalLabel-${id}">#${id} ${name}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                  <img src="${image}" class="img-fluid mx-auto d-block mb-3" alt="${name}">
                  <p class="textoBlanco"> Status: <span class="${status == "Alive" ? "text-success" : "text-danger"}">${status}</span></p>
                  <p class="textoBlanco"> Species: ${species}</p>
                  <p class="textoBlanco"> Gender: ${gender}</p>
                  <p class="textoBlanco"> Type: ${type || 'No definido'}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" autofocus="false">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
} //fin función CrearCard
    

// Paginación general sin fultros. Filtra los más de 800 personajes y las 42 páginas, mostrando de a 20 personajes.
async function paginar(pagina) {
      const apiInfo = await api.getApiPaginacion(pagina);
      if (apiInfo.error) {
          console.error(`Error: ${apiInfo.status} - ${apiInfo.message}`);
          return;
      }
        // Limpiar el contenedor antes de mostrar los nuevos
      cardContenedor.innerHTML = "";
      for (const elemento of apiInfo.results) {
        await crearCard(elemento.id);
      }
      actualizarBotones(pagina, apiInfo.info.pages);
};


//Paginacion aplicando Filtros
async function aplicarFiltros(pagina = 1) {
  let url = `https://rickandmortyapi.com/api/character/?page=${pagina}`;
  if (filtroEstado) url += `&status=${filtroEstado}`;
  if (filtroGenero) url += `&gender=${filtroGenero}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    cardContenedor.innerHTML = "";
    if (data.error) {
      cardContenedor.innerHTML = `<p class="textoBlanco">No se encontraron resultados.</p>`;
      actualizarBotones(1, 1);
      return;
    }
    totalPaginas = data.info.pages;
    for (const personaje of data.results) {
        await crearCard(personaje.id);
    }
   // data.results.forEach(personaje => crearCard(personaje.id));
    actualizarBotones(pagina, totalPaginas);
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
  }
};


//Función para actualizar el estado de los botones Anterior y Siguiente y el texto entre medio
//si el número de la página es 1, entonces a la propiedad disabled del botónAnterior se le asigna un true.
// y si el valor de la página es igual al total se le asigna el valor true al botonSiguiente. Con esto se deshabilitan los botones
function actualizarBotones(pagina, total) {
  textoBotones.textContent = `${pagina} de ${total}`;
  botonAnterior.disabled = (pagina === 1);
  botonSiguiente.disabled = (pagina === total);
}


//Función para cambiar el estado de los filtros. Si se chequea un checkbox, se asigna el valor del select a la variable
function manejarFiltro() {
    filtroEstado = checkEstado.checked ? selectEstado.value : "";
    filtroGenero = checkGenero.checked ? selectGenero.value : "";
    filtrosActivos = checkEstado.checked || checkGenero.checked;
    paginaActual = 1;
    if (filtrosActivos) {
      aplicarFiltros(paginaActual);
    } else {
      paginar(paginaActual);
    }
}


// Eventos para check y selects
checkEstado.addEventListener("change", () => {
  selectEstado.disabled = !checkEstado.checked;
  manejarFiltro();
});
selectEstado.addEventListener("change", manejarFiltro);

checkGenero.addEventListener("change", () => {
  selectGenero.disabled = !checkGenero.checked;
  manejarFiltro();
});
selectGenero.addEventListener("change", manejarFiltro);



// Botones de paginación
botonAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      filtrosActivos ? aplicarFiltros(paginaActual) : paginar(paginaActual);
    }
});

botonSiguiente.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      filtrosActivos ? aplicarFiltros(paginaActual) : paginar(paginaActual);
    }
});

// Inicial
paginar(paginaActual);


