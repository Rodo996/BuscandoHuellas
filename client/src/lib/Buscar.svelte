<script>
    import { createEventDispatcher, onMount } from "svelte";
    import NavBar from "./Navbar.svelte";

    const dispatch = createEventDispatcher();

    let mascotas = [];
    let searchQuery = "";

    // ─── Estado de pills ───────────────────────────────────────────
    let activePill = null; // null = ningún panel abierto

    // ─── Filtros por categoría ──────────────────────────────────────
    let filtroTipos    = { perro: false, gato: false, ave: false, otro: false };
    let filtroTamanos  = { pequeno: false, mediano: false, grande: false };
    let filtroSexos    = { macho: false, hembra: false };

    let filtroRazaBusqueda = "";

    let filtroColores  = {
        negro: false, blanco: false, cafe: false,
        gris: false, dorado: false, naranja: false, mixto: false
    };
    // Mas filtros
    let filtroEsCruza   = false;
    let filtroTieneCola = false;
    //Filtro fecha
    let ordenFecha = "reciente";
    // ─── Filtro rango de fechas ────────────────────────────────────
    let filtroFechaDesde = "";
    let filtroFechaHasta = "";
    $: badgeFecha = (filtroFechaDesde || filtroFechaHasta) ? 1 : 0;

    const limpiarFecha = () => {
        filtroFechaDesde = "";
        filtroFechaHasta = "";
    };

    // Dentro de <script> en Buscar.svelte
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "Sin fecha";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-MX', { 
            day: '2-digit', 
            month: 'short' 
        });
    };

    let radioBusqueda  = 1;
    // Para la fecha
    const cambiarOrden = (nuevoOrden) => {
        ordenFecha = nuevoOrden;
    };

    // ─── Carga de mascotas ─────────────────────────────────────────
    onMount(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/mascotas");
            if (response.ok) mascotas = await response.json();
        } catch (error) {
            console.error("No se pudieron cargar las mascotas:", error);
        }
    });

    // ─── Abrir / cerrar panels ─────────────────────────────────────
    const selectPill = (pillName) => {
        activePill = activePill === pillName ? null : pillName;
    };

    // ─── Limpiar por sección ───────────────────────────────────────
    const limpiarTipo = () => {
        filtroTipos   = { perro: false, gato: false, ave: false, otro: false };
        filtroTamanos = { pequeno: false, mediano: false, grande: false };
        filtroSexos   = { macho: false, hembra: false };
    };
    const limpiarRaza      = () => { filtroRazaBusqueda = ""; };
    const limpiarColor     = () => {
        filtroColores = { negro: false, blanco: false, cafe: false,
                         gris: false, dorado: false, naranja: false, mixto: false };
    };
    const limpiarUbicacion = () => { radioBusqueda = 1; };

    const aplicarFiltros   = () => { activePill = null; };

    // ─── Filtrado reactivo ─────────────────────────────────────────
    $: mascotasFiltradas = mascotas.filter((m) => {
        const termino = searchQuery.toLowerCase();
        const coincideTexto =
            m.name?.toLowerCase().includes(termino) ||
            m.raza?.toLowerCase().includes(termino) ||
            m.ubicacion?.toLowerCase().includes(termino) ||
            m.rasgos?.toLowerCase().includes(termino);

        const algunTipoActivo = Object.values(filtroTipos).some(Boolean);
        const coincideTipo = !algunTipoActivo || (
            (filtroTipos.perro && m.especie === "Perro") ||
            (filtroTipos.gato  && m.especie === "Gato")
        );

        const algunTamanoActivo = Object.values(filtroTamanos).some(Boolean);
        const coincideTamano = !algunTamanoActivo || (
            (filtroTamanos.pequeno && (m.tamano === "Pequeño" || m.tamano === "Muy Pequeño")) ||
            (filtroTamanos.mediano && m.tamano === "Mediano") ||
            (filtroTamanos.grande  && (m.tamano === "Grande"  || m.tamano === "Gigante"))
        );

        const algunSexoActivo = Object.values(filtroSexos).some(Boolean);
        const coincideSexo = !algunSexoActivo || (
            (filtroSexos.macho  && m.sexo === "Macho") ||
            (filtroSexos.hembra && m.sexo === "Hembra")
        );

        const coincideRaza = !filtroRazaBusqueda ||
            m.raza?.toLowerCase().includes(filtroRazaBusqueda.toLowerCase());

        const algunColorActivo = Object.values(filtroColores).some(Boolean);
        const coincideColor = !algunColorActivo || (
            Array.isArray(m.colores) && m.colores.some(c =>
                (filtroColores.negro   && c.nombre === "Negro")      ||
                (filtroColores.blanco  && c.nombre === "Blanco")     ||
                (filtroColores.cafe    && (c.nombre === "Café" || c.nombre === "Café claro")) ||
                (filtroColores.gris    && c.nombre === "Gris")       ||
                (filtroColores.dorado  && (c.nombre === "Amarillo"   || c.nombre === "Beige/Crema")) ||
                (filtroColores.naranja && c.nombre === "Naranja")    ||
                (filtroColores.mixto   && c.nombre === "Tricolor")
            )
        );

        const coincideCruza = !filtroEsCruza   || m.esCruza   === true;
        const coincideCola  = !filtroTieneCola || m.tieneCola === true;

        const coincideFecha = (() => {
            if (!filtroFechaDesde && !filtroFechaHasta) return true;
            if (!m.fecha) return false;
            const fechaMascota = new Date(m.fecha).getTime();
            const desde = filtroFechaDesde ? new Date(filtroFechaDesde + "T00:00:00").getTime() : null;
            const hasta = filtroFechaHasta ? new Date(filtroFechaHasta + "T23:59:59").getTime() : null;
            if (desde && fechaMascota < desde) return false;
            if (hasta && fechaMascota > hasta) return false;
            return true;
        })();

        return coincideTexto && coincideTipo && coincideTamano &&
            coincideSexo && coincideRaza && coincideColor &&
            coincideCruza && coincideCola && coincideFecha;
    });

    // ─── Luego ordenamos por separado ─────────────────────────────
    $: mascotasOrdenadas = [...mascotasFiltradas].sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return ordenFecha === "reciente" ? fechaB - fechaA : fechaA - fechaB;
    });
    // ─── Badge por pill ────────────────────────────────────────────
    $: badgeTipo = [
        ...Object.values(filtroTipos),
        ...Object.values(filtroTamanos),
        ...Object.values(filtroSexos)
    ].filter(Boolean).length;

    $: badgeRaza  = filtroRazaBusqueda ? 1 : 0;
    $: badgeColor = Object.values(filtroColores).filter(Boolean).length;
    $: badgeUbic  = radioBusqueda > 1 ? 1 : 0;

    const abrirPublicacion = (mascota) => dispatch("verPublicacion", mascota);
