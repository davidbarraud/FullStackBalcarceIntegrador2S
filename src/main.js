import { api } from "./api/api.js";

const cardContenedor = document.querySelector(".contenedorCard");


//const spinner = document.getElementById("spinner");

async function crearCard(id) {
        const apiInfo = await api.getApiInfo(id);
       // const urlApi =  api.url();
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

let paginaInicial = 1;
let totalPaginas = 42;
let paginaActual = paginaInicial;

async function paginar(pagina) {
    const apiInfo = await api.getApiPaginacion(pagina);
    // const urlApi =  api.url();
    if (apiInfo.error) {
        console.error(`Error: ${apiInfo.status} - ${apiInfo.message}`);
        return;
    }
    // Limpiar el contenedor antes de mostrar los nuevos
   cardContenedor.innerHTML = "";
   apiInfo.results.forEach(e => {
     crearCard(e.id);
   });
   // Actualizar número de página mostrado
   document.getElementById("textoBotones").textContent = `${pagina} de ${totalPaginas}`;
   // Actualizar estado de botones
       document.getElementById("botonAnterior").disabled = (pagina === paginaInicial);
       document.getElementById("botonSiguiente").disabled = (pagina === totalPaginas);
};
 
// Comportamiento de los botones
document.getElementById("botonAnterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    paginar(paginaActual);
  }
});

document.getElementById("botonSiguiente").addEventListener("click", () => {
  if (paginaActual < totalPaginas) {
    paginaActual++;
    paginar(paginaActual);
  }
});

//Activar o desactivar los Selects
const checkEstado = document.getElementById("checkEstado");
const selectEstado = document.getElementById("selectEstado");

const checkGenero = document.getElementById("checkGenero");
const selectGenero = document.getElementById("selectGenero");

checkEstado.addEventListener("change", () => {
  selectEstado.disabled = !checkEstado.checked;
});

checkGenero.addEventListener("change", () => {
  selectGenero.disabled = !checkGenero.checked;
  });


  
/// Código para Filtrar los datos

// Elementos del DOM
const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");
const textoBotones = document.getElementById("textoBotones");

checkEstado.addEventListener("change", manejarFiltro);
selectEstado.addEventListener("change", manejarFiltro);

checkGenero.addEventListener("change", manejarFiltro);
selectGenero.addEventListener("change", manejarFiltro);

function manejarFiltro() {
  // Activar/desactivar selects
  selectEstado.disabled = !checkEstado.checked;
  selectGenero.disabled = !checkGenero.checked;

  const aplicarFiltro = checkEstado.checked || checkGenero.checked;

  if (aplicarFiltro) {
    aplicarFiltros();
    
  } else {
    // Restaurar paginación
    paginaActual = 1;
    paginar(paginaActual);
  }
}

async function aplicarFiltros() {
  let url = `https://rickandmortyapi.com/api/character/?`;

  if (checkEstado.checked && selectEstado.value) {
    url += `status=${selectEstado.value}&`;
  }

  if (checkGenero.checked && selectGenero.value) {
    url += `gender=${selectGenero.value}&`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    cardContenedor.innerHTML = "";

    if (data.results) {
      data.results.forEach(personaje => crearCard(personaje.id));
    } else {
      cardContenedor.innerHTML = `<p class="textoBlanco">No se encontraron resultados.</p>`;
    }
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
  }
}




paginar(paginaActual);


