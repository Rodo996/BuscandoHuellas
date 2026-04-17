<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    // Lista completa con los colores y IDs de la versión de tu compañero
    let listaContactos = [
        { id: 1, nombre: "Laura García", color: "#1A5C8C" },
        { id: 2, nombre: "Rodolfo", color: "#9CA3AF" },
        { id: 3, nombre: "Christian", color: "#FBBF24" },
        { id: 4, nombre: "Maria", color: "#C2410C" },
        { id: 5, nombre: "Andrea", color: "#ED1A1A" },
        { id: 6, nombre: "Carlos", color: "#1ABFD2" },
        { id: 7, nombre: "Roberto", color: "#24FB32" },
        { id: 8, nombre: "Diego", color: "rgba(13, 59, 102, 0.6)" }
    ];

    // Función corregida para comunicar con tu App.svelte
    function abrirChat(contacto) {
        dispatch('abrirChat', contacto);
    }
</script>

<div class="chats-wrapper">
    <div class="top-brand-header">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L33 10.66V25.34L18 34L3 25.34V10.66L18 2Z" fill="#0D3B66"/>
            <circle cx="18" cy="21" r="5" fill="#FBBF24"/>
            <path d="M18 11V14M13 13L15 15M23 13L21 15" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h1 class="brand-title">PetConnect</h1>
    </div>

    <div class="chats-header-title">
        <h2>Mensajes</h2>
    </div>

    <div class="contact-list">
        {#each listaContactos as contacto}
            <div class="contact-item" on:click={() => abrirChat(contacto)}>
                <div class="avatar" style="background-color: {contacto.color}"></div>
                <div class="contact-info">
                    <span class="contact-name">{contacto.nombre}</span>
                    <span class="last-msg">Toca para abrir la conversación</span>
                </div>
                <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>
        {/each}
    </div>
</div>

<style>
    .chats-wrapper {
        display: flex;
        flex-direction: column;
        background-color: white;
        min-height: 100%;
    }

    /* Estilos del Header Superior */
    .top-brand-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        background-color: white;
    }

    .brand-title {
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        font-size: 22px;
        color: #0D3B66;
        margin: 0;
    }

    .chats-header-title {
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #E8E8CE;
    }

    .chats-header-title h2 {
        margin: 0;
        color: #0D3B66;
        font-size: 18px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
    }

    /* Lista de ítems */
    .contact-list {
        display: flex;
        flex-direction: column;
    }

    .contact-item {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #FAF0CA;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .contact-item:hover {
        background-color: #F9FAFB;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
        margin-right: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .contact-name {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 15px;
        color: #0D3B66;
    }

    .last-msg {
        font-size: 12px;
        color: #9CA3AF;
        margin-top: 2px;
    }

    .chevron {
        margin-left: 10px;
    }
</style>