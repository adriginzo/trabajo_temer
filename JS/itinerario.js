/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Cajas destino (igual que tapetes en solitario.js)
let caja_banco = document.getElementById("banco");
let caja_dia1  = document.getElementById("dia1");
let caja_dia2  = document.getElementById("dia2");
let caja_dia3  = document.getElementById("dia3");

// Contadores
let cont_banco = document.getElementById("cont_banco");
let cont_dia1  = document.getElementById("cont_dia1");
let cont_dia2  = document.getElementById("cont_dia2");
let cont_dia3  = document.getElementById("cont_dia3");

let cont_rutas = document.getElementById("cont_rutas");
let cont_km    = document.getElementById("cont_km");
let cont_co2   = document.getElementById("cont_co2");

// Lista de zonas donde se puede soltar
let zonas_destino = [caja_banco, caja_dia1, caja_dia2, caja_dia3];

for (let i = 0; i < zonas_destino.length; i++) {
    zonas_destino[i].ondragenter = function(e) { e.preventDefault(); };
    zonas_destino[i].ondragover  = function(e) { e.preventDefault(); };
    zonas_destino[i].ondragleave = function(e) { e.preventDefault(); };
    zonas_destino[i].ondrop      = soltar;
}

// Asignar evento ondragstart a todas las fichas de ruta
let fichas = document.querySelectorAll(".ficha-ruta");

for (let i = 0; i < fichas.length; i++) {
    fichas[i].ondragstart = al_mover;
    fichas[i].ondrag      = function(e) {};
    fichas[i].ondragend   = function() {};
}

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Botón reiniciar
document.getElementById("reset").onclick = reiniciar_plan;


// Funciones de Drag & Drop (mismo patrón que solitario.js)
function al_mover(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function soltar(e) {
    e.preventDefault();

    let ruta_id = e.dataTransfer.getData("text");
    let ruta = document.getElementById(ruta_id);
    if (!ruta) return;

    // Añadir la ficha a la caja donde se ha soltado
    this.appendChild(ruta);

    // Recalcular todos los contadores
    actualizar_contadores();
}

function set_contador(contador, valor) {
    contador.innerHTML = valor;
}

function actualizar_contadores() {
    let rutas_banco = caja_banco.querySelectorAll(".ficha-ruta");
    let rutas_dia1  = caja_dia1.querySelectorAll(".ficha-ruta");
    let rutas_dia2  = caja_dia2.querySelectorAll(".ficha-ruta");
    let rutas_dia3  = caja_dia3.querySelectorAll(".ficha-ruta");

    set_contador(cont_banco, rutas_banco.length);
    set_contador(cont_dia1, rutas_dia1.length);
    set_contador(cont_dia2, rutas_dia2.length);
    set_contador(cont_dia3, rutas_dia3.length);

    let total_rutas = rutas_dia1.length + rutas_dia2.length + rutas_dia3.length;
    let total_km = 0;

    let dias = [caja_dia1, caja_dia2, caja_dia3];
    for (let i = 0; i < dias.length; i++) {
        let fichas_dia = dias[i].querySelectorAll(".ficha-ruta");
        for (let j = 0; j < fichas_dia.length; j++) {
            total_km += Number(fichas_dia[j].getAttribute("data-km"));
        }
    }

    // Estimación: 0.15 kg de CO2 ahorrado por cada km hecho sin coche
    let total_co2 = (total_km * 0.15).toFixed(1);

    set_contador(cont_rutas, total_rutas);
    set_contador(cont_km, total_km);
    set_contador(cont_co2, total_co2);
}

function reiniciar_plan() {
    for (let i = 0; i < fichas.length; i++) {
        caja_banco.appendChild(fichas[i]);
    }
    actualizar_contadores();
}


const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.addEventListener('click', () => {
            document.body.classList.toggle('alto-contraste');
        });
    }

document.getElementById("btn-lectura").onclick = function() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    } else {
        let texto = document.getElementById("contenido-principal").innerText;
        let voz = new SpeechSynthesisUtterance(texto);
        voz.lang = "es-ES";
        window.speechSynthesis.speak(voz);
    }
};