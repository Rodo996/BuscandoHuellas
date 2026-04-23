<script>
    import { createEventDispatcher, onMount } from "svelte";
    import NavBar from "./Navbar.svelte";

    const dispatch = createEventDispatcher();

    let mascotas = [];
    let activePill = "Tipo";
    let searchQuery = "";

    onMount(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/mascotas");
            if (response.ok) {
                mascotas = await response.json();
            }
        } catch (error) {
            console.error("No se pudieron cargar las mascotas:", error);
        }
    });

    let mostrarFiltros = false;
    let radioBusqueda = 1;
    let filtroTamanos = { pequeno: true, mediano: true, grande: true };
    let filtroSexos = { macho: true, hembra: true };

    $: cantidadFiltros =
        (filtroTamanos.pequeno ? 1 : 0) +
        (filtroTamanos.mediano ? 1 : 0) +
        (filtroTamanos.grande ? 1 : 0) +
        (filtroSexos.macho ? 1 : 0) +
        (filtroSexos.hembra ? 1 : 0) +
        (radioBusqueda > 0 ? 1 : 0);

    const selectPill = (pillName) => {
        activePill = pillName;
        mostrarFiltros = true;
    };

    const limpiarFiltros = () => {
        radioBusqueda = 1;
        filtroTamanos = { pequeno: false, mediano: false, grande: false };
        filtroSexos = { macho: false, hembra: false };
    };

    const aplicarFiltros = () => {
        mostrarFiltros = false;
    };

    $: mascotasFiltradas = mascotas.filter((mascota) => {
        const termino = searchQuery.toLowerCase();
        const coincideTexto =
            mascota.name?.toLowerCase().includes(termino) ||
            mascota.raza?.toLowerCase().includes(termino) ||
            mascota.ubicacion?.toLowerCase().includes(termino);

        const coincideSexo =
            (filtroSexos.macho && mascota.sexo === "Macho") ||
            (filtroSexos.hembra && mascota.sexo === "Hembra") ||
            (!filtroSexos.macho && !filtroSexos.hembra);

        const coincideTamano =
            (filtroTamanos.pequeno && mascota.tamano === "Pequeño") ||
            (filtroTamanos.mediano && mascota.tamano === "Mediano") ||
            (filtroTamanos.grande && mascota.tamano === "Grande") ||
            (!filtroTamanos.pequeno &&
                !filtroTamanos.mediano &&
                !filtroTamanos.grande);

        return coincideTexto && coincideSexo && coincideTamano;
    });

    const abrirPublicacion = (mascota) => {
        dispatch("verPublicacion", mascota);
    };
</script>

