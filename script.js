/**
 * REYES COMPUTER - Módulo de Lógica y Seguridad Frontend
 * Cumplimiento de Normativa OWASP A03:2021 (Injection / XSS) & MITRE CWE-79
 */

const cursosExcel = {
    basico: {
        titulo: "Excel Básico - Fundamentos Prácticos",
        descripcion: "Diseñado para usuarios que desean dominar la navegación, estructuración limpia de tablas y cálculos esenciales sin errores.",
        puntos: [
            "Interfaz profesional y atajos de teclado de alta velocidad",
            "Formato de celdas, estilos y validación de datos",
            "Fórmulas matemáticas y estadísticas básicas (SUMA, PROMEDIO, CONTAR)",
            "Diseño e interpretación de gráficos explicativos"
        ],
        duracion: "12 Horas de Capacitación",
        imagen: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80"
    },
    intermedio: {
        titulo: "Excel Intermedio - Análisis e Informes",
        descripcion: "Ideal para analistas y asistentes administrativos que requieren procesar grandes volúmenes de datos con rapidez.",
        puntos: [
            "Funciones Búsqueda y Referencia: BUSCARX, BUSCARV e INDICE/COINCIDIR",
            "Lógica Condicional Compleja (SI, Y, O, SUMAR.SI.CONJUNTO)",
            "Tablas Dinámicas Avanzadas y Segmentadores de Datos",
            "Formato Condicional con Reglas Personalizadas"
        ],
        duracion: "18 Horas de Capacitación",
        imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    },
    avanzado: {
        titulo: "Excel Avanzado, Dashboards & Macros",
        descripcion: "Dirigido a gerentes y líderes técnicos que buscan automatizar tareas repetitivas y construir paneles de control ejecutivos.",
        puntos: [
            "Diseño e implementación de Dashboards Interactivos",
            "Introducción a Macros y Programación en VBA (Visual Basic)",
            "Power Query para Limpieza e Importación de Datos Externa",
            "Modelado Financiero y Análisis de Escenarios"
        ],
        duracion: "24 Horas de Capacitación",
        imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización de Menú Móvil
    const btnMenu = document.getElementById('btn-menu-mobile');
    const menu = document.getElementById('menu-mobile');
    if (btnMenu && menu) {
        btnMenu.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // 2. Inicialización de Tabs de Excel
    cambiarTabExcel('intermedio');

    // 3. Manejo del Formulario de Contacto
    const formContacto = document.getElementById('form-contacto');

    if (formContacto) {
        formContacto.addEventListener('submit', (event) => {
            event.preventDefault();

            // Captura segura de variables
            const nombreRaw = document.getElementById('nombre')?.value || '';
            const correoRaw = document.getElementById('correo')?.value || '';
            const interesRaw = document.getElementById('interes')?.value || '';
            const mensajeRaw = document.getElementById('mensaje')?.value || '';

            // Sanitización estricta mediante Escape HTML (OWASP)
            const nombreSanitizado = escapeHTML(nombreRaw.trim());
            const correoSanitizado = escapeHTML(correoRaw.trim());
            const interesSanitizado = escapeHTML(interesRaw.trim());
            const mensajeSanitizado = escapeHTML(mensajeRaw.trim());

            // Renderizado seguro en el DOM
            mostrarRespuestaExitosa(nombreSanitizado, correoSanitizado, interesSanitizado);

            // Limpieza tras envío
            formContacto.reset();
        });
    }
});

/**
 * Cambia dinámicamente el contenido de los cursos de Excel con nodos DOM seguros
 */
function cambiarTabExcel(nivel) {
    const data = cursosExcel[nivel];
    if (!data) return;

    ['basico', 'intermedio', 'avanzado'].forEach(n => {
        const btn = document.getElementById(`tab-${n}`);
        if (btn) {
            btn.className = (n === nivel) 
                ? "px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-emerald-500 text-slate-950 shadow-md"
                : "px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400 hover:text-white";
        }
    });

    const contenedor = document.getElementById('content-excel');
    if (!contenedor) return;
    
    contenedor.textContent = ''; // Limpieza previa transparente

    const badge = document.createElement('span');
    badge.className = "text-xs font-bold uppercase tracking-widest text-emerald-400";
    badge.textContent = data.duracion;

    const titulo = document.createElement('h3');
    titulo.className = "text-2xl font-bold text-white mt-1 mb-3";
    titulo.textContent = data.titulo;

    const desc = document.createElement('p');
    desc.className = "text-slate-300 text-sm leading-relaxed mb-6";
    desc.textContent = data.descripcion;

    const ul = document.createElement('ul');
    ul.className = "space-y-3 text-sm text-slate-200 mb-8";

    data.puntos.forEach(p => {
        const li = document.createElement('li');
        li.className = "flex items-start gap-2.5";
        
        const icon = document.createElement('i');
        icon.className = "fas fa-check-circle text-emerald-400 mt-1";
        
        const span = document.createElement('span');
        span.textContent = p;

        li.appendChild(icon);
        li.appendChild(span);
        ul.appendChild(li);
    });

    const btnContainer = document.createElement('div');
    btnContainer.className = "flex flex-wrap gap-4";

    const btnWsp = document.createElement('a');
    btnWsp.href = `https://wa.me/8096021991?text=Hola,%20deseo%20inscribirme%20o%20cotizar%20el%20curso:%20${encodeURIComponent(data.titulo)}`;
    btnWsp.target = "_blank";
    btnWsp.className = "px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2";
    
    const iconWsp = document.createElement('i');
    iconWsp.className = "fab fa-whatsapp text-lg";
    
    const txtWsp = document.createTextNode(" Inscripción / Cotización");

    btnWsp.appendChild(iconWsp);
    btnWsp.appendChild(txtWsp);
    btnContainer.appendChild(btnWsp);

    contenedor.appendChild(badge);
    contenedor.appendChild(titulo);
    contenedor.appendChild(desc);
    contenedor.appendChild(ul);
    contenedor.appendChild(btnContainer);

    const img = document.getElementById('img-excel');
    if (img) {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = data.imagen;
            img.style.opacity = '1';
        }, 200);
    }
}

/**
 * Asigna el valor al select de contacto y desplaza la vista
 */
function abrirModalServicio(servicio) {
    const selectServicio = document.getElementById('interes');
    if (selectServicio) {
        for (let option of selectServicio.options) {
            if (option.value.toLowerCase().includes(servicio.toLowerCase())) {
                option.selected = true;
                break;
            }
        }
    }
    const secContacto = document.getElementById('contacto');
    if (secContacto) {
        secContacto.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Escape de Caracteres Especiales HTML (Mitigación OWASP Injection / XSS)
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Muestra el mensaje de respuesta evitando vulnerabilidades XSS
 */
function mostrarRespuestaExitosa(nombre, correo, interes) {
    const contenedor = document.getElementById('mensaje-respuesta');
    if (!contenedor) return;
    
    contenedor.textContent = ''; 

    const titulo = document.createElement('strong');
    titulo.className = 'block font-bold text-emerald-300 text-base mb-1';
    titulo.textContent = `¡Gracias, ${nombre}! Tu solicitud ha sido recibida de manera segura.`;

    const detalle = document.createElement('p');
    detalle.className = 'mt-1 text-slate-200';
    detalle.textContent = `Nos pondremos en contacto con usted al correo (${correo}) para brindarle los detalles del servicio seleccionado: [${interes}].`;

    contenedor.appendChild(titulo);
    contenedor.appendChild(detalle);
    contenedor.classList.remove('hidden');

    contenedor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
