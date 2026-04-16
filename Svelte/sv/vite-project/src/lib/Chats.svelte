<script>
    import { createEventDispatcher } from 'svelte';
    import NavBar from './NavBar.svelte'; // Asegúrate de que la ruta sea correcta
    
    const dispatch = createEventDispatcher();

    // Recreamos tu lista de contactos con los colores exactos de tu diseño de Figma
    let listaContactos = [
        { id: 1, nombre: "Laura García", color: "#1A5C8C" },
        { id: 2, nombre: "Rodolfo", color: "#9CA3AF" },
        { id: 3, nombre: "Christian", color: "#FBBF24" },
        { id: 4, nombre: "Maria", color: "#C2410C" },
        { id: 5, nombre: "Andrea", color: "#ED1A1A" },
        { id: 6, nombre: "Carlos", color: "#1ABFD2" },
        { id: 7, nombre: "Roberto", color: "#24FB32" },
        { id: 8, nombre: "Diego", color: "rgba(13, 59, 102, 0.6)" } // Opacidad del 60%
    ];

    function abrirChat(contacto) {
        dispatch('abrirChat', contacto);
    }
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

    <div class="chats-header-title">
        <h2>Chats</h2>
    </div>

    <div class="contact-list">
        {#each listaContactos as contacto}
            <div class="contact-item" on:click={() => abrirChat(contacto)}>
                <div class="avatar" style="background: {contacto.color};"></div>
                
                <span class="contact-name">{contacto.nombre}</span>
                
                <div class="options-icon">
                    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z" fill="#0D3B66"/>
                    </svg>
                </div>
            </div>
        {/each}
    </div>

    <NavBar 
        vistaActiva="chats" 
        on:irAInicio={() => dispatch("volver")} 
        on:irABuscar={() => dispatch("irABuscar")}
        on:irAPublicar={() => dispatch("irAPublicar")}
    />
</div>

<style>
    /* Cabecera Principal */
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
    }
    .text-white { color: #ffffff; }
    .text-yellow { color: #f4d35e; }

    /* Subtítulo "Chats" */
    .chats-header-title {
        background: white;
        padding: 16px;
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

    /* Contenedor de la lista */
    .contact-list {
        background-color: white;
        display: flex;
        flex-direction: column;
    }

    /* Ítem individual de contacto */
    .contact-item {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #FAF0CA; /* El color sutil de línea de Figma */
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .contact-item:hover {
        background-color: #F9FAFB;
    }

    /* El círculo de color */
    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    /* Nombre del contacto */
    .contact-name {
        flex: 1; /* Ocupa todo el espacio disponible empujando los 3 puntos a la derecha */
        margin-left: 16px;
        color: #0D3B66;
        font-size: 16px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
    }

    /* Contenedor de los 3 puntitos */
    .options-icon {
        padding: 4px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>