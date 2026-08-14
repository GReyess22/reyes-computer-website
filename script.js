/**
 * REYES COMPUTER - Módulo de Lógica y Seguridad Frontend
 * Cumplimiento de Normativa OWASP A03:2021 (Injection / XSS) & MITRE CWE-79
 * 
 * Este script gestiona el cambio de contenido en las pestañas de cursos,
 * la seguridad en la captura de datos del usuario y el mensaje final.
 */

// ======================================================
// 💾 1. ESTRUCTURA DE DATOS (El Catálogo de Cursos)
// ======================================================

const cursosExcel = {
    basico: {
        titulo: "Excel Básico - Fundamentos Esenciales",
        descripcion: "¿Eres principiante o nunca has usado Excel? Este curso te dará las bases que necesitas para manejar la hoja de cálculo con confianza. Aprenderás a organizar información, crear tablas simples y realizar cálculos fundamentales.",
        puntos: ["Introducción a la interfaz", "Tipos de datos y formatos", "Fórmulas básicas (SUMA, PROMEDIO)", "Formato condicional"],
        duracion: "8 Horas de Capacitación",
        imagen: "url/a/imagen_basico.jpg" // Reemplace con su URL real
    },
    intermedio: {
        titulo: "Excel Intermedio - Análisis e Informes",
        descripcion: "Domina el análisis de datos y la creación de reportes dinámicos. Este curso está diseñado para usuarios que ya conocen los fundamentos y necesitan pasar al siguiente nivel profesional.",
        puntos: ["Tablas Dinámicas (Pivot Tables)", "Funciones lógicas avanzadas (SI, Y, O)", "Búsqueda avanzada (BUSCARV/XLOOKUP)", "Gráficos profesionales"],
        duracion: "18 Horas de Capacitación",
        imagen: "url/a/imagen_intermedio.jpg" // Reemplace con su URL real
    },
    avanzado: {
        titulo: "Excel Avanzado - Modelización y Automatización",
        descripcion: "El nivel maestro. Aprende a modelizar datos complejos, automatizar tareas repetitivas e interactuar con otras herramientas mediante VBA o Power Query.",
        puntos: ["Power Query (Extracción de Datos)", "Macros y Visual Basic for Applications (VBA)", "Solver para optimización", "Modelos financieros avanzados"],
        duracion: "24 Horas de Capacitación",
        imagen: "url/a/imagen_avanzado.jpg" // Reemplace con su URL real
    }
};

// ======================================================
// 🛡️ 2. UTILIDAD DE SEGURIDAD (Sanitización XSS)
// ======================================================

/**
 * Escapa caracteres HTML en una cadena de texto para prevenir ataques XSS.
 * Esto es CRÍTICO antes de inyectar cualquier dato proveniente del usuario en el DOM.
 * @param {string} str - La cadena a sanitizar.
 * @returns {string} La cadena segura.
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
}

// ======================================================
// 🖼️ 3. MANEJO DE VISTAS (Cambio de Pestañas)
// ======================================================

/**
 * Llena el contenido principal de la página con los detalles del curso seleccionado.
 * @param {string} nivel - La clave del curso ('basico', 'intermedio', 'avanzado').
 */
function cambiarTabExcel(nivel) {
    const cursos = cursosExcel[nivel];
    if (!cursos) return;

    const contentDiv = document.getElementById('content-excel');
    const tabButtons = document.querySelectorAll('.tab-button');

    // 1. Actualizar el estado de los botones (UX)
    tabButtons.forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('bg-slate-700', 'text-slate-300');
    });
    document.getElementById(`button-${nivel}`).classList.add('bg-emerald-600', 'text-white');
    document.getElementById(`button-${nivel}`).classList.remove('bg-slate-700', 'text-slate-300');


    // 2. Construir el contenido HTML dinámicamente
    let puntosHtml = cursos.puntos.map(punto => `<li>${punto}</li>`).join('');

    const contentHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Columna de Imagen -->
            <div class="md:w-1/3">
                <img src="${cursos.imagen}" alt="${cursos.titulo}" class="rounded-lg shadow-xl w-full object-cover transform transition duration-500 hover:scale-[1.02]">
            </div>
            <!-- Columna de Descripción -->
            <div class="md:w-2/3">
                <h2 class="text-4xl font-extrabold text-slate-900 mb-4">${cursos.titulo}</h2>
                <p class="text-xl text-slate-700 mb-6">${cursos.descripcion}</p>

                <!-- Puntos Clave -->
                <div class="mb-8">
                    <h3 class="text-2xl font-semibold border-b pb-2 text-emerald-600 mb-4">Temario Principal:</h3>
                    <ul class="space-y-2 list-none pl-0 text-lg text-slate-600">
                        ${puntosHtml}
                    </ul>
                </div>

                <!-- Duración y CTA -->
                <div class="flex justify-between items-center bg-emerald-50 p-4 rounded-lg shadow-inner mt-6">
                    <span class="text-xl font-medium text-slate-800">${cursos.duracion}</span>
                    <button id="whatsapp-cta" 
                            class="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full transition duration-300 shadow-lg">
                        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.84c-.45-1.93-2.73-3.17-5.05-3.17-2.32 0-4.6.8-5.05 3.17l.55 2.44 5.13 2.3zM19 3v10h-3l-4-4-4 4H7V3h3l4 4 4-4h3z"/></svg>
                        Consulta por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;

    // 3. Inyectar el contenido y aplicar la transición suave (Clase CSS)
    contentDiv.innerHTML = contentHTML;
    contentDiv.classList.add('tab-transition'); // Aplicamos la clase de transición definida en CSS
}


