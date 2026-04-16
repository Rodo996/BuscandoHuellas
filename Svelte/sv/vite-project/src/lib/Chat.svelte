<script>
    import { createEventDispatcher } from 'svelte';
    import NavBar from './NavBar.svelte';

    const dispatch = createEventDispatcher();

    // 1. Recibimos la información del contacto desde App.svelte
    export let contacto = null;

    // Aseguramos que haya un contacto por defecto por si acaso
    $: infoContacto = contacto || { nombre: "Laura García", color: "#1A5C8C" };

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
    $: mensajes = baseMensajes[infoContacto.nombre] || msgsDefault;

    function volver() { dispatch('volver'); }
    function accion(tipo) { alert(`Acción seleccionada: ${tipo}`); }
</script>

<div class="app-container">
    <div class="top-brand-header">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
            <ellipse cx="12.5" cy="21" rx="1.3" ry="1.8" transform="rotate(-20 12.5 21)" fill="#F4D35E"/>
            <ellipse cx="15.8" cy="19.5" rx="1.3" ry="1.8" transform="rotate(-6 15.8 19.5)" fill="#F4D35E"/>
            <ellipse cx="19.2" cy="19.5" rx="1.3" ry="1.8" transform="rotate(6 19.2 19.5)" fill="#F4D35E"/>
            <ellipse cx="22.5" cy="21" rx="1.3" ry="1.8" transform="rotate(20 22.5 21)" fill="#F4D35E"/>
            <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E"/>
        </svg>
        <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
    </div>

    <div class="contact-header">
        <button class="back-btn" on:click={volver}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18L9 12L15 6"/></svg>
        </button>
        
        <div class="user-info">
            <div class="avatar-container">
                <div class="avatar-img" style="border-color: {infoContacto.color}">
                    <span style="color: {infoContacto.color}; font-weight: bold;">{infoContacto.nombre.charAt(0)}</span>
                </div>
                <div class="online-dot"></div>
            </div>
            <div class="name-container">
                <h2>{infoContacto.nombre}</h2>
                <p>Mascota: Perro</p>
            </div>
        </div>

        <button class="options-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
    </div>

    <div class="chat-body">
        <div class="date-pill">Hoy</div>

        {#each mensajes as msg}
            {#if msg.tipo === 'other'}
                <div class="message-row other">
                    <div class="msg-avatar" style="border-color: {infoContacto.color}; background-color: #E2E8F0;">
                        <span style="display:flex; justify-content:center; align-items:center; height:100%; font-size:10px; color:{infoContacto.color}">{infoContacto.nombre.charAt(0)}</span>
                    </div>
                    <div class="msg-bubble light-yellow">
                        {#if msg.img}
                            <img src={msg.img} alt="Prueba" class="msg-image" />
                        {/if}
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
                    <div class="msg-avatar" style="border-color: {infoContacto.color}; background-color: #E2E8F0;"></div>
                    <div class="msg-bubble light-yellow map-bubble">
                        <div class="map-header">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>{msg.texto}</span>
                        </div>
                        <div class="map-image-container">
                            <div class="map-placeholder">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                        </div>
                        <div class="map-footer">
                            <span class="date-time-bold">{msg.cita}</span>
                            <span class="time">{msg.hora}</span>
                        </div>
                    </div>
                </div>

            {:else if msg.tipo === 'system'}
                <div class="system-card">
                    <div class="system-icon-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.78-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
                    </div>
                    <p>¿Se ha resuelto el caso? Haz clic en Cerrar caso para publicar tu caso como historia de éxito.</p>
                    <button class="btn-cerrar-caso">
                        Cerrar caso 
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            {/if}
        {/each}
    </div>

    <div class="action-chips-container">
        <button class="chip chip-blue" on:click={() => accion('Prueba de propiedad')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
            <span>Prueba de<br>propiedad</span>
        </button>

        <button class="chip chip-orange" on:click={() => accion('Acordar encuentro')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Acordar<br>encuentro</span>
        </button>

        <button class="chip chip-purple" on:click={() => accion('Validar prueba')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Validar<br>prueba</span>
        </button>
    </div>

    <NavBar 
        vistaActiva="chats" 
        on:irAInicio={() => dispatch("volver")} 
        on:irABuscar={() => dispatch("irABuscar")}
        on:irAPublicar={() => dispatch("irAPublicar")}
    />
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
        justify-content: center;
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
    }
    .name-container h2 {
        margin: 0;
        font-size: 16px;
        color: #0D3B66;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        line-height: 1.2;
    }
    .name-container p {
        margin: 0;
        font-size: 11px;
        color: #FBBF24;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
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
        color: #4B5563;
        font-size: 10px;
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
        font-size: 13px;
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
        font-size: 9px;
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
        font-size: 11px;
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .map-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        padding: 0 4px;
    }
    .date-time-bold {
        font-size: 11px;
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
        text-align: center;
        gap: 12px;
    }
    .system-icon-wrapper {
        background-color: #FEF3C7;
        padding: 8px;
        border-radius: 50%;
    }
    .system-card p {
        margin: 0;
        font-size: 13px;
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
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 14px;
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
        border-top: 1px solid #F3F4F6;
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
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 12px;
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
</style>