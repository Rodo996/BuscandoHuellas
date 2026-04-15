<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let activePill = 'Tipo';
  let searchQuery = '';
  
  // --- ESTADO DEL MENÚ DE FILTROS ---
  let mostrarFiltros = false;
  
  // Variables reactivas para los filtros
  let radioBusqueda = 1;
  let filtroTamanos = { pequeno: true, mediano: true };
  let filtroSexos = { macho: true, hembra: true };

  // Calculamos cuántos filtros están activos (para el botón)
  $: cantidadFiltros = (filtroTamanos.pequeno ? 1 : 0) + 
                       (filtroTamanos.mediano ? 1 : 0) + 
                       (filtroSexos.macho ? 1 : 0) + 
                       (filtroSexos.hembra ? 1 : 0) + 
                       (radioBusqueda > 0 ? 1 : 0);

  // Funciones manejadoras
  const selectPill = (pillName) => {
    activePill = pillName;
    mostrarFiltros = true; // Abrimos el panel al tocar un filtro
  };

  const limpiarFiltros = () => {
    radioBusqueda = 1;
    filtroTamanos = { pequeno: false, mediano: false };
    filtroSexos = { macho: false, hembra: false };
  };

  const aplicarFiltros = () => {
    mostrarFiltros = false;
  };

  // Base de datos simulada enriquecida
  const mascotas = [
    { id: 1, raza: 'Bernés de la montaña', sexo: 'Macho', tiempo: 'Visto hace 2 días', ubicacion: 'Plaza Patria', img: '/Img-Buscar/bernesbuscar.jpg', estado: 'Extraviado', tieneEtiqueta: true, tamano: 'Gigante', color: 'Negro, café, blanco', especie: 'Perro', cruza: 'No', discapacidades: 'No', cola: 'Sí', dueno: 'Laura García', duenoTiempo: 'Registrado hace 1 año' },
    { id: 2, raza: 'Golden Retriever', sexo: 'Macho', tiempo: 'Visto ayer', ubicacion: 'Paseo Chapultepec', img: '/Img-Buscar/golden.png', estado: 'Alojado', tieneEtiqueta: true, tamano: 'Grande', color: 'Dorado', especie: 'Perro', cruza: 'No', discapacidades: 'No', cola: 'Sí', dueno: 'Carlos Pérez', duenoTiempo: 'Registrado hace 3 meses' },
    { id: 3, raza: 'Chihuahua', sexo: 'Macho', tiempo: 'Visto hace 1 sem', ubicacion: 'Glorieta Chapalita', img: '/Img-Buscar/chihuahua.png', estado: 'Extraviado', tieneEtiqueta: false, tamano: 'Pequeño', color: 'Café claro', especie: 'Perro', cruza: 'Sí', discapacidades: 'No', cola: 'Sí', dueno: 'Ana Gómez', duenoTiempo: 'Registrado hace 2 años' },
    { id: 4, raza: 'Gato europeo', sexo: 'Hembra', tiempo: 'Visto hace 1 mes', ubicacion: 'Mercado Santa Tere', img: '/Img-Buscar/gato.png', estado: 'Avistado', tieneEtiqueta: true, tamano: 'Mediano', color: 'Gris atigrado', especie: 'Gato', cruza: 'No', discapacidades: 'Falta de visión', cola: 'Sí', dueno: 'Luis Hernández', duenoTiempo: 'Registrado hace 5 meses' },
    { id: 5, raza: 'Gato europeo', sexo: 'Macho', tiempo: 'Visto hace 1 mes', ubicacion: 'Santa Anita', img: '/Img-Buscar/gatomacho.jpg', estado: 'Alojado', tieneEtiqueta: true, tamano: 'Mediano', color: 'Naranja', especie: 'Gato', cruza: 'No', discapacidades: 'No', cola: 'No', dueno: 'Sofía Ramírez', duenoTiempo: 'Registrado hace 1 mes' },
    { id: 6, raza: 'Maltes', sexo: 'Hembra', tiempo: 'Visto hace 1 mes', ubicacion: 'Bugambilias', img: '/Img-Buscar/malte.jpg', estado: 'Avistado', tieneEtiqueta: true, tamano: 'Pequeño', color: 'Blanco', especie: 'Perro', cruza: 'No', discapacidades: 'No', cola: 'Sí', dueno: 'Mariana López', duenoTiempo: 'Registrado hace 4 años' }
  ];

  // --- LÓGICA DE FILTRADO COMBINADO ---
  $: mascotasFiltradas = mascotas.filter(mascota => {
    // 1. Filtro de búsqueda por texto
    const termino = searchQuery.toLowerCase();
    const coincideTexto = mascota.raza.toLowerCase().includes(termino) ||
                          mascota.ubicacion.toLowerCase().includes(termino) ||
                          mascota.estado.toLowerCase().includes(termino);
                          
    // 2. Filtro de Sexo (Si ninguno está seleccionado, mostramos todos)
    let coincideSexo = true;
    if (filtroSexos.macho || filtroSexos.hembra) {
      coincideSexo = (filtroSexos.macho && mascota.sexo === 'Macho') || 
                     (filtroSexos.hembra && mascota.sexo === 'Hembra');
    }

    return coincideTexto && coincideSexo;
  });
  // FUNCIÓN PARA VER DETALLE
  const abrirPublicacion = (mascota) => {
    dispatch('verPublicacion', mascota);
  };
