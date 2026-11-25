document.addEventListener('DOMContentLoaded', () => {

    // 1. MOTOR DE LECTURA AUTOMÁTICA (ACCESIBILIDAD)
    const btnLectura = document.getElementById('btn-lectura');
    const contenidoPrincipal = document.getElementById('contenido-principal');

    if ('speechSynthesis' in window && btnLectura) {
        let leyendo = false;

        btnLectura.addEventListener('click', () => {
            if (leyendo || window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                resetearBoton();
                return;
            }

            const textoALeer = contenidoPrincipal.innerText;
            const locucion = new SpeechSynthesisUtterance(textoALeer);
            
            locucion.lang = 'es-ES';
            locucion.rate = 1.0;
            locucion.pitch = 1.0;

            const voces = window.speechSynthesis.getVoices();
            const vozEspanol = voces.find(voz => voz.lang === 'es-ES') || voces.find(voz => voz.lang.startsWith('es'));
            if (vozEspanol) {
                locucion.voice = vozEspanol;
            }

            locucion.onstart = () => {
                leyendo = true;
                btnLectura.setAttribute('aria-pressed', 'true');
                btnLectura.textContent = 'Detener Lectura';
            };

            locucion.onend = resetearBoton;
            locucion.onerror = resetearBoton;

            window.speechSynthesis.speak(locucion);
        });

        function resetearBoton() {
            leyendo = false;
            btnLectura.setAttribute('aria-pressed', 'false');
            btnLectura.textContent = 'Escuchar Página';
        }

        window.addEventListener('beforeunload', () => {
            window.speechSynthesis.cancel();
        });
    } else if (btnLectura) {
        btnLectura.style.display = 'none';
    }

    // 2. BOTÓN DE ALTO CONTRASTE (Cambio de estilo en el documento)
    const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.addEventListener('click', () => {
            document.body.classList.toggle('alto-contraste');
        });
    }

    // 3. MOSTRAR / OCULTAR CONSEJOS (Aparición y desaparición de elementos)
    const btnConsejos = document.getElementById('btn-consejos');
    const listaConsejos = document.getElementById('lista-consejos');

    if (btnConsejos && listaConsejos) {
        btnConsejos.addEventListener('click', () => {
            if (listaConsejos.hidden) {
                listaConsejos.hidden = false;
                btnConsejos.textContent = 'Ocultar consejos';
                btnConsejos.setAttribute('aria-expanded', 'true');
            } else {
                listaConsejos.hidden = true;
                btnConsejos.textContent = 'Mostrar consejos';
                btnConsejos.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 4. RESALTAR TARJETAS DE PROVINCIA AL PASAR EL RATÓN O ENFOCAR
    const tarjetas = document.querySelectorAll('.tarjeta-provincia');
    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener('mouseover', () => {
            tarjeta.classList.add('destacada');
        });
        tarjeta.addEventListener('mouseout', () => {
            tarjeta.classList.remove('destacada');
        });
        tarjeta.addEventListener('focus', () => {
            tarjeta.classList.add('destacada');
        });
        tarjeta.addEventListener('blur', () => {
            tarjeta.classList.remove('destacada');
        });
    });

    // 5. ZOOM EN EL MAPA METEOROLÓGICO POR CIUDAD (dataset + cambio de atributo src)
    const botonesTiempo = document.querySelectorAll('.btn-tiempo');
    const iframeTiempo = document.getElementById('iframe-tiempo');

    botonesTiempo.forEach((boton) => {
        boton.addEventListener('click', () => {
            botonesTiempo.forEach(b => b.classList.remove('activo-tiempo'));
            boton.classList.add('activo-tiempo');

            if (iframeTiempo) {
                iframeTiempo.src = boton.dataset.mapa;
            }
        });
    });

});