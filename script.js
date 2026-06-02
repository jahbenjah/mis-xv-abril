// ==========================================
// 1. CONFIGURACIÓN DE LA CUENTA REGRESIVA
// ==========================================
// Define los parámetros del evento: (Año, Mes [0-11], Día, Hora, Minutos)
// Nota: Enero es 0, Febrero es 1, ..., Diciembre es 11
const fechaEvento = new Date(2026, 7, 8, 14, 0, 0).getTime(); 

const x = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = fechaEvento - ahora;

    // Conversiones métricas de tiempo
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Renderizado en pantalla con formato de dos dígitos
    document.getElementById("days").innerHTML = dias < 10 ? "0" + dias : dias;
    document.getElementById("hours").innerHTML = horas < 10 ? "0" + horas : horas;
    document.getElementById("minutes").innerHTML = minutos < 10 ? "0" + minutos : minutos;
    document.getElementById("seconds").innerHTML = segundos < 10 ? "0" + segundos : segundos;

    // Acción al finalizar el tiempo objetivo
    if (distancia < 0) {
        clearInterval(x);
        document.querySelector(".countdown").innerHTML = "<p style='color:#c98293; font-weight:600;'>¡Llegó el gran día!</p>";
    }
}, 1000);

// ==========================================
// 2. FUNCIONES DE INTERFAZ DE USUARIO (UI)
// ==========================================
function ingresarInvitacion() {
    document.getElementById('intro-overlay').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDatosBancarios() {
    const box = document.getElementById('bank-box');
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
}

function actualizarCamposAsistencia() {
    const status = document.getElementById('rsvp-status').value;
    const groupGuests = document.getElementById('group-guests-count');
    groupGuests.style.display = (status === 'si') ? 'block' : 'none';
}

// ==========================================
// 3. LECTURA DINÁMICA DE INVITADOS (URL)
// ==========================================
// Captura variables de la barra del navegador (URL Params)
// Ejemplo para pruebas: index.html?f=Familia+Morales+Gomez&p=5&m=12
const urlParams = new URLSearchParams(window.location.search);
const familia = urlParams.get('f') || "Familia Morales"; 
const pasesMaximos = parseInt(urlParams.get('p')) || 4;  
const numeroMesa = urlParams.get('m') || "Asignada en la entrada";

// Asigna la información a las tarjetas visuales
document.getElementById('guest-family').innerText = familia;
document.getElementById('guest-tickets').innerText = pasesMaximos;
document.getElementById('guest-table').innerText = numeroMesa;

// Llena el selector dinámico RSVP adaptándose al total de pases válidos
const rsvpCountSelect = document.getElementById('rsvp-count');
for (let i = 1; i <= pasesMaximos; i++) {
    let opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i + (i === 1 ? " Persona" : " Personas");
    if(i === pasesMaximos) opt.selected = true; // Por defecto selecciona el máximo
    rsvpCountSelect.appendChild(opt);
}

// ==========================================
// 4. PROCESAMIENTO RSVP VÍA WHATSAPP
// ==========================================
function enviarRSVP(event) {
    event.preventDefault();
    const status = document.getElementById('rsvp-status').value;
    const mensajeOriginal = document.getElementById('rsvp-message').value;
    
    // CONFIGURACIÓN OBLIGATORIA: Escribe tu número real aquí con código de país (ej. 52 para México)
    const numeroCelularDestino = "521234567890"; 
    let textoWhatsApp = "";

    if (status === 'si') {
        const cantidadAsistentes = rsvpCountSelect.value;
        textoWhatsApp = `¡Hola Sofía! ✨ Confirmo que la *${familia}* asistirá a tu fiesta de XV Años. Confirmamos *${cantidadAsistentes} personas* de los pases asignados.`;
    } else {
        textoWhatsApp = `¡Hola Sofía! Te agradecemos de corazón la invitación a tus XV Años. Lamentablemente la *${familia}* no podrá asistir en esta ocasión. Te deseamos lo mejor en tu día.`;
    }

    // Si el invitado escribió un mensaje opcional, lo concatena con formato de bloque de cita
    if(mensajeOriginal.trim() !== "") {
        textoWhatsApp += `\n\n💌 *Mensaje:* "${mensajeOriginal}"`;
    }

    // Construcción de la URL de escape segura para caracteres especiales
    const urlFinal = `https://wa.me{numeroCelularDestino}?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(urlFinal, '_blank');
}
