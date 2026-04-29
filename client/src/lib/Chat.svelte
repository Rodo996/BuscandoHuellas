<script>
    import { createEventDispatcher } from 'svelte';
    import NavBar from './Navbar.svelte';

    const dispatch = createEventDispatcher();

    // 1. Recibimos la información del contacto desde App.svelte
    export let contacto = null;

  // Aseguramos que haya un contacto por defecto por si acaso
    $: infoContacto = contacto ?? null;

  // 2. Base de datos simulada de mensajes dinámicos
  const baseMensajes = {
      "Laura García": [
          { tipo: 'other', img: '/Img-Buscar/bernesbuscar.jpg', texto: 'Envío de prueba de propiedad', hora: '10:36 AM' },
          { tipo: 'me', texto: 'Prueba de propiedad validada', hora: '10:37 AM' },
          { tipo: 'other', texto: 'Proceso de "acordar encuentro" iniciado', hora: '10:35 AM' },
          { tipo: 'map', texto: 'Acordar encuentro - Ubicación compartida', cita: '11/02- 18:00', hora: '10:38 AM' },
          { tipo: 'system' }
      ],
      "Rodolfo": [
          { tipo: 'other', texto: 'Hola, ¿aún buscas a tu perrito? Vi uno similar cerca del centro.', hora: '09:15 AM' },
          { tipo: 'me', texto: '¡Hola Rodolfo! Sí, sigo buscando. ¿Podrías mandarme alguna foto por favor?', hora: '09:20 AM' }
      ],
      "Christian": [
          { tipo: 'me', texto: 'Christian, muchas gracias por compartir mi publicación.', hora: 'Ayer' },
          { tipo: 'other', texto: 'De nada, espero de corazón que regrese pronto a casa. ¡Mucha suerte!', hora: 'Ayer' }
      ]
  };

  // Mensaje por defecto si el usuario no está en nuestra mini base de datos
  const msgsDefault = [
      { tipo: 'other', texto: '¡Hola! Me gustaría platicar sobre la publicación de la mascota.', hora: 'Ahora' }
  ];

  // Cargar la conversación dependiendo del nombre del contacto
  let mensajes = [];

 $: {
    mensajes = infoContacto
        ? [...(baseMensajes[infoContacto.nombre] || msgsDefault)]
        : [];
}

    function volver() { dispatch('volver'); }
    function accion(tipoAccion) {
        if (tipoAccion === 'Prueba de propiedad') {

            // mensaje que tú envías
            mensajes = [...mensajes, {
                tipo: 'me',
                texto: 'Solicité prueba de propiedad',
                hora: '10:30'
            }];

            // mensaje especial que recibe el otro (simulado)
            setTimeout(() => {
                mensajes = [...mensajes, {
                    tipo: 'request_proof',
                    from: 'other',
                    hora: '10:31'
                }];
            }, 800);
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

          {:else if msg.tipo === 'me'}
              <div class="message-row me">
                  <div class="msg-bubble dark-yellow">
                      <p>{msg.texto}</p>
                      <span class="time">{msg.hora}</span>
                  </div>
              </div>

          {:else if msg.tipo === 'map'}
              <div class="message-row other">
                  <div class="msg-bubble light-yellow">
                      <p>{msg.texto}</p>
                      <span class="time">{msg.hora}</span>
                  </div>
              </div>

          {:else if msg.tipo === 'system'}
              <div class="system-card">
                  <p>¿Se ha resuelto el caso?</p>
                  <button class="btn-cerrar-caso">Cerrar caso</button>
              </div>
              {:else if msg.tipo === 'request_proof'}
        <div class="message-row other">
            <div class="msg-bubble light-yellow proof-card">
                <p><strong>Se te ha solicitado una prueba de propiedad</strong></p>
                
                <button class="btn-evidencia">
                    Adjuntar evidencia
                </button>

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
  </div>

  <NavBar 
      vistaActiva="chats" 
      on:irAInicio={() => dispatch("volver")} 
      on:irABuscar={() => dispatch("irABuscar")}
      on:irAPublicar={() => dispatch("irAPublicar")}
  />
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
  .system-card {
      background-color: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 16px;
      padding: 16px;
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: left;
      gap: 12px;
  }
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
  .btn-cerrar-caso {
      background-color: #FBBF24;
      color: #000000;
      border: none;
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;
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

</style>