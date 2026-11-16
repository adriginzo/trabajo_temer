document.addEventListener('DOMContentLoaded', () => {
    const btnLectura = document.getElementById('btn-lectura');
    const contenidoPrincipal = document.getElementById('contenido-principal');

    // Comprobar si el navegador soporta síntesis de voz
    if ('speechSynthesis' in window && btnLectura) {
        let leyendo = false;

        btnLectura.addEventListener('click', () => {
            // Si ya está leyendo, detener
            if (leyendo || window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                resetearBoton();
                return;
            }

            // Extraer el texto limpio del contenido principal
            const textoALeer = contenidoPrincipal.innerText;
            const locucion = new SpeechSynthesisUtterance(textoALeer);
            
            locucion.lang = 'es-ES';
            locucion.rate = 1.0;  // Velocidad normal (0.5 a 2)
            locucion.pitch = 1.0; // Tono normal

            const voces = window.speechSynthesis.getVoices();
            const vozEspanol = voces.find(voz => voz.lang === 'es-ES') || voces.find(voz => voz.lang.startsWith('es'));
            if (vozEspanol) {
                locucion.voice = vozEspanol;
            }

            // Actualizar estado visual y ARIA al empezar
            locucion.onstart = () => {
                leyendo = true;
                btnLectura.setAttribute('aria-pressed', 'true');
                btnLectura.textContent = 'Detener Lectura';
            };

            // Restaurar botón al terminar o si ocurre un error
            locucion.onend = resetearBoton;
            locucion.onerror = resetearBoton;

            window.speechSynthesis.speak(locucion);
        });

        function resetearBoton() {
            leyendo = false;
            btnLectura.setAttribute('aria-pressed', 'false');
            btnLectura.textContent = 'Escuchar Página';
        }

        // Detener el audio si el usuario cierra o cambia de página
        window.addEventListener('beforeunload', () => {
            window.speechSynthesis.cancel();
        });
    } else if (btnLectura) {
        // Ocultar el botón si el navegador no soporta la API
        btnLectura.style.display = 'none';
    }
});