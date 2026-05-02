<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import NavBar from './Navbar.svelte';
    import MapPicker from './MapPicker.svelte';

    const dispatch = createEventDispatcher();
    let intervalo;

    // 1. Recibimos la información del contacto desde App.svelte
    export let contacto = null;
    let mostrarConfirmacion = false;
    let mostrarModalEncuentro = false;
    let encuentroUbicacion = null;
    let encuentroFecha = '';
    let encuentroHora = '';
    let encuentroDireccion = '';
    export let user_id = null;
  // Aseguramos que haya un contacto por defecto por si acaso
    $: infoContacto = contacto ?? null;
    const API = 'http://localhost:3000/api'
    let userIdActual = user_id ?? Number(sessionStorage.getItem('user_id'));
    $: userIdActual = user_id ?? Number(sessionStorage.getItem('user_id'));

  // Cargar la conversación dependiendo del nombre del contacto
  let mensajes = [];
  let cargandoMensajes = false;
  function formatearHora(fecha) {
        return new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }
    // Mapear formato BD → formato template
function mapearMensaje(m) {
    console.log('mapeando mensaje:', m.type, 'photo_url:', m.photo_url);
    const esMio = m.user_id === userIdActual;
    if (m.type === 'Arrange Meeting') {
        return {
            tipo: esMio ? 'meeting' : 'map',
            direccion: m.content,
            fecha: m.meet_date,
            hora: m.meet_time,
            lat: m.meet_lat,
            lng: m.meet_lng,
            horaMsg: formatearHora(m.sent_at),
            meeting_status: m.proof_status  // reutilizamos proof_status para el encuentro
        };
    }
    if (m.type === 'Proof of Ownership') {
    if (m.photo_url) {
        return {
            tipo: esMio ? 'me_foto' : 'other_foto',
            foto: m.photo_url,
            hora: formatearHora(m.sent_at)
        };
    }
    return esMio
        ? { tipo: 'me', texto: 'Solicité prueba de propiedad', hora: formatearHora(m.sent_at) }
        : { tipo: 'request_proof', hora: formatearHora(m.sent_at) };
    }
    if (m.type === 'Validate Proof') {
        const textos = {
            'proof_accepted':   '✅ Prueba de propiedad confirmada',
            'proof_rejected':   '❌ Prueba de propiedad rechazada',
            'meeting_accepted': '✅ Encuentro aceptado',
            'meeting_rejected': '❌ Encuentro rechazado',
        };
        return {
            tipo: esMio ? 'me' : 'other',
            texto: textos[m.content] ?? m.content,
            hora: formatearHora(m.sent_at)
        };
    }
}



    function volver() { dispatch('volver'); }
    async function accion(tipoAccion) {
        console.log('user_id al enviar:', user_id, 'userIdActual:', userIdActual);
        if (!contacto?.chat_id) return;

        if (tipoAccion === 'Prueba de propiedad') {
    try {
        await fetch(`${API}/chats/${contacto.chat_id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userIdActual,
                type: 'Proof of Ownership',
                content: 'Solicitud de prueba de propiedad'
            })
        });
        await cargarMensajes(); // ← recargar inmediatamente
    } catch (e) {
        console.error('Error enviando mensaje:', e);
    }
}

        if (tipoAccion === 'Acordar encuentro') {
            mostrarModalEncuentro = true;
        }
    }
    // Hora formateada para los mensajes
    function horaActual() {
        return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }

    // Confirmar el encuentro desde el modal
    async function confirmarEncuentro() {
        if (!encuentroFecha || !encuentroHora || !encuentroUbicacion) return;
        if (!contacto?.chat_id) return;

        try {
            await fetch(`${API}/chats/${contacto.chat_id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id,
                    type: 'Arrange Meeting',
                    content: encuentroDireccion,
                    meet_lat: encuentroUbicacion.lat,
                    meet_lng: encuentroUbicacion.lng,
                    meet_date: encuentroFecha,
                    meet_time: encuentroHora
                })
            });

            await cargarMensajes();

            mostrarModalEncuentro = false;
            encuentroFecha = '';
            encuentroHora = '';
            encuentroUbicacion = null;
            encuentroDireccion = '';
        } catch (e) {
            console.error('Error guardando encuentro:', e);
        }
    }
    // 🤖 Respuestas simuladas
    function generarRespuesta(tipo) {
        if (tipo === 'Prueba de propiedad') {
            return 'Claro, te enviaré una prueba en breve 📸';
        }

        if (tipo === 'Acordar encuentro') {
            return 'Perfecto, ¿qué día te queda mejor? 📅';
        }

        return 'Ok 👍';
    }

    async function confirmarCierreCaso() {
        mostrarConfirmacion = false;
        try {
            await fetch(`${API}/chats/${contacto.chat_id}/close`, {
                method: 'PATCH'
            });
        } catch (e) {
            console.error('Error cerrando caso:', e);
        }
        dispatch('cerrarCaso', { contactoId: contacto.id });
    }
    async function cargarMensajes() {
    if (!contacto?.chat_id) return;
    try {
        const res = await fetch(`${API}/chats/${contacto.chat_id}/messages`);
        if (!res.ok) return;
        const data = await res.json();
        mensajes = data.map(m => mapearMensaje(m));
    } catch (e) {
        console.error('Error cargando mensajes:', e);
    }
}
async function adjuntarEvidencia() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('user_id', userIdActual);

        try {
            const res = await fetch(`${API}/images/upload/chat/${contacto.chat_id}`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error();
            await cargarMensajes(); // recargar para mostrar la imagen
        } catch (e) {
            console.error('Error subiendo imagen:', e);
        }
    };
    input.click();
}
async function validarPrueba(msg, status) {
    try {
        await fetch(`${API}/chats/${contacto.chat_id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userIdActual,
                type: 'Validate Proof',
                content: status === 'accepted' 
                ? 'proof_accepted'    
                : 'proof_rejected',
                proof_status: status
            })
        });
        await cargarMensajes();
    } catch (e) {
        console.error('Error validando prueba:', e);
    }
}
async function validarEncuentro(msg, status) {
    try {
        await fetch(`${API}/chats/${contacto.chat_id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userIdActual,
                type: 'Validate Proof',
                content: status === 'accepted'
                    ? 'Encuentro aceptado'
                    : 'Encuentro rechazado',
                proof_status: status
            })
        });
        await cargarMensajes();
    } catch (e) {
        console.error('Error validando encuentro:', e);
    }
}
onMount(async () => {
    if (!contacto?.chat_id) return;
    await cargarMensajes();
    intervalo = setInterval(cargarMensajes, 3000);
});