</script>

<!-- ═══════════════════════════ TEMPLATE ═══════════════════════════ -->

<div class="app-container">
    <!-- Header -->
    <div class="top-brand-header">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
            <ellipse cx="12.5" cy="21" rx="1.3" ry="1.8" transform="rotate(-20 12.5 21)" fill="#F4D35E"/>
            <ellipse cx="15.8" cy="19.5" rx="1.3" ry="1.8" transform="rotate(-6 15.8 19.5)" fill="#F4D35E"/>
            <ellipse cx="19.2" cy="19.5" rx="1.3" ry="1.8" transform="rotate(6 19.2 19.5)" fill="#F4D35E"/>
            <ellipse cx="22.5" cy="21" rx="1.3" ry="1.8" transform="rotate(20 22.5 21)" fill="#F4D35E"/>
            <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E"/>
        </svg>
        <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
    </div>

    <!-- Resultados header -->
    <div class="resultados-header">
        <h1>Resultados</h1>
        <button class="close-btn-clean" on:click={() => dispatch("volver")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D3B66"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <section class="search-section">
        <!-- Barra de búsqueda -->
        <div class="search-bar">
            <div class="input-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" bind:value={searchQuery} placeholder="Buscar..." />
            </div>
        </div>

        <!-- Pills -->
        <div class="filter-pills">
            <!-- TIPO -->
            <button class="pill" class:active={activePill === "Tipo"}
                on:click={() => selectPill("Tipo")}>
                Tipo {badgeTipo > 0 ? `(${badgeTipo})` : "▼"}
            </button>

            <!-- RAZA -->
            <button class="pill" class:active={activePill === "Raza"}
                on:click={() => selectPill("Raza")}>
                Raza {badgeRaza > 0 ? `(${badgeRaza})` : "▼"}
            </button>

            <!-- COLOR -->
            <button class="pill" class:active={activePill === "Color"}
                on:click={() => selectPill("Color")}>
                Color {badgeColor > 0 ? `(${badgeColor})` : "▼"}
            </button>

            <!-- UBICACIÓN -->
            <button class="pill" class:active={activePill === "Ubicación"}
                on:click={() => selectPill("Ubicación")}>
                Ubicación {badgeUbic > 0 ? `(${badgeUbic})` : "▼"}
            </button>

            <!-- FECHA -->
            <button class="pill" class:active={activePill === "Fecha"}
                on:click={() => selectPill("Fecha")}>
                Fecha {badgeFecha > 0 ? `(${badgeFecha})` : "▼"}
            </button>
        </div>
        <!-- Ordenar por fecha -->
        <div class="orden-row">
            <span class="orden-label">Ordenar por:</span>
            <div class="orden-pills">
                <button
                    class="orden-btn"
                    class:orden-active={ordenFecha === "reciente"}
                    on:click={() => cambiarOrden("reciente")}>
                    Más reciente
                </button>
                <button
                    class="orden-btn"
                    class:orden-active={ordenFecha === "antiguo"}
                    on:click={() => cambiarOrden("antiguo")}>
                    Más antiguo
                </button>
            </div>
        </div>

        <!-- ══════════ PANEL: TIPO ══════════ -->
        {#if activePill === "Tipo"}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Tipo de mascota</h2>
                    <button class="limpiar-btn" on:click={limpiarTipo}>Limpiar</button>
                </div>

                <div class="checkbox-column" style="margin-bottom:20px">
                    <h3>Especie</h3>
                    <div class="checkbox-row-group">
                        {#each [["perro","Perro"],["gato","Gato"],["ave","Ave"],["otro","Otro"]] as [key, label]}
                            <label class="custom-checkbox">
                                <input type="checkbox" bind:checked={filtroTipos[key]} />
                                <span class="checkmark">
                                    {#if filtroTipos[key]}<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>{/if}
                                </span>
                                {label}
                            </label>
                        {/each}
                    </div>
                </div>

                <div class="checkbox-grid" style="margin-bottom:20px">
                    <div class="checkbox-column">
                        <h3>Tamaño</h3>
                        {#each [["pequeno","Pequeño"],["mediano","Mediano"],["grande","Grande"]] as [key, label]}
                            <label class="custom-checkbox">
                                <input type="checkbox" bind:checked={filtroTamanos[key]} />
                                <span class="checkmark">
                                    {#if filtroTamanos[key]}<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>{/if}
                                </span>
                                {label}
                            </label>
                        {/each}
                    </div>
                    <div class="checkbox-column">
                        <h3>Sexo</h3>
                        {#each [["macho","Macho"],["hembra","Hembra"]] as [key, label]}
                            <label class="custom-checkbox">
                                <input type="checkbox" bind:checked={filtroSexos[key]} />
                                <span class="checkmark">
                                    {#if filtroSexos[key]}<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>{/if}
                                </span>
                                {label}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Nuevos filtros -->
                <div class="checkbox-column" style="margin-bottom:20px">
                    <h3>Características</h3>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroEsCruza} />
                        <span class="checkmark">
                            {#if filtroEsCruza}<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>{/if}
                        </span>
                        Es cruza / mestizo
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroTieneCola} />
                        <span class="checkmark">
                            {#if filtroTieneCola}<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>{/if}
                        </span>
                        Tiene cola
                    </label>
                </div>

                <button class="aplicar-btn" on:click={aplicarFiltros}>
                    Aplicar filtros {badgeTipo > 0 ? `(${badgeTipo})` : ""}
                </button>
            </div>
        {/if}

        <!-- ══════════ PANEL: RAZA ══════════ -->
        {#if activePill === "Raza"}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Raza</h2>
                    <button class="limpiar-btn" on:click={limpiarRaza}>Limpiar</button>
                </div>

                <div class="input-wrapper" style="margin-bottom: 20px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" bind:value={filtroRazaBusqueda}
                        placeholder="Ej: Labrador, Siamés..." />
                </div>

                <!-- Sugerencias rápidas -->
                <h3 style="font-size:13px;font-weight:600;color:#111827;margin-bottom:10px;">
                    Razas frecuentes
                </h3>
                <div class="tags-wrap">
                    {#each ["Labrador","Golden Retriever","Bulldog","Chihuahua","Siamés","Persa","Mestizo"] as raza}
                        <button class="tag-btn"
                            class:tag-active={filtroRazaBusqueda === raza}
                            on:click={() => filtroRazaBusqueda = filtroRazaBusqueda === raza ? "" : raza}>
                            {raza}
                        </button>
                    {/each}
                </div>

                <button class="aplicar-btn" style="margin-top:24px" on:click={aplicarFiltros}>
                    Aplicar filtros {badgeRaza > 0 ? `(${badgeRaza})` : ""}
                </button>
            </div>
        {/if}

        <!-- ══════════ PANEL: COLOR ══════════ -->
        {#if activePill === "Color"}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Color de pelaje</h2>
                    <button class="limpiar-btn" on:click={limpiarColor}>Limpiar</button>
                </div>

                <div class="color-grid">
                    {#each [
                        ["negro",  "#1C1C1E", "Negro"],
                        ["blanco", "#F5F5F0", "Blanco"],
                        ["cafe",   "#8B5E3C", "Café"],
                        ["gris",   "#9CA3AF", "Gris"],
                        ["dorado", "#F4D35E", "Dorado"],
                        ["naranja","#F97316", "Naranja"],
                        ["mixto",  "linear-gradient(135deg,#8B5E3C 50%,#F5F5F0 50%)", "Mixto"]
                    ] as [key, color, label]}
                        <button class="color-btn"
                            class:color-active={filtroColores[key]}
                            on:click={() => filtroColores[key] = !filtroColores[key]}>
                            <span class="color-dot"
                                style="background:{color}; {key==='blanco'?'border:1px solid #e5e7eb':''}">
                            </span>
                            <span class="color-label">{label}</span>
                            {#if filtroColores[key]}
                                <span class="color-check">✓</span>
                            {/if}
                        </button>
                    {/each}
                </div>

                <button class="aplicar-btn" style="margin-top:24px" on:click={aplicarFiltros}>
                    Aplicar filtros {badgeColor > 0 ? `(${badgeColor})` : ""}
                </button>
            </div>
        {/if}

        <!-- ══════════ PANEL: UBICACIÓN ══════════ -->
        {#if activePill === "Ubicación"}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Ubicación</h2>
                    <button class="limpiar-btn" on:click={limpiarUbicacion}>Limpiar</button>
                </div>

                <div class="slider-section">
                    <div class="slider-labels">
                        <span>Radio de búsqueda</span>
                        <span class="slider-value">{radioBusqueda} km</span>
                    </div>
                    <input type="range" min="1" max="50"
                        bind:value={radioBusqueda} class="custom-slider" />
                    <div class="slider-minmax">
                        <span>1 km</span>
                        <span>50 km</span>
                    </div>
                </div>

                <!-- Accesos rápidos de radio -->
                <div class="tags-wrap" style="margin-top:4px;margin-bottom:20px">
                    {#each [1,5,10,25,50] as km}
                        <button class="tag-btn"
                            class:tag-active={radioBusqueda === km}
                            on:click={() => radioBusqueda = km}>
                            {km} km
                        </button>
                    {/each}
                </div>

                <button class="aplicar-btn" on:click={aplicarFiltros}>
                    Aplicar filtros {badgeUbic > 0 ? `(${badgeUbic})` : ""}
                </button>
            </div>
        {/if}

        <!-- ══════════ PANEL: FECHA ══════════ -->
        {#if activePill === "Fecha"}
            <div class="filtros-panel">
                <div class="filtros-header">
                    <h2>Rango de fechas</h2>
                    <button class="limpiar-btn" on:click={limpiarFecha}>Limpiar</button>
                </div>

                <div class="fecha-field">
                    <label class="fecha-label">📅 Desde</label>
                    <input type="date" class="fecha-input" bind:value={filtroFechaDesde} />
                </div>

                <div class="fecha-field" style="margin-top:12px">
                    <label class="fecha-label">📅 Hasta</label>
                    <input type="date" class="fecha-input" bind:value={filtroFechaHasta} />
                </div>

                <h3 style="font-size:13px;font-weight:600;color:#111827;margin:16px 0 10px 0;">
                    Períodos rápidos
                </h3>
                <div class="tags-wrap">
                    {#each [["Hoy", 0], ["Última semana", 7], ["Último mes", 30], ["3 meses", 90]] as [label, dias]}
                        <button class="tag-btn"
                            on:click={() => {
                                const hoy   = new Date();
                                const desde = new Date();
                                desde.setDate(hoy.getDate() - dias);
                                filtroFechaDesde = desde.toISOString().split("T")[0];
                                filtroFechaHasta = hoy.toISOString().split("T")[0];
                            }}>
                            {label}
                        </button>
                    {/each}
                </div>

                <button class="aplicar-btn" style="margin-top:24px" on:click={aplicarFiltros}>
                    Aplicar filtros {badgeFecha > 0 ? `(${badgeFecha})` : ""}
                </button>
            </div>
        {/if}
    </section>

    <!-- Grid de resultados -->
    <section class="results-grid" style="padding-top: 0;">
        {#each mascotasOrdenadas as mascota (mascota.id)}
            <div class="pet-card" on:click={() => abrirPublicacion(mascota)}>
                <div class="pet-image-wrapper">
                    <img src={mascota.img} alt="Mascota" />
                    <div class="status-badge"
                        class:bg-extraviado={mascota.estado === "Extraviado"}
                        class:bg-alojado={mascota.estado !== "Extraviado"}>
                        {mascota.estado}
                    </div>
                </div>
                <div class="pet-info">
                    <div class="pet-info-icon">
                        {#if mascota.tieneEtiqueta}
                            <img src="/Img-Buscar/etiqueta.png" alt="Etiqueta" />
                        {/if}
                    </div>
                    <span>{mascota.raza} | {mascota.sexo} | {formatearFecha(mascota.fecha)} | {mascota.ubicacion}</span>
                </div>
            </div>
        {/each}
        {#if mascotasOrdenadas.length === 0}
            <div style="grid-column: span 2; text-align: center; color: #9CA3AF; padding: 20px; font-size: 14px;">
                No se encontraron mascotas con esos filtros.
            </div>
        {/if}
    </section>

    <NavBar vistaActiva="buscar"
        on:irAInicio={() => dispatch("volver")}
        on:irAPublicar={() => dispatch("irAPublicar")} />
</div>

<style>
    /* ── Mantén todos tus estilos originales ── */
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
    .text-white  { color: #ffffff; }
    .text-yellow { color: #f4d35e; }

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
    .close-btn-clean { background: none; border: none; cursor: pointer; padding: 4px; }

    .search-section { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .search-bar     { display: flex; gap: 10px; }
    .input-wrapper  {
        flex: 1;
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 10px 16px;
    }
    .input-wrapper input {
        border: none; outline: none; width: 100%; margin-left: 10px;
        font-family: "Plus Jakarta Sans", sans-serif;
        color: #242711; background: transparent;
    }

    .filter-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
    .filter-pills::-webkit-scrollbar { display: none; }
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
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .pill.active { background: #f4d35e; border-color: #f4d35e; font-weight: 600; }

    .filtros-panel {
        background: #ffffff;
        border: 1px solid #e8e8ce;
        border-radius: 16px;
        padding: 20px;
        margin-top: 4px;
        margin-bottom: 12px;
        box-shadow: 0px 4px 10px rgba(0,0,0,0.05);
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
    .limpiar-btn { background: none; border: none; color: #fbbf24; font-weight: 600; font-size: 12px; cursor: pointer; }

    /* Slider */
    .slider-section  { margin-bottom: 16px; }
    .slider-labels   { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #6b7280; }
    .slider-value    { font-weight: 700; color: #111827; }
    .custom-slider   { -webkit-appearance: none; width: 100%; height: 6px; background: #e5e7eb; border-radius: 5px; outline: none; }
    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 20px; height: 20px; border-radius: 50%;
        background: #0d3b66; cursor: pointer;
    }
    .slider-minmax { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #9ca3af; }

    /* Checkboxes */
    .checkbox-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .checkbox-column h3 { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 12px; }
    .checkbox-row-group { display: flex; flex-direction: column; gap: 0; }
    .custom-checkbox {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 12px; cursor: pointer;
        font-size: 13px; color: #6b7280;
    }
    .custom-checkbox input { display: none; }
    .checkmark {
        width: 18px; height: 18px;
        border-radius: 4px; border: 2px solid #e5e7eb;
        display: flex; justify-content: center; align-items: center;
        transition: all 0.2s ease; flex-shrink: 0;
    }
    .custom-checkbox input:checked + .checkmark { background-color: #f4d35e; border-color: #f4d35e; }

    /* Tags / sugerencias */
    .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag-btn {
        background: #f3f4f6; border: 1px solid #e5e7eb;
        border-radius: 20px; padding: 6px 14px;
        font-size: 12px; font-family: "Poppins", sans-serif;
        cursor: pointer; color: #374151; transition: all 0.2s;
    }
    .tag-btn.tag-active { background: #f4d35e; border-color: #f4d35e; font-weight: 600; }

    /* Color grid */
    .color-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .color-btn {
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        background: #f9fafb; border: 2px solid #e5e7eb;
        border-radius: 12px; padding: 10px 6px;
        cursor: pointer; position: relative; transition: all 0.2s;
    }
    .color-btn.color-active { border-color: #0d3b66; background: #eff6ff; }
    .color-dot  { width: 28px; height: 28px; border-radius: 50%; display: block; }
    .color-label { font-size: 10px; font-family: "Poppins", sans-serif; color: #374151; }
    .color-check {
        position: absolute; top: 4px; right: 6px;
        font-size: 10px; color: #0d3b66; font-weight: 700;
    }

    /* Aplicar btn */
    .aplicar-btn {
        width: 100%; background-color: #f4d35e;
        color: #111827; font-weight: 700;
        font-family: "Poppins", sans-serif;
        font-size: 14px; padding: 14px 0;
        border: none; border-radius: 12px; cursor: pointer;
    }

    /* Results grid */
    .results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; }
    .pet-card {
        background: white; border-radius: 16px; overflow: hidden;
        display: flex; flex-direction: column; position: relative;
        box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
        border: 2px solid transparent; cursor: pointer; transition: transform 0.2s;
    }
    .pet-card:hover { transform: scale(1.02); border-color: #e5e7eb; }
    .pet-image-wrapper { width: 100%; aspect-ratio: 1/1; position: relative; }
    .pet-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .status-badge {
        position: absolute; top: 10px; left: 10px;
        color: #ffffff; font-size: 11px;
        font-family: "Poppins", sans-serif; font-weight: 600;
        padding: 4px 12px; border-radius: 20px; backdrop-filter: blur(4px);
    }
    .bg-extraviado { background: rgba(13,59,102,0.7); }
    .bg-alojado    { background: rgba(156,163,175,0.7); }

    .pet-info {
        background: #f3f4f6; padding: 10px;
        font-family: "Poppins", sans-serif; font-size: 9px;
        font-weight: 600; color: #111827; line-height: 1.4;
        display: flex; align-items: flex-start; gap: 8px; flex: 1;
    }
    .pet-info-icon {
        width: 22px; height: 22px; background-color: #d1d5db;
        border-radius: 50%; display: flex; justify-content: center;
        align-items: center; flex-shrink: 0;
    }
    .pet-info-icon img { width: 14px; height: 14px; object-fit: contain; }
        /* Ordenamiento de los ultimos filtros de fecha por mas reciente */
    .orden-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .orden-label {
        font-size: 12px;
        font-family: "Poppins", sans-serif;
        color: #6b7280;
        white-space: nowrap;
    }
    .orden-pills {
        display: flex;
        gap: 8px;
    }
    .orden-btn {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    .orden-btn.orden-active {
        background: #0d3b66;
        border-color: #0d3b66;
        color: #ffffff;
        font-weight: 600;
    }
    /* Fechas */
    .fecha-field  { display: flex; flex-direction: column; gap: 6px; }
    .fecha-label  { font-size: 12px; font-family: "Poppins", sans-serif; color: #6b7280; font-weight: 500; }
    .fecha-input  {
        width: 100%; padding: 10px 14px;
        border: 1px solid #e5e7eb; border-radius: 12px;
        font-family: "Poppins", sans-serif; font-size: 13px;
        color: #111827; background: #f9fafb;
        outline: none; box-sizing: border-box;
    }
    .fecha-input:focus { border-color: #0d3b66; background: #ffffff; }
</style>