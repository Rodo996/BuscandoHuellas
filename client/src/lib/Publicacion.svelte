<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let mascota;

    // Helpers para mostrar arrays como texto legible
    $: coloresTexto = Array.isArray(mascota.colores) && mascota.colores.length > 0
        ? mascota.colores.map(c => c.nombre).join(", ")
        : "Sin datos";

    $: discapacidadesTexto = Array.isArray(mascota.discapacidades) && mascota.discapacidades.length > 0
        ? mascota.discapacidades.map(d => d.nombre).join(", ")
        : "Ninguna";

    $: cruzaTexto  = mascota.esCruza   === true ? "Sí" : mascota.esCruza   === false ? "No" : "Sin datos";
    $: colaTexto   = mascota.tieneCola === true ? "Sí" : mascota.tieneCola === false ? "No" : "Sin datos";
</script>

<div class="app-container">
    <header class="header-simple">
        <button class="back-btn" on:click={() => dispatch("volver")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#0D3B66" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </header>

    <div class="content-wrapper">

        <!-- Imagen + badge -->
        <div class="image-container">
            <img src={mascota.img} alt={mascota.raza} class="main-image" />
            <div class="badge-estado" class:badge-extraviado={mascota.estado === "Extraviado"}
                                      class:badge-avistado={mascota.estado === "Avistado"}
                                      class:badge-alojado={mascota.estado === "Alojado"}>
                {mascota.estado}
            </div>
        </div>

        <!-- Fila 1: Raza | Tamaño | Color -->
        <div class="triple-grid">
            <div class="info-card">
                <span class="label">Raza</span>
                <span class="value">{mascota.raza ?? "Sin datos"}</span>
            </div>
            <div class="info-card">
                <span class="label">Tamaño</span>
                <span class="value">{mascota.tamano ?? "Sin datos"}</span>
            </div>
            <div class="info-card">
                <span class="label">Color(es)</span>
                <!-- Bolitas de color si hay hex, fallback a texto -->
                {#if Array.isArray(mascota.colores) && mascota.colores.length > 0}
                    <div class="color-dots">
                        {#each mascota.colores as c}
                            <span class="color-dot-sm"
                                style="background:{c.hex ?? '#ccc'}"
                                title={c.nombre}>
                            </span>
                        {/each}
                    </div>
                    <span class="value small">{coloresTexto}</span>
                {:else}
                    <span class="value">Sin datos</span>
                {/if}
            </div>
        </div>

        <!-- Fila 2: Sexo (grande) | Especie -->
        <div class="top-grid">
            <div class="col-left">
                <div class="info-card">
                    <span class="label">Especie</span>
                    <span class="value">{mascota.especie ?? "Sin datos"}</span>
                </div>
                <div class="info-card">
                    <span class="label">Nombre</span>
                    <span class="value">{mascota.name ?? "Desconocido"}</span>
                </div>
            </div>
            <div class="col-right">
                <div class="info-card tall">
                    <span class="label">Sexo</span>
                    <span class="symbol">
                        {#if mascota.sexo === "Macho"}♂{:else}♀{/if}
                    </span>
                    <span class="value" style="font-size:12px">{mascota.sexo ?? ""}</span>
                </div>
            </div>
        </div>

        <!-- Fila 3: Cruza | Discapacidades | ¿Tiene cola? -->
        <div class="triple-grid">
            <div class="info-card center-text">
                <span class="label">¿Es cruza?</span>
                <span class="value icon-value">{cruzaTexto}</span>
            </div>
            <div class="info-card center-text">
                <span class="label">Discapacidades</span>
                <span class="value small">{discapacidadesTexto}</span>
            </div>
            <div class="info-card center-text">
                <span class="label">¿Tiene cola?</span>
                <span class="value icon-value">{colaTexto}</span>
            </div>
        </div>

        <!-- Fila 4: Última vez visto | Rasgos -->
        <div class="double-grid">
            <div class="info-card">
                <span class="label">Última vez visto en</span>
                <span class="value small">{mascota.ubicacion ?? "Sin datos"}</span>
            </div>
            <div class="info-card">
                <span class="label">📅 Fecha reporte</span>
                <span class="value small">
                    {mascota.fecha
                        ? new Date(mascota.fecha).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" })
                        : "Sin datos"}
                </span>
            </div>
        </div>

        <!-- Rasgos característicos — card completa -->
        {#if mascota.rasgos}
            <div class="info-card rasgos-card">
                <span class="label">Rasgos característicos</span>
                <p class="rasgos-text">{mascota.rasgos}</p>
            </div>
        {/if}

        <!-- Contacto -->
        <div class="contact-section">
            <div class="owner-info">
                <h4>{mascota.dueno ?? "Publicado por usuario"}</h4>
                <p>Dueño • {mascota.duenoTiempo ?? ""}</p>
            </div>
            <button class="contact-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7
                             8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8
                             8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                Contactar >
            </button>
        </div>
    </div>

    <nav class="bottom-nav"></nav>
</div>

<style>
    .app-container {
        width: 100%; max-width: 400px; background-color: #ffffff;
        min-height: 100vh; position: relative; padding-bottom: 90px;
        box-shadow: 0px 4px 10px rgba(0,0,0,0.1); margin: 0 auto;
    }
    .header-simple { padding: 16px; display: flex; align-items: center; }
    .back-btn { background: transparent; border: none; cursor: pointer; padding: 8px; }

    .content-wrapper {
        padding: 0 16px;
        display: flex; flex-direction: column; gap: 12px;
    }

    /* Imagen */
    .image-container {
        position: relative; width: 100%;
        display: flex; flex-direction: column; align-items: flex-end;
    }
    .main-image {
        width: 100%; height: 250px; object-fit: cover; border-radius: 16px;
    }
    .badge-estado {
        color: white; padding: 6px 16px; border-radius: 20px;
        font-weight: 600; font-family: "Poppins", sans-serif; font-size: 14px;
        margin-top: -15px; margin-right: 10px; z-index: 2; position: relative;
    }
    .badge-extraviado { background-color: #0d3b66; }
    .badge-avistado   { background-color: #f97316; }
    .badge-alojado    { background-color: #9ca3af; }

    /* Cards */
    .info-card {
        background-color: #faf0ca; border-radius: 12px; padding: 12px;
        display: flex; flex-direction: column; justify-content: center;
    }
    .label {
        color: #6b7280; font-size: 11px; margin-bottom: 4px;
        font-family: "Plus Jakarta Sans", sans-serif;
    }
    .value {
        color: #0d3b66; font-weight: 700; font-size: 14px;
        font-family: "Plus Jakarta Sans", sans-serif;
    }
    .value.small { font-size: 12px; }

    /* Grillas */
    .top-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .col-left    { display: flex; flex-direction: column; gap: 12px; }
    .col-right   { display: flex; flex-direction: column; gap: 12px; }
    .triple-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .double-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .tall        { flex: 1; align-items: center; text-align: center; }
    .center-text { text-align: center; align-items: center; }

    .symbol {
        font-size: 44px; color: #0d3b66; line-height: 1; margin-top: 4px;
    }
    .icon-value { font-size: 16px; margin-top: 4px; }

    /* Colores */
    .color-dots  { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 4px; }
    .color-dot-sm {
        width: 16px; height: 16px; border-radius: 50%;
        border: 1px solid rgba(0,0,0,0.15); display: inline-block;
    }

    /* Rasgos */
    .rasgos-card { background-color: #faf0ca; }
    .rasgos-text {
        color: #0d3b66; font-size: 13px; font-family: "Plus Jakarta Sans", sans-serif;
        margin: 6px 0 0 0; line-height: 1.5;
    }

    /* Contacto */
    .contact-section {
        display: flex; justify-content: space-between;
        align-items: center; margin-top: 8px; padding-bottom: 20px;
    }
    .owner-info h4 {
        margin: 0; color: #0d3b66; font-size: 16px;
        font-family: "Poppins", sans-serif; font-weight: 700;
    }
    .owner-info p { margin: 0; color: #6b7280; font-size: 12px; }
    .contact-btn {
        background-color: #f4d35e; border: none; padding: 12px 20px;
        border-radius: 12px; display: flex; align-items: center;
        gap: 8px; font-weight: 700; font-size: 14px; cursor: pointer;
    }

    /* Nav */
    .bottom-nav {
        position: fixed; bottom: 0; width: 100%; max-width: 400px;
        background: #fffefc; border-top: 1px solid #e5e7eb;
        display: flex; justify-content: space-around; align-items: center;
        padding: 12px 0 20px 0; z-index: 100;
        left: 50%; transform: translateX(-50%);
    }
</style>