onDestroy(() => {
    clearInterval(intervalo);
});
</script>

<div class="app-container">
  <div class="top-brand-header">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
          <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
      </svg>
      <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
  </div>
{#if infoContacto}
  <div class="contact-header">
      <button class="back-btn" on:click={volver}>
          ←
      </button>
      
      <div class="user-info">
          <div class="avatar-container">
              <div class="avatar-img" style="border-color: {infoContacto.color}">
                  <span>{infoContacto.nombre.charAt(0)}</span>
              </div>
              <div class="online-dot"></div>
          </div>
          <div class="name-container">
              <h2>{infoContacto.nombre}</h2>
              <p>Mascota: Perro</p>
          </div>
      </div>

      <button class="options-btn">⋮</button>
  </div>

  <!-- ✅ CHAT REAL (ÚNICO) -->
  <div class="chat-body">
      <div class="date-pill">Hoy</div>

      {#each mensajes as msg}
        
          {#if msg.tipo === 'other'}
              <div class="message-row other">
                  <div class="msg-avatar" style="border-color: {infoContacto.color}">
                      <span>{infoContacto.nombre.charAt(0)}</span>
                  </div>
                  <div class="msg-bubble light-yellow">
                      <p>{msg.texto}</p>
                      <span class="time">{msg.hora}</span>
                  </div>
              </div>
            {#if cargandoMensajes}
                <p style="text-align:center; padding:24px; font-family:Poppins; color:#0D3B66;">
                    Cargando mensajes...
                </p>
            {/if}
          {:else if msg.tipo === 'me'}
              <div class="message-row me">
                  <div class="msg-bubble dark-yellow">
                      <p>{msg.texto}</p>
                      <span class="time">{msg.hora}</span>
                  </div>
              </div>

          {:else if msg.tipo === 'map'}
    <div class="message-row other">
        <div class="msg-avatar" style="border-color: {infoContacto.color}">
            <span>{infoContacto.nombre.charAt(0)}</span>
        </div>
        <div class="msg-bubble light-yellow meeting-bubble">
            <p>📍 <strong>Propuesta de encuentro</strong></p>
            <p class="meeting-dir">{msg.direccion}</p>
            <div class="meeting-details">
                <span>📅 {msg.fecha}</span>
                <span>🕐 {msg.hora}</span>
            </div>
            {#if !msg.meeting_status}
                <div class="proof-actions">
                    <button class="btn-confirmar" on:click={() => validarEncuentro(msg, 'accepted')}>
                        ✅ Aceptar
                    </button>
                    <button class="btn-rechazar" on:click={() => validarEncuentro(msg, 'rejected')}>
                        ❌ Rechazar
                    </button>
                </div>
            {/if}
            <span class="time">{msg.horaMsg}</span>
        </div>
    </div>
            {:else if msg.tipo === 'meeting'}
                <div class="message-row me">
                    <div class="msg-bubble dark-yellow meeting-bubble">
                        <p>📍 <strong>Encuentro acordado</strong></p>
                        <p class="meeting-dir">{msg.direccion}</p>
                        <div class="meeting-details">
                            <span>📅 {msg.fecha}</span>
                            <span>🕐 {msg.hora}</span>
                        </div>
                        <span class="time">{msg.horaMsg}</span>
                    </div>
                </div>
              {:else if msg.tipo === 'request_proof'}
        <div class="message-row other">
            <div class="msg-bubble light-yellow proof-card">
                <p><strong>Se te ha solicitado una prueba de propiedad</strong></p>
                
                <button class="btn-evidencia" on:click={adjuntarEvidencia}>
                    Adjuntar evidencia
                </button>

                <span class="time">{msg.hora}</span>
            </div>
    </div>
        {:else if msg.tipo === 'me_foto'}
    <div class="message-row me">
        <div class="msg-bubble dark-yellow">
            <img src={msg.foto} alt="Evidencia" style="max-width:200px; border-radius:8px;"/>
            <span class="time">{msg.hora}</span>
        </div>
    </div>

{:else if msg.tipo === 'other_foto'}
    <div class="message-row other">
        <div class="msg-avatar" style="border-color: {infoContacto.color}">
            <span>{infoContacto.nombre.charAt(0)}</span>
        </div>
        <div class="msg-bubble light-yellow">
            <img src={msg.foto} alt="Evidencia" style="max-width:200px; border-radius:8px;"/>
            <div class="proof-actions">
                <button class="btn-confirmar" on:click={() => validarPrueba(msg, 'accepted')}>
                    ✅ Confirmar
                </button>
                <button class="btn-rechazar" on:click={() => validarPrueba(msg, 'rejected')}>
                    ❌ Rechazar
                </button>
            </div>
            <span class="time">{msg.hora}</span>
        </div>
    </div>
          {/if}
      {/each}
  </div>

  <!-- BOTONES -->
  <div class="action-chips-container">
    <button class="chip chip-blue" on:click={() => accion('Prueba de propiedad')}>
        Prueba de propiedad
    </button>
    <button class="chip chip-orange" on:click={() => accion('Acordar encuentro')}>
        Acordar encuentro
    </button>
    <button class="chip chip-red" on:click={() => mostrarConfirmacion = true}>
        Cerrar caso
    </button>
</div>

  <NavBar 
      vistaActiva="chats" 
      on:irAInicio={() => dispatch("volver")} 
      on:irABuscar={() => dispatch("irABuscar")}
      on:irAPublicar={() => dispatch("irAPublicar")}
  />
  {/if}
  {#if mostrarConfirmacion}
        <div class="modal-overlay">
            <div class="modal-box">
                <p class="modal-titulo">¿Cerrar este caso?</p>
                <p class="modal-subtitulo">Esta acción marcará el caso como resuelto.</p>
                <div class="modal-botones">
                <button class="modal-btn cancelar" on:click={() => mostrarConfirmacion = false}>
                    Cancelar
                    </button>
                    <button class="modal-btn confirmar" on:click={confirmarCierreCaso}>
                    Confirmar
                 </button>
                </div>
            </div>
        </div>
{/if}
{#if mostrarModalEncuentro}
    <div class="modal-overlay">
        <div class="modal-box encuentro-modal">
            <div class="modal-header">
                <p class="modal-titulo">Acordar encuentro</p>
                <button class="modal-close" on:click={() => mostrarModalEncuentro = false}>✕</button>
            </div>

            <!-- Mapa -->
            <p class="modal-label">📍 Selecciona el lugar</p>
            <MapPicker
                on:ubicacion={(e) => {
                    encuentroUbicacion = e.detail;
                    encuentroDireccion = e.detail.address;
                }}
            />

            {#if encuentroDireccion}
                <p class="dir-preview">📌 {encuentroDireccion.slice(0, 60)}...</p>
            {/if}

            <!-- Fecha y hora -->
            <div class="fecha-hora-row">
                <div class="input-group">
                    <label class="modal-label">📅 Fecha</label>
                    <input
                        type="date"
                        class="modal-input"
                        bind:value={encuentroFecha}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div class="input-group">
                    <label class="modal-label">🕐 Hora</label>
                    <input
                        type="time"
                        class="modal-input"
                        bind:value={encuentroHora}
                    />
                </div>
            </div>

            <!-- Botones -->
            <div class="modal-botones">
                <button class="modal-btn cancelar" on:click={() => mostrarModalEncuentro = false}>
                    Cancelar
                </button>
                <button
                    class="modal-btn confirmar"
                    on:click={confirmarEncuentro}
                    disabled={!encuentroFecha || !encuentroHora || !encuentroUbicacion}
                >
                    Confirmar
                </button>
            </div>
        </div>
    </div>
{/if}
</div>
<style>
  /* Estructura Base */
  .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 400px;
      margin: 0 auto;
      background-color: #ffffff;
      position: relative;
      overflow: hidden;
      align-items: stretch;
  }

  /* Header Azul */
  .top-brand-header {
      background: #0d3b66;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 20px 0;
      font-size: 22px;
      font-weight: 700;
      font-family: "Poppins", sans-serif;
      flex-shrink: 0;
  }
  .text-white { color: #ffffff; }
  .text-yellow { color: #f4d35e; }

  /* Sub Header del Contacto */
  .contact-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid #FAF0CA;
      flex-shrink: 0;
  }
 .back-btn, .options-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    color: #0D3B66;
    font-size: 20px;
}
  .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      justify-content: flex-start;
  }
  .avatar-container {
      position: relative;
  }
  .avatar-img {
      width: 36px;
      height: 36px;
      background-color: #E2E8F0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid; /* El color se asigna directo en el HTML */
  }
  .online-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background-color: #10B981;
      border-radius: 50%;
      border: 2px solid white;
  }
  .name-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
  }
  .name-container h2 {
      margin: 0;
      font-size: 18px;
      color: #0D3B66;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      line-height: 1.2;
      text-align: left;
  }
  .name-container p {
      margin: 0;
      font-size: 14px;
      color: #FBBF24;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      text-align: left;
  }

  /* Área de Chat (Scrollable) */
  .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background-color: #FAFAFA;
      padding-bottom: 20px;
  }
  .chat-body::-webkit-scrollbar {
      display: none;
  }

  .date-pill {
      align-self: center;
      background-color: #E5E7EB;
      color: hsl(215, 14%, 34%);
      font-size: 16px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 8px;
  }

  .message-row {
      display: flex;
      gap: 8px;
      max-width: 85%;
  }
  .message-row.other { align-self: flex-start; }
  .message-row.me { align-self: flex-end; }

  .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 1.5px solid;
      align-self: flex-end;
  }

  .msg-bubble {
      padding: 12px 14px;
      border-radius: 16px;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: 'Inter', sans-serif;
  }
  .message-row.other .msg-bubble { border-bottom-left-radius: 4px; }
  .message-row.me .msg-bubble { border-bottom-right-radius: 4px; }

  .light-yellow { background-color: #FEF3C7; }
  .dark-yellow { background-color: #FCD34D; }

  .msg-bubble p {
      margin: 0;
      font-size: 16px;
      color: #0D3B66;
      line-height: 1.4;
      font-weight: 500;
  }
  
  .msg-image {
      width: 100%;
      max-width: 220px;
      border-radius: 12px;
      object-fit: cover;
  }

  .time {
      align-self: flex-end;
      font-size: 16px;
      color: #6B7280;
      font-weight: 500;
  }

  /* Burbuja Especial de Mapa */
  .map-bubble {
      padding: 10px;
      width: 240px;
  }
  .map-header {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #4B5563;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
  }
  .map-image-container {
      width: 100%;
      height: 120px;
      background-color: #ECFDF5;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .map-placeholder {
      background: rgba(255,255,255,0.8);
      padding: 8px;
      border-radius: 50%;
  }

  .map-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding: 0 4px;
  }
  .date-time-bold {
      font-size: 16px;
      font-weight: 700;
      color: #4B5563;
  }

  /* Tarjeta de Sistema (Cerrar caso) */
  
  .system-icon-wrapper {
      background-color: #FEF3C7;
      padding: 8px;
      border-radius: 50%;
  }
  .system-card p {
      margin: 0;
      font-size: 16px;
      color: #111827;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      line-height: 1.5;
  }

  /* Contenedor de Botones Inferiores */
  .action-chips-container {
      display: flex;
      gap: 12px;
      padding: 12px 16px; /* <-- AQUÍ SE CORRIGIÓ EL PADDING EXCESIVO */
      background: white;
      overflow-x: auto;
      flex-shrink: 0;
  }
  .action-chips-container::-webkit-scrollbar {
      display: none;
  }

  .chip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 30px;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
  }

  .chip-blue {
      background-color: #F0F7FF;
      border: 1.5px solid #BFDBFE;
      color: #1D4ED8;
  }
  .chip-orange {
      background-color: #FFF7ED;
      border: 1.5px solid #FED7AA;
      color: #C2410C;
  }
  .chip-purple {
      background-color: #F5F3FF;
      border: 1.5px solid #DDD6FE;
      color: #6D28D9;
  }
  .proof-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.btn-evidencia {
    background-color: #F4D35E;
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}
.msg-bubble,
.msg-bubble p,
.proof-card,
.proof-card p {
    text-align: left;
}
/* Modal encuentro */
.encuentro-modal {
    width: 90%;
    max-width: 360px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.modal-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #6B7280;
}
.modal-label {
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #0D3B66;
    margin: 0 0 4px 0;
}
.dir-preview {
    font-size: 11px;
    color: #6B7280;
    font-family: 'Poppins', sans-serif;
    margin: 0;
}
.fecha-hora-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
.input-group {
    display: flex;
    flex-direction: column;
}
.modal-input {
    border: 1.5px solid #E5E7EB;
    border-radius: 8px;
    padding: 8px 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #0D3B66;        /* ← asegura texto visible */
    background: #ffffff;   /* ← fondo blanco explícito */
    outline: none;
    width: 100%;
}
.modal-input:focus {
    border-color: #0D3B66;
}

/* Burbuja de meeting en el chat */
.meeting-bubble {
    min-width: 180px;
}
.meeting-dir {
    font-size: 12px !important;
    color: #4B5563 !important;
    font-weight: 400 !important;
}
.meeting-details {
    display: flex;
    gap: 12px;
    font-size: 13px;
    font-weight: 600;
    color: #0D3B66;
    font-family: 'Poppins', sans-serif;
}

/* Botón confirmar deshabilitado */
.modal-btn.confirmar:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.encuentro-modal :global(.map-container) {
    height: 150px;
}
.modal-overlay {
    position: fixed;    /* ← cambia de absolute a fixed */
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;  /* ← cambia de center a flex-start */
    justify-content: center;
    z-index: 100;
    padding-top: 20px;        /* ← pequeño margen arriba */
    overflow-y: auto;         /* ← permite scroll en el overlay también */
}
.modal-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    width: 90%;
    max-width: 360px;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
}

.modal-titulo {
    font-size: 16px;
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
}

.modal-botones {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 4px;
}

.modal-btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
}

.modal-btn.cancelar {
    background: #F3F4F6;
    color: #374151;
}

.modal-btn.confirmar {
    background: #0D3B66;
    color: white;
}
.proof-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.btn-confirmar {
    background: #D1FAE5;
    color: #065F46;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
}

.btn-rechazar {
    background: #FEE2E2;
    color: #991B1B;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
}
</style>