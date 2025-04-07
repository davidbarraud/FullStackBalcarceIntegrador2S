import { api } from "./api/api.js";

const cardContenedor = document.querySelector(".contenedorCard");

//const spinner = document.getElementById("spinner");

async function crearCard(id) {
    const apiInfo = await api.getApiInfo(id);
    const urlApi =  api.url();
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
            <img src="${image}" class="img-fluid mx-auto d-block" alt="${name}">
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

const cantidad = 20;

async function cargarCards() {
    for (let i = 1; i <= cantidad; i++) {
        await crearCard(i); // Espera a que termine antes de continuar
    }
}

cargarCards();

/*  si se usa promesas
let promise = Promise.resolve(); // Inicia con una promesa resuelta

for (let i = 1; i <= 5; i++) {
    promise = promise.then(() => crearCard(i)); // Llama a cada card secuencialmente
}
*/