// ======================================================
// ✅ 4. MANEJO DE FORMULARIO Y RESPUESTA EXITOSA (Seguro)
// ======================================================

/**
 * Muestra el mensaje de respuesta evitando vulnerabilidades XSS.
 * UTILIZA textContent para garantizar que los datos sean tratados como texto puro, no HTML ejecutable.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} correo - Correo electrónico del usuario.
 * @param {string} interes - Nivel de interés (ej: 'Intermedio').
 */
function mostrarRespuestaExitosa(nombre, correo, interes) {
    const contenedor = document.getElementById('mensaje-respuesta');
    if (!contenedor) return;
    
    // Limpiar contenido previo
    contenedor.textContent = ''; 

    // Creación segura de elementos (usando textContent para prevenir XSS)
    const titulo = document.createElement('strong');
    titulo.className = 'block font-bold text-emerald-300 text-base mb-1';
    // Uso seguro: se escapa el nombre antes de usarlo en el texto
    titulo.textContent = `¡Gracias, ${nombre}! Tu solicitud ha sido recibida de manera segura.`;

    const detalle = document.createElement('p');
    detalle.className = 'mt-1 text-slate-200';
    // Uso seguro: se escapa el correo e interés
    detalle.textContent = `Nos pondremos en contacto con usted al correo (${correo}) para brindarle los detalles del servicio seleccionado: [${interes}].`;

    contenedor.appendChild(titulo);
    contenedor.appendChild(detalle);
    container.classList.remove('hidden'); // Mostrar el contenedor de mensaje

    // Desplazamiento suave a la notificación
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ======================================================
// 🚀 5. INICIALIZACIÓN Y EVENT LISTENERS
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

    // A) Inicialización del Tab de Cursos (Se carga el nivel Básico por defecto)
    cambiarTabExcel('basico');

    const tabButtonsContainer = document.getElementById('tab-buttons');
    if (tabButtonsContainer) {
        tabButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                // Obtener el nivel del botón clickeado (ej: 'basico')
                const nivel = e.target.id.replace('button-', ''); 
                cambiarTabExcel(nivel);
            }
        });
    }

    // B) Manejo de Envío del Formulario
    document.getElementById('formContacto')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const form = e.target;
        
        // 1. Capturar datos (usando valores sanitizados para la función de éxito)
        const nombreRaw = form.elements['nombre'].value;
        const correoRaw = form.elements['correo'].value;
        let interesRaw = '';

        // Identificar el nivel de interés basado en el tab activo
        const activeTab = document.querySelector('.tab-button.bg-emerald-600');
        if (activeTab) {
             interesRaw = activeTab.id.replace('button-', '').toUpperCase();
        } else {
            interesRaw = "Nivel de interés no especificado";
        }

        // 2. *** SEGURIDAD CRÍTICA: Sanitizar los inputs ***
        const nombreSanitizado = escapeHTML(nombreRaw);
        const correoSanitizado = escapeHTML(correoRaw);
        // Interes se maneja con el texto puro, ya que proviene de una estructura controlada

        /* 
         * En un entorno real: Aquí iría la llamada AJAX/fetch a su API. 
         * Ejemplo: fetch('/api/contacto', { method: 'POST', body: JSON.stringify({nombreSanitizado, correoSanitizado, interesRaw}) })
         */

        // Simulamos el éxito de la petición al backend y mostramos la respuesta segura
        mostrarRespuestaExitosa(nombreSanitizado, correoSanitizado, interesRaw); 
    });


     // C) Manejo del WhatsApp CTA (Opcional: Abrir en una nueva pestaña con un mensaje predefinido)
    document.getElementById('whatsapp-cta')?.addEventListener('click', () => {
        const activo = document.querySelector('.tab-button.bg-emerald-600');
        if (!activo) return;

        let textoMensaje = `Hola, estoy interesado en el curso ${activo.id} (${activo.textContent}). ¿Podrían darme más detalles sobre costos y fechas?`;
        const urlWhatsApp = `https://wa.me/8096021991?message=${encodeURIComponent(textoMensaje)}`;

        window.open(urlWhatsApp, '_blank');
    });
});
 