</script>

<div class="app-container">
    <header class="header">
    
        <div class="logo-title">
            <span class="buscando">Buscando</span><span class="huellas">Huellas</span>
        </div>
        <div class="header-top">
            <h1>Resultados</h1>
            <button class="close-btn" on:click={() => dispatch('volver')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#FFFFFF"/>
                </svg>
            </button>
        </div>
    </header>

    <section class="search-section">
        <div class="search-bar">
            <div class="input-wrapper">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.83 15L8.58 9.75C8.16 10.08 7.68 10.34 7.14 10.54C6.6 10.73 6.02 10.83 5.41 10.83C3.9 10.83 2.62 10.3 1.57 9.26C0.52 8.21 0 6.93 0 5.41C0 3.9 0.52 2.62 1.57 1.57C2.62 0.52 3.9 0 5.41 0C6.93 0 8.21 0.52 9.26 1.57C10.3 2.62 10.83 3.9 10.83 5.41C10.83 6.02 10.73 6.6 10.54 7.14C10.34 7.68 10.08 8.16 9.75 8.58L15 13.83L13.83 15ZM5.41 9.16C6.45 9.16 7.34 8.8 8.07 8.07C8.8 7.34 9.16 6.45 9.16 5.41C9.16 4.37 8.8 3.48 8.07 2.76C7.34 2.03 6.45 1.66 5.41 1.66C4.37 1.66 3.48 2.03 2.76 2.76C2.03 3.48 1.66 4.37 1.66 5.41C1.66 6.45 2.03 7.34 2.76 8.07C3.48 8.8 4.37 9.16 5.41 9.16Z" fill="#6B6B47"/>
                </svg>
                <input type="text" bind:value={searchQuery} placeholder="Buscar...">
            </div>
            
            <button class="filter-icon-btn" on:click={() => mostrarFiltros = !mostrarFiltros}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 18V12H10V14H18V16H10V18H8ZM0 16V14H6V16H0ZM4 12V10H0V8H4V6H6V12H4ZM8 10V8H18V10H8ZM12 6V0H14V2H18V4H14V6H12ZM0 4V2H10V4H0Z" fill="#1C1C0D"/>
                </svg>
            </button>
        </div>
        
        <div class="filter-pills">
            <button class="pill" class:active={activePill === 'Tipo'} on:click={() => selectPill('Tipo')}>Tipo ▼</button>
            <button class="pill" class:active={activePill === 'Raza'} on:click={() => selectPill('Raza')}>Raza ▼</button>
            <button class="pill" class:active={activePill === 'Color'} on:click={() => selectPill('Color')}>Color ▼</button>
            <button class="pill" class:active={activePill === 'Ubicación'} on:click={() => selectPill('Ubicación')}>Ubicación ▼</button>
        </div>

        {#if mostrarFiltros}
        <div class="filtros-panel">
            <div class="filtros-header">
                <h2>Filtros activos</h2>
                <button class="limpiar-btn" on:click={limpiarFiltros}>Limpiar todo</button>
            </div>

            <div class="slider-section">
                <div class="slider-labels">
                    <span>Radio de búsqueda</span>
                    <span class="slider-value">{radioBusqueda} km</span>
                </div>
                <input type="range" min="1" max="50" bind:value={radioBusqueda} class="custom-slider">
                <div class="slider-minmax">
                    <span>1km</span>
                    <span>50km</span>
                </div>
            </div>

            <div class="checkbox-grid">
                <div class="checkbox-column">
                    <h3>Tamaño</h3>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroTamanos.pequeno}>
                        <span class="checkmark">
                            {#if filtroTamanos.pequeno}<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>{/if}
                        </span>
                        Pequeño
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroTamanos.mediano}>
                        <span class="checkmark">
                            {#if filtroTamanos.mediano}<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>{/if}
                        </span>
                        Mediano
                    </label>
                </div>
                
                <div class="checkbox-column">
                    <h3>Sexo</h3>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroSexos.macho}>
                        <span class="checkmark">
                            {#if filtroSexos.macho}<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>{/if}
                        </span>
                        Macho
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" bind:checked={filtroSexos.hembra}>
                        <span class="checkmark">
                            {#if filtroSexos.hembra}<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>{/if}
                        </span>
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
            <div class="pet-card" on:click={() => abrirPublicacion(mascota)} style="cursor: pointer;">
                <div class="pet-image-wrapper">
                    <img src={mascota.img} alt="Mascota">
                    <div class="status-badge">{mascota.estado}</div>
                </div>
                <div class="pet-info">
                    <div class="pet-info-icon">
                        {#if mascota.tieneEtiqueta}
                            <img src="/Img-Buscar/etiqueta.png" alt="Etiqueta">
                        {/if}
                    </div>
                    <span>{mascota.raza} | {mascota.sexo} | {mascota.tiempo} | {mascota.ubicacion}</span>
                </div>
            </div>
        {/each}
        
        {#if mascotasFiltradas.length === 0}
            <div style="grid-column: span 2; text-align: center; color: #9CA3AF; padding: 20px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                No se encontraron mascotas con esos filtros.
            </div>
        {/if}
    </section>

    <nav class="bottom-nav">
        <a href="#" class="nav-item" on:click|preventDefault={() => dispatch('volver')}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z" fill="#9CA3AF"/>
            </svg>
            Inicio
        </a>
        <a href="#" class="nav-item active">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#FBBF24"/>
            </svg>
            Buscar
        </a>
        <div class="nav-fab">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 10H0V7.5H7.5V0H10V7.5H17.5V10H10V17.5H7.5V10Z" fill="#111827"/>
            </svg>
        </div>
        <a href="#" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20V2C0 1.45 0.195 0.979 0.587 0.587C0.979 0.195 1.45 0 2 0H18C18.55 0 19.02 0.195 19.41 0.587C19.8 0.979 20 1.45 20 2V14C20 14.55 19.8 15.02 19.41 15.41C19.02 15.8 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.12L3.15 14ZM2 14V2V14Z" fill="#9CA3AF"/>
            </svg>
            Chats
        </a>
        <a href="#" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8C6.9 8 5.958 7.608 5.175 6.825C4.391 6.041 4 5.1 4 4C4 2.9 4.391 1.958 5.175 1.175C5.958 0.391 6.9 0 8 0C9.1 0 10.04 0.391 10.82 1.175C11.60 1.958 12 2.9 12 4C12 5.1 11.60 6.041 10.82 6.825C10.04 7.608 9.1 8 8 8ZM0 16V13.2C0 12.63 0.145 12.11 0.437 11.63C0.729 11.16 1.116 10.8 1.6 10.55C2.633 10.03 3.683 9.645 4.75 9.387C5.816 9.129 6.9 9 8 9C9.1 9 10.18 9.129 11.25 9.387C12.31 9.645 13.36 10.03 14.4 10.55C14.88 10.8 15.27 11.16 15.56 11.63C15.85 12.11 16 12.63 16 13.2V16H0ZM8 6C8.55 6 9.02 5.804 9.412 5.412C9.804 5.02 10 4.55 10 4C10 3.45 9.804 2.979 9.412 2.587C9.02 2.195 8.55 2 8 2C7.45 2 6.979 2.195 6.587 2.587C6.195 2.979 6 3.45 6 4C6 4.55 6.195 5.02 6.587 5.412C6.979 5.804 7.45 6 8 6Z" fill="#9CA3AF"/>
            </svg>
            Perfil
        </a>
    </nav>
</div>

<style>
    /* ... Tus estilos anteriores se mantienen iguales hasta aquí ... */
    :global(body) { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F3F4F6; display: flex; justify-content: center; margin: 0; padding: 0; }
    * { box-sizing: border-box; }
    .app-container { width: 100%; max-width: 400px; background-color: #FFFFFF; min-height: 100vh; position: relative; padding-bottom: 90px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); overflow-x: hidden; }
    .header { background-color: #0D3B66; padding: 24px 20px; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; color: white; }
    .logo-title { text-align: center; font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 20px; }
    .logo-title .buscando { color: #F4D35E; }
    .logo-title .huellas { color: #FAF0CA; }
    .header-top { display: flex; justify-content: space-between; align-items: center; }
    .header-top h1 { font-size: 20px; font-weight: 700; }
    .close-btn { background: rgba(255,255,255,0.1); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .search-section { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .search-bar { display: flex; gap: 10px; }
    .input-wrapper { flex: 1; display: flex; align-items: center; background: #FFFFFF; border: 1px solid #E8E8CE; border-radius: 12px; padding: 10px 16px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); }
    .input-wrapper input { border: none; outline: none; width: 100%; margin-left: 10px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1C1C0D; }
    .filter-icon-btn { background: #FFFFFF; border: 1px solid #E8E8CE; border-radius: 12px; padding: 10px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .filter-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
    .filter-pills::-webkit-scrollbar { display: none; }
    .pill { background: #FFFFFF; border: 1px solid #E8E8CE; border-radius: 20px; padding: 6px 16px; font-size: 14px; font-weight: 500; color: #1C1C0D; white-space: nowrap; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s ease; }
    .pill.active { background: #F4D35E; border-color: #F4D35E; }

    /* --- NUEVOS ESTILOS DEL PANEL DE FILTROS --- */
    .filtros-panel {
        background: #FFFFFF;
        border: 1px solid #E8E8CE;
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
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin: 0;
    }
    .limpiar-btn {
        background: none;
        border: none;
        color: #FBBF24;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
    }

    .slider-section {
        margin-bottom: 24px;
    }
    .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        color: #6B7280;
    }
    .slider-value {
        font-weight: 700;
        color: #111827;
    }
    
    /* Input Range Custom (Slider) */
    .custom-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: #E5E7EB;
        border-radius: 5px;
        outline: none;
    }
    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #1E3A8A; /* Color azul oscuro simulando la imagen */
        cursor: pointer;
    }
    .custom-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #1E3A8A;
        cursor: pointer;
    }
    
    .slider-minmax {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: #9CA3AF;
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
    
    /* Checkbox Customizados */
    .custom-checkbox {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 14px;
        color: #6B7280;
    }
    .custom-checkbox input {
        display: none; /* Ocultamos el checkbox real */
    }
    .checkmark {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        border: 2px solid #E5E7EB;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
    }
    .custom-checkbox input:checked + .checkmark {
        background-color: #F4D35E;
        border-color: #F4D35E;
    }

    /* Botón Aplicar */
    .aplicar-btn {
        width: 100%;
        background-color: #F4D35E;
        color: #111827;
        font-weight: 600;
        font-size: 14px;
        padding: 14px 0;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }
    .aplicar-btn:active {
        opacity: 0.8;
    }

    /* --- ESTILOS DE LA GRILLA (SE MANTIENEN IGUALES) --- */
    .results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; }
    .pet-card { background: #D9D9D9; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
    .pet-image-wrapper { width: 100%; aspect-ratio: 1 / 1; position: relative; }
    .pet-image-wrapper img { width: 100%; height: 100%; object-fit: cover; background-color: #E5E7EB; }
    .status-badge { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(13, 59, 102, 0.5); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; font-size: 12px; font-weight: 600; padding: 4px 16px; border-radius: 20px; }
    .pet-info { background: rgba(217, 217, 217, 0.95); padding: 8px; font-family: 'Poppins', sans-serif; font-size: 9px; font-weight: 500; color: #000; line-height: 1.4; display: flex; align-items: center; gap: 6px; }
    .pet-info-icon { width: 16px; height: 16px; background-color: #9CA3AF; border-radius: 50%; flex-shrink: 0; }
    .pet-info-icon img { width: 100%; height: 100%; border-radius: 50%; }

    .bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 400px; background: #FFFEFC; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px 0; z-index: 100; }
    .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: #9CA3AF; font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 500; transition: color 0.2s ease; }
    .nav-item.active { color: #FBBF24; }
    .nav-fab { background: #FBBF24; width: 58px; height: 58px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 4px solid #FFFFFF; transform: translateY(-20px); box-shadow: 0px 4px 10px rgba(0,0,0,0.1); text-decoration: none; }
</style>