<div class="app-container">
    <div class="top-brand-header">
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline
                points="2,17 18,4 34,17"
                stroke="#F4D35E"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <rect
                x="7"
                y="16"
                width="22"
                height="16"
                rx="1"
                stroke="#F4D35E"
                stroke-width="2.5"
                fill="none"
            />
            <ellipse
                cx="12.5"
                cy="21"
                rx="1.3"
                ry="1.8"
                transform="rotate(-20 12.5 21)"
                fill="#F4D35E"
            />
            <ellipse
                cx="15.8"
                cy="19.5"
                rx="1.3"
                ry="1.8"
                transform="rotate(-6 15.8 19.5)"
                fill="#F4D35E"
            />
            <ellipse
                cx="19.2"
                cy="19.5"
                rx="1.3"
                ry="1.8"
                transform="rotate(6 19.2 19.5)"
                fill="#F4D35E"
            />
            <ellipse
                cx="22.5"
                cy="21"
                rx="1.3"
                ry="1.8"
                transform="rotate(20 22.5 21)"
                fill="#F4D35E"
            />
            <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
        </svg>
        <span class="text-white">Buscando</span><span class="text-yellow"
            >Huellas</span
        >
    </div>

    <div class="resultados-header">
        <h1>Resultados</h1>
        <button class="close-btn-clean" on:click={() => dispatch("volver")}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0D3B66"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="18" y1="6" x2="6" y2="18"></line><line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                ></line></svg
            >
        </button>
    </div>

    <section class="search-section">
        <div class="search-bar">
            <div class="input-wrapper">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="11" cy="11" r="8"></circle><line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                    ></line></svg
                >
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Buscar..."
                />
            </div>

            <button
                class="filter-icon-btn"
                on:click={() => (mostrarFiltros = !mostrarFiltros)}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1C1C0D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><line x1="4" y1="21" x2="4" y2="14"></line><line
                        x1="4"
                        y1="10"
                        x2="4"
                        y2="3"
                    ></line><line x1="12" y1="21" x2="12" y2="12"></line><line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="3"
                    ></line><line x1="20" y1="21" x2="20" y2="16"></line><line
                        x1="20"
                        y1="12"
                        x2="20"
                        y2="3"
                    ></line><line x1="1" y1="14" x2="7" y2="14"></line><line
                        x1="9"
                        y1="8"
                        x2="15"
                        y2="8"
                    ></line><line x1="17" y1="16" x2="23" y2="16"></line></svg
                >
            </button>
        </div>

        <div class="filter-pills">
            <button
                class="pill"
                class:active={activePill === "Tipo"}
                on:click={() => selectPill("Tipo")}>Tipo ▼</button
            >
            <button
                class="pill"
                class:active={activePill === "Raza"}
                on:click={() => selectPill("Raza")}>Raza ▼</button
            >
            <button
                class="pill"
                class:active={activePill === "Color"}
                on:click={() => selectPill("Color")}>Color ▼</button
            >
            <button
                class="pill"
                class:active={activePill === "Ubicación"}
                on:click={() => selectPill("Ubicación")}>Ubicación ▼</button
            >
        </div>

        {#if mostrarFiltros}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Filtros activos</h2>
                    <button class="limpiar-btn" on:click={limpiarFiltros}
                        >Limpiar todo</button
                    >
                </div>

                <div class="slider-section">
                    <div class="slider-labels">
                        <span>Radio de búsqueda</span>
                        <span class="slider-value">{radioBusqueda} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        bind:value={radioBusqueda}
                        class="custom-slider"
                    />
                    <div class="slider-minmax">
                        <span>1km</span>
                        <span>50km</span>
                    </div>
                </div>

                <div class="checkbox-grid">
                    <div class="checkbox-column">
                        <h3>Tamaño</h3>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                bind:checked={filtroTamanos.pequeno}
                            />
                            <span class="checkmark"
                                >{#if filtroTamanos.pequeno}<svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        ><path
                                            d="M1 5L4.5 8.5L11 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg
                                    >{/if}</span
                            >
                            Pequeño
                        </label>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                bind:checked={filtroTamanos.mediano}
                            />
                            <span class="checkmark"
                                >{#if filtroTamanos.mediano}<svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        ><path
                                            d="M1 5L4.5 8.5L11 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg
                                    >{/if}</span
                            >
                            Mediano
                        </label>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                bind:checked={filtroTamanos.grande}
                            />
                            <span class="checkmark"
                                >{#if filtroTamanos.grande}<svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        ><path
                                            d="M1 5L4.5 8.5L11 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg
                                    >{/if}</span
                            >
                            Grande
                        </label>
                    </div>
                    <div class="checkbox-column">
                        <h3>Sexo</h3>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                bind:checked={filtroSexos.macho}
                            />
                            <span class="checkmark"
                                >{#if filtroSexos.macho}<svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        ><path
                                            d="M1 5L4.5 8.5L11 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg
                                    >{/if}</span
                            >
                            Macho
                        </label>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                bind:checked={filtroSexos.hembra}
                            />
                            <span class="checkmark"
                                >{#if filtroSexos.hembra}<svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        ><path
                                            d="M1 5L4.5 8.5L11 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg
                                    >{/if}</span
                            >
                            Hembra
                        </label>
                    </div>
                </div>

                <button class="aplicar-btn" on:click={aplicarFiltros}>
                    Aplicar filtros ({cantidadFiltros})
                </button>
            </div>
        {/if}
    </section>

    <section class="results-grid" style="padding-top: 0;">
        {#each mascotasFiltradas as mascota (mascota.id)}
            <div class="pet-card" on:click={() => abrirPublicacion(mascota)}>
                <div class="pet-image-wrapper">
                    <img src={mascota.img} alt="Mascota" />
                    <div
                        class="status-badge"
                        class:bg-extraviado={mascota.estado === "Extraviado"}
                        class:bg-alojado={mascota.estado !== "Extraviado"}
                    >
                        {mascota.estado}
                    </div>
                </div>
                <div class="pet-info">
                    <div class="pet-info-icon">
                        {#if mascota.tieneEtiqueta}
                            <img
                                src="/Img-Buscar/etiqueta.png"
                                alt="Etiqueta"
                            />
                        {/if}
                    </div>
                    <span
                        >{mascota.raza} | {mascota.sexo} | {mascota.tiempo} | {mascota.ubicacion}</span
                    >
                </div>
            </div>
        {/each}
        {#if mascotasFiltradas.length === 0}
            <div
                style="grid-column: span 2; text-align: center; color: #9CA3AF; padding: 20px; font-size: 14px;"
            >
                No se encontraron mascotas con esos filtros.
            </div>
        {/if}
    </section>

    <NavBar
        vistaActiva="buscar"
        on:irAInicio={() => dispatch("volver")}
        on:irAPublicar={() => dispatch("irAPublicar")}
    />
</div>

<style>
    /* Header Azul y Cabecera Blanca */
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
    .text-white {
        color: #ffffff;
    }
    .text-yellow {
        color: #f4d35e;
    }

    .resultados-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px 4px 20px;
        background: white;
    }
    .resultados-header h1 {
        font-family: "Poppins", sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #0d3b66;
        margin: 0;
    }
    .close-btn-clean {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
    }

    /* Barra Búsqueda */
    .search-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .search-bar {
        display: flex;
        gap: 10px;
    }
    .input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 10px 16px;
    }
    .input-wrapper input {
        border: none;
        outline: none;
        width: 100%;
        margin-left: 10px;
        font-family: "Plus Jakarta Sans", sans-serif;
        color: #111827;
    }
    .filter-icon-btn {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .filter-pills {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 4px;
    }
    .filter-pills::-webkit-scrollbar {
        display: none;
    }
    .pill {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 13px;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        color: #111827;
        white-space: nowrap;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .pill.active {
        background: #f4d35e;
        border-color: #f4d35e;
        font-weight: 600;
    }

    /* Panel de Filtros */
    .filtros-panel {
        background: #ffffff;
        border: 1px solid #e8e8ce;
        border-radius: 16px;
        padding: 20px;
        margin-top: 4px;
        margin-bottom: 12px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    }
    .filtros-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .filtros-header h2 {
        font-size: 16px;
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        color: #111827;
        margin: 0;
    }
    .limpiar-btn {
        background: none;
        border: none;
        color: #fbbf24;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
    }
    .slider-section {
        margin-bottom: 24px;
    }
    .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 13px;
        color: #6b7280;
    }
    .slider-value {
        font-weight: 700;
        color: #111827;
    }
    .custom-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: #e5e7eb;
        border-radius: 5px;
        outline: none;
    }
    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #0d3b66;
        cursor: pointer;
    }
    .slider-minmax {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 11px;
        color: #9ca3af;
    }
    .checkbox-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 24px;
    }
    .checkbox-column h3 {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 12px;
    }
    .custom-checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 13px;
        color: #6b7280;
    }
    .custom-checkbox input {
        display: none;
    }
    .checkmark {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 2px solid #e5e7eb;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
    }
    .custom-checkbox input:checked + .checkmark {
        background-color: #f4d35e;
        border-color: #f4d35e;
    }
    .aplicar-btn {
        width: 100%;
        background-color: #f4d35e;
        color: #111827;
        font-weight: 700;
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        padding: 14px 0;
        border: none;
        border-radius: 12px;
        cursor: pointer;
    }

    /* Grilla Resultados */
    .results-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 16px;
    }
    .pet-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
        border: 2px solid transparent;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .pet-card:hover {
        transform: scale(1.02);
        border-color: #e5e7eb;
    }
    .pet-image-wrapper {
        width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
    }
    .pet-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Estilos correctos del Badge superior izquierdo */
    .status-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        color: #ffffff;
        font-size: 11px;
        font-family: "Poppins", sans-serif;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
        backdrop-filter: blur(4px);
    }
    .bg-extraviado {
        background: rgba(13, 59, 102, 0.7);
    } /* Azul oscuro transparente */
    .bg-alojado {
        background: rgba(156, 163, 175, 0.7);
    } /* Gris transparente */

    .pet-info {
        background: #f3f4f6;
        padding: 10px;
        font-family: "Poppins", sans-serif;
        font-size: 9px;
        font-weight: 600;
        color: #111827;
        line-height: 1.4;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        flex: 1;
    }
    .pet-info-icon {
        width: 22px;
        height: 22px;
        background-color: #d1d5db;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
    .pet-info-icon img {
        width: 14px;
        height: 14px;
        object-fit: contain;
    }
</style>
