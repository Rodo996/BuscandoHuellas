<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  const dispatch = createEventDispatcher();

  const API = "http://localhost:3000/api";

  let tipoPublicacion = "Extraviado";

  // --- Campos del formulario ---
  let nombreMascota = "";
  let especieSeleccionada = null;
  let razaSeleccionada = null;
  let tamano = "";
  let tieneCola = "";
  let colorSeleccionado = null;
  let sexo = "";
  let discapacidadesSeleccionadas = [];
  let rasgosDistintivos = "";
  let direccion = "";
  let fecha = "";
  let hora = "";
  let tuNombre = "";
  let telefono = "";
  let email = "";

  // --- Catálogos desde API ---
  let especies = [];
  let razasDisponibles = [];
  let opcionesColor = [];
  let opcionesDiscapacidad = [];
  let cargando = true;

  onMount(async () => {
    try {
      const [speciesRes, colorsRes, disabilitiesRes] = await Promise.all([
        fetch(`${API}/catalogs/species`),
        fetch(`${API}/catalogs/colors`),
        fetch(`${API}/catalogs/disabilities`),
      ]);
      especies = await speciesRes.json();
      opcionesColor = await colorsRes.json();
      opcionesDiscapacidad = await disabilitiesRes.json();
    } catch (err) {
      console.error("Error cargando catálogos:", err);
    } finally {
      cargando = false;
    }
    document.addEventListener("click", cerrarDropdown);
  });

  function cerrarDropdown(e) {
    if (!e.target.closest(".color-dropdown-wrapper")) {
      dropdownColorAbierto = false;
    }
  }

  // Cargar razas cuando cambia la especie
  async function cargarRazas(species_id) {
    console.log("species_id recibido:", species_id);
    razaSeleccionada = null;
    razasDisponibles = [];
    if (!species_id) return;
    const res = await fetch(`${API}/catalogs/breeds/${species_id}`);
    razasDisponibles = await res.json();
  }

  $: if (especieSeleccionada) cargarRazas(especieSeleccionada.species_id);

  // --- Validación ---
  let intentoEnvio = false;
  let errores = {};

  function validar() {
    errores = {};
    if (!nombreMascota.trim()) errores.nombreMascota = true;
    if (!especieSeleccionada) errores.especie = true;
    if (!razaSeleccionada) errores.raza = true;
    if (!tamano) errores.tamano = true;
    if (!tieneCola) errores.tieneCola = true;
    if (!colorSeleccionado) errores.color = true;
    if (!sexo) errores.sexo = true;
    if (discapacidadesSeleccionadas.length === 0) errores.discapacidades = true;
    if (!direccion.trim()) errores.direccion = true;
    if (!fecha) errores.fecha = true;
    if (!tuNombre.trim()) errores.tuNombre = true;
    if (!email.trim()) errores.email = true;
    return Object.keys(errores).length === 0;
  }

  async function handlePublicar() {
    intentoEnvio = true;
    if (!validar()) return;

    const payload = {
      name: nombreMascota,
      breed_id: razaSeleccionada.breed_id,
      is_mixed_breed: false,
      sex: sexo === "Macho" ? "Male" : sexo === "Hembra" ? "Female" : "Unknown",
      size:
        tamano === "Pequeño"
          ? "Small"
          : tamano === "Mediano"
            ? "Medium"
            : "Large",
      has_tail: tieneCola === "Sí",
      distinctive_features: rasgosDistintivos,
      color_ids: [colorSeleccionado.color_id],
      disability_ids: discapacidadesSeleccionadas.map((d) => d.disability_id),
      zip_code: "45010", // temporal hasta geocoding
      street: direccion,
      lat: 20.6597,
      lng: -103.3496,
      user_id: 1, // temporal hasta auth
      type:
        tipoPublicacion === "Extraviado"
          ? "Lost"
          : tipoPublicacion === "Avistado"
            ? "Spotted"
            : "Sheltered",
    };

    try {
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error del servidor");
      dispatch("publicado");
    } catch (err) {
      console.error(err);
      alert("No se pudo publicar. Intenta de nuevo.");
    }
  }

  // --- Color dropdown ---
  let dropdownColorAbierto = false;

  function seleccionarColor(opcion) {
    colorSeleccionado = opcion;
    dropdownColorAbierto = false;
  }

  // --- Discapacidades ---
  function toggleDiscapacidad(opcion) {
    const existe = discapacidadesSeleccionadas.find(
      (d) => d.disability_id === opcion.disability_id,
    );
    if (existe) {
      discapacidadesSeleccionadas = discapacidadesSeleccionadas.filter(
        (d) => d.disability_id !== opcion.disability_id,
      );
    } else {
      discapacidadesSeleccionadas = [...discapacidadesSeleccionadas, opcion];
    }
  }
</script>

<div class="app-container">
  <!-- Header azul -->
  <div class="top-brand-header">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <polyline
        points="2,17 18,4 34,17"
        stroke="#F4D35E"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
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

  <!-- Subheader -->
  <div class="page-header">
    <h1 class="page-title">Hacer publicación</h1>
    <button
      class="close-btn"
      on:click={() => dispatch("volver")}
      type="button"
      aria-label="Cerrar"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
          fill="#0D3B66"
        />
      </svg>
    </button>
  </div>

  <div class="form-body">
    <!-- Tipo de publicación -->
    <div class="field-group">
      <label class="field-label">Tipo de publicación</label>
      <div class="tipo-btns">
        {#each ["Extraviado", "Avistado", "Alojado"] as tipo}
          <button
            class="tipo-btn"
            class:active={tipoPublicacion === tipo}
            on:click={() => (tipoPublicacion = tipo)}
            type="button">{tipo}</button
          >
        {/each}
      </div>
    </div>

    <!-- Nombre de la mascota -->
    <div class="field-group">
      <label class="field-label">
        Nombre de la mascota <span class="req">*</span>
      </label>
      <div
        class="input-row"
        class:error={intentoEnvio && errores.nombreMascota}
      >
        <input
          class="input-inner"
          type="text"
          placeholder="Ej. Max"
          bind:value={nombreMascota}
        />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.825L4.25 18H0Z"
            fill="#9C9C49"
          />
        </svg>
      </div>
      {#if intentoEnvio && errores.nombreMascota}<span class="error-msg"
          >Campo obligatorio</span
        >{/if}
    </div>

    <!-- Especie + Raza -->
    <div class="two-col">
      <div class="field-group">
        <label class="field-label">Especie <span class="req">*</span></label>
        <div
          class="select-wrapper"
          class:error={intentoEnvio && errores.especie}
        >
          <select class="select-native" bind:value={especieSeleccionada}>
            <option value={null} disabled>Seleccionar</option>
            {#each especies as esp}
              <option value={esp}>{esp.species_name}</option>
            {/each}
          </select>
          <svg
            class="select-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#0D3B66"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {#if intentoEnvio && errores.especie}<span class="error-msg"
            >Obligatorio</span
          >{/if}
      </div>
      <div class="field-group">
        <label class="field-label">Raza <span class="req">*</span></label>
        <div class="select-wrapper" class:error={intentoEnvio && errores.raza}>
          <select
            class="select-native"
            bind:value={razaSeleccionada}
            disabled={!especieSeleccionada || razasDisponibles.length === 0}
          >
            <option value={null} disabled>Seleccionar</option>
            {#each razasDisponibles as raza}
              <option value={raza}>{raza.breed_name}</option>
            {/each}
          </select>
          <svg
            class="select-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#0D3B66"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {#if intentoEnvio && errores.raza}<span class="error-msg"
            >Obligatorio</span
          >{/if}
      </div>
    </div>

    <!-- Tamaño + ¿Tiene cola? -->
    <div class="two-col">
      <div class="field-group">
        <label class="field-label">Tamaño <span class="req">*</span></label>
        <div
          class="select-wrapper"
          class:error={intentoEnvio && errores.tamano}
        >
          <select class="select-native" bind:value={tamano}>
            <option value="" disabled>Seleccionar</option>
            <option>Pequeño</option>
            <option>Mediano</option>
            <option>Grande</option>
          </select>
          <svg
            class="select-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#0D3B66"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {#if intentoEnvio && errores.tamano}<span class="error-msg"
            >Obligatorio</span
          >{/if}
      </div>
      <div class="field-group">
        <label class="field-label"
          >¿Tiene cola? <span class="req">*</span></label
        >
        <div
          class="select-wrapper"
          class:error={intentoEnvio && errores.tieneCola}
        >
          <select class="select-native" bind:value={tieneCola}>
            <option value="" disabled>Seleccionar</option>
            <option>Sí</option>
            <option>No</option>
          </select>
          <svg
            class="select-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#0D3B66"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {#if intentoEnvio && errores.tieneCola}<span class="error-msg"
            >Obligatorio</span
          >{/if}
      </div>
    </div>

    <!-- Color Principal -->
    <div class="field-group">
      <label class="field-label"
        >Color Principal <span class="req">*</span></label
      >
      <div class="color-dropdown-wrapper">
        <button
          type="button"
          class="color-trigger"
          class:error={intentoEnvio && errores.color}
          on:click={() => (dropdownColorAbierto = !dropdownColorAbierto)}
        >
          {#if colorSeleccionado}
            {#if colorSeleccionado.color_name === "Tricolor"}
              <span
                class="color-dot"
                style="background: linear-gradient(135deg, #1a1a1a 33%, #d4a96a 33% 66%, #f5f5f5 66%);"
              ></span>
            {:else}
              <span
                class="color-dot"
                style="background: {colorSeleccionado.hex_code};"
              ></span>
            {/if}
            <span class="color-trigger-label"
              >{colorSeleccionado.color_name}</span
            >
          {:else}
            <span class="color-dot color-dot-empty"></span>
            <span class="color-trigger-placeholder">Seleccionar</span>
          {/if}
          <svg
            class="select-arrow-inline"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style="transform: rotate({dropdownColorAbierto
              ? '180deg'
              : '0deg'}); transition: transform 0.2s;"
          >
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#0D3B66"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {#if dropdownColorAbierto}
          <div class="color-dropdown">
            {#each opcionesColor as opcion}
              <button
                type="button"
                class="color-dropdown-item"
                class:selected={colorSeleccionado?.color_id === opcion.color_id}
                on:click={() => seleccionarColor(opcion)}
              >
                <span
                  class="color-dot"
                  style="background: {opcion.color_name === 'Tricolor'
                    ? 'linear-gradient(135deg,#1a1a1a 33%,#d4a96a 33% 66%,#f5f5f5 66%)'
                    : opcion.hex_code};"
                >
                </span>
                <span class="color-dropdown-label">{opcion.color_name}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
      {#if intentoEnvio && errores.color}<span class="error-msg"
          >Selecciona un color</span
        >{/if}
    </div>

    <!-- Sexo -->
    <div class="field-group">
      <label class="field-label">Sexo <span class="req">*</span></label>
      <div class="select-wrapper" class:error={intentoEnvio && errores.sexo}>
        <select class="select-native" bind:value={sexo}>
          <option value="" disabled>Seleccionar</option>
          <option>Macho</option>
          <option>Hembra</option>
        </select>
        <svg
          class="select-arrow"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7.2 9.6L12 14.4L16.8 9.6"
            stroke="#0D3B66"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      {#if intentoEnvio && errores.sexo}<span class="error-msg"
          >Campo obligatorio</span
        >{/if}
    </div>

    <!-- Discapacidades — checkboxes sin :has() -->
    <!-- ANTES era: -->
    <!-- <textarea class="textarea-field" placeholder="Ej. Ciego de un ojo..."></textarea> -->

    <!-- DESPUÉS: -->
    <div class="field-group">
      <label class="field-label">
        Discapacidades <span class="req">*</span>
        {#if intentoEnvio && errores.discapacidades}
          <span class="error-msg inline">Selecciona al menos una</span>
        {/if}
      </label>
      <div
        class="checkbox-grid"
        class:error-box={intentoEnvio && errores.discapacidades}
      >
        {#each opcionesDiscapacidad as opcion}
          {@const checked = discapacidadesSeleccionadas.some(
            (d) => d.disability_id === opcion.disability_id,
          )}
          <button
            type="button"
            class="checkbox-item"
            class:checked
            on:click={() => toggleDiscapacidad(opcion)}
          >
            <span class="checkbox-box">
              {#if checked}
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              {/if}
            </span>
            <span class="checkbox-label">{opcion.disability_name}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Rasgos distintivos (opcional) -->
    <div class="field-group">
      <label class="field-label">Rasgos distintivos</label>
      <textarea
        class="textarea-field"
        placeholder="Ej. Tiene una mancha blanca en la pata derecha..."
        bind:value={rasgosDistintivos}
      ></textarea>
    </div>

    <!-- Fotografías -->
    <div class="section-heading">
      <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
        <path
          d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM10 16.5C11.25 16.5 12.3125 16.0625 13.1875 15.1875C14.0625 14.3125 14.5 13.25 14.5 12C14.5 10.75 14.0625 9.6875 13.1875 8.8125C12.3125 7.9375 11.25 7.5 10 7.5C8.75 7.5 7.6875 7.9375 6.8125 8.8125C5.9375 9.6875 5.5 10.75 5.5 12C5.5 13.25 5.9375 14.3125 6.8125 15.1875C7.6875 16.0625 8.75 16.5 10 16.5Z"
          fill="#F4D35E"
        />
      </svg>
      <span>Fotografías</span>
    </div>

    <div class="photos-area">
      <div class="photo-thumbs">
        <div class="photo-thumb"></div>
        <div class="photo-thumb"></div>
      </div>
      <div class="photo-upload">
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path
            d="M3 27C2.175 27 1.46875 26.7062 0.88125 26.1187C0.29375 25.5312 0 24.825 0 24V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H24C24.825 0 25.5312 0.29375 26.1187 0.88125C26.7062 1.46875 27 2.175 27 3V24C27 24.825 26.7062 25.5312 26.1187 26.1187C25.5312 26.7062 24.825 27 24 27H3ZM3 24H24V3H3V24ZM4.5 21H22.5L16.875 13.5L12.375 19.5L9 15L4.5 21Z"
            fill="#F4D35E"
          />
        </svg>
        <span class="upload-label">Image Placeholder - Subir fotos aquí</span>
      </div>
    </div>

    <!-- Ubicación y Fecha -->
    <div class="section-heading">
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path
          d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z"
          fill="#F4D35E"
        />
      </svg>
      <span>Ubicación y Fecha</span>
    </div>

    <div class="field-group">
      <label class="field-label"
        >Dirección donde se perdió <span class="req">*</span></label
      >
      <div class="input-row" class:error={intentoEnvio && errores.direccion}>
        <!-- Lupa PRIMERO, luego el input -->
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style="flex-shrink:0"
        >
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke="#9C9C49"
            stroke-width="2"
          />
          <path
            d="M15.5 15.5L20 20"
            stroke="#9C9C49"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input
          class="input-inner"
          type="text"
          placeholder="Buscar dirección o punto de referencia"
          bind:value={direccion}
        />
      </div>
      {#if intentoEnvio && errores.direccion}<span class="error-msg"
          >Campo obligatorio</span
        >{/if}
    </div>

    <!-- Fecha + Hora -->
    <div class="two-col">
      <div class="field-group">
        <label class="field-label">Fecha <span class="req">*</span></label>
        <input
          class="input-field"
          class:error={intentoEnvio && errores.fecha}
          type="date"
          bind:value={fecha}
        />
        {#if intentoEnvio && errores.fecha}
          <span class="error-msg">Obligatorio</span>
        {/if}
      </div>
      <div class="field-group">
        <label class="field-label">Hora Aprox.</label>
        <input class="input-field" type="time" bind:value={hora} />
      </div>
    </div>

    <!-- Contacto -->
    <div class="section-heading">
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
        <path
          d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H22C22.55 0 23.0208 0.195833 23.4125 0.5875C23.8042 0.979167 24 1.45 24 2V16C24 16.55 23.8042 17.0208 23.4125 17.4125C23.0208 17.8042 22.55 18 22 18H2ZM15.9 16H22V2H2V16H2.1C2.8 14.75 3.76667 13.7708 5 13.0625C6.23333 12.3542 7.56667 12 9 12C10.4333 12 11.7667 12.3542 13 13.0625C14.2333 13.7708 15.2 14.75 15.9 16ZM9 11C9.83333 11 10.5417 10.7083 11.125 10.125C11.7083 9.54167 12 8.83333 12 8C12 7.16667 11.7083 6.45833 11.125 5.875C10.5417 5.29167 9.83333 5 9 5C8.16667 5 7.45833 5.29167 6.875 5.875C6.29167 6.45833 6 7.16667 6 8C6 8.83333 6.29167 9.54167 6.875 10.125C7.45833 10.7083 8.16667 11 9 11Z"
          fill="#F4D35E"
        />
      </svg>
      <span>Contacto</span>
    </div>

    <div class="field-group">
      <label class="field-label">Tu nombre <span class="req">*</span></label>
      <input
        class="input-field"
        class:error={intentoEnvio && errores.tuNombre}
        type="text"
        placeholder="Juan Pérez"
        bind:value={tuNombre}
      />
      {#if intentoEnvio && errores.tuNombre}<span class="error-msg"
          >Campo obligatorio</span
        >{/if}
    </div>

    <div class="two-col">
      <div class="field-group">
        <label class="field-label">Teléfono (opcional)</label>
        <input
          class="input-field"
          type="tel"
          placeholder="55 1234 5678"
          bind:value={telefono}
        />
      </div>
      <div class="field-group">
        <label class="field-label">Email <span class="req">*</span></label>
        <input
          class="input-field"
          class:error={intentoEnvio && errores.email}
          type="email"
          placeholder="juan@email.com"
          bind:value={email}
        />
        {#if intentoEnvio && errores.email}<span class="error-msg"
            >Obligatorio</span
          >{/if}
      </div>
    </div>
  </div>
  <!-- fin form-body -->

  <!-- Botón Publicar -->
  <div class="publish-footer">
    <button class="publish-btn" type="button" on:click={handlePublicar}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M5.83333 13.3333V6.54167L3.66667 8.70833L2.5 7.5L6.66667 3.33333L10.8333 7.5L9.66667 8.70833L7.5 6.54167V13.3333H5.83333ZM0 4.16667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H11.6667C12.125 0 12.5174 0.163194 12.8438 0.489583C13.1701 0.815972 13.3333 1.20833 13.3333 1.66667V4.16667H11.6667V1.66667H1.66667V4.16667H0Z"
          fill="black"
        />
      </svg>
      Publicar ahora
    </button>
  </div>
</div>

<style>
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

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 12px 20px;
    background: white;
    border-bottom: 1px solid #f3f4f6;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .page-title {
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #0d3b66;
    margin: 0;
  }
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-body {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Tipo */
  .tipo-btns {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .tipo-btn {
    flex: 1;
    border: 1.5px solid #e5e7eb;
    border-radius: 20px;
    padding: 12px 10px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #0d3b66;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  .tipo-btn.active {
    background: #f4d35e;
    border-color: #f4d35e;
    font-weight: 700;
  }

  /* Labels y grupos */
  .field-label {
    display: block;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #0d3b66;
    margin-bottom: 6px;
  }
  .req {
    color: #c0392b;
    margin-left: 2px;
  }
  .field-group {
    display: flex;
    flex-direction: column;
  }

  /* Mensajes de error */
  .error-msg {
    font-family: "Poppins", sans-serif;
    font-size: 11px;
    color: #c0392b;
    margin-top: 4px;
    display: block;
  }
  .error-msg.inline {
    display: inline;
    margin-left: 6px;
    font-weight: 600;
  }

  .input-field {
    width: 100%;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 12px 14px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #1c1c0d;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-field:focus {
    border-color: #0d3b66;
  }
  .input-field::placeholder {
    color: rgba(156, 156, 73, 0.7);
  }
  .input-field.error {
    border-color: #c0392b;
    background: #fff8f8;
  }

  /* Input row con ícono */
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 10px 14px;
    transition: border-color 0.2s;
  }
  .input-row:focus-within {
    border-color: #0d3b66;
  }
  .input-row.error {
    border-color: #c0392b;
    background: #fff8f8;
  }
  .input-inner {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #1c1c0d;
    min-width: 0;
  }
  .input-inner::placeholder {
    color: rgba(156, 156, 73, 0.7);
  }

  /* Select */
  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  .select-wrapper.error .select-native {
    border-color: #c0392b;
    background: #fff8f8;
  }
  .select-native {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 12px 40px 12px 14px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #0d3b66;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .select-native:focus {
    border-color: #0d3b66;
  }
  .select-native:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .select-arrow {
    position: absolute;
    right: 10px;
    pointer-events: none;
  }

  /* Checkboxes como botones (sin :has()) */
  .checkbox-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .error-box {
    outline: 1.5px solid #c0392b;
    border-radius: 10px;
    padding: 6px;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 10px 12px;
    transition:
      border-color 0.2s,
      background 0.2s;
    text-align: left;
    font-family: "Poppins", sans-serif;
  }
  .checkbox-item.checked {
    border-color: #0d3b66;
    background: #eef2ff;
  }
  .checkbox-box {
    width: 18px;
    height: 18px;
    min-width: 18px;
    border-radius: 4px;
    border: 2px solid #e8e8ce;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.2s,
      border-color 0.2s;
  }
  .checkbox-item.checked .checkbox-box {
    background: #0d3b66;
    border-color: #0d3b66;
  }
  .checkbox-label {
    font-size: 12px;
    color: #0d3b66;
    font-weight: 500;
    line-height: 1.3;
  }

  .textarea-field {
    width: 100%;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 12px 14px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #1c1c0d;
    resize: none;
    min-height: 80px;
    outline: none;
  }
  .textarea-field::placeholder {
    color: rgba(13, 59, 102, 0.5);
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 0 6px 0;
    border-top: 1px solid #e8e8ce;
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #1c1c0d;
    margin-top: 4px;
  }

  .photos-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .photo-thumbs {
    display: flex;
    gap: 10px;
  }
  .photo-thumb {
    width: 72px;
    height: 72px;
    background: #f4f0c8;
    border-radius: 10px;
  }
  .photo-upload {
    border: 1.5px dashed #e8e8ce;
    border-radius: 12px;
    background: #faf9f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    cursor: pointer;
  }
  .upload-label {
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    color: #f4d35e;
    font-weight: 500;
  }

  .publish-footer {
    background: white;
    padding: 16px 20px;
    box-shadow: 0px -4px 6px rgba(0, 0, 0, 0.05);
  }

  .publish-btn {
    width: 100%;
    background: #f4d35e;
    border: none;
    border-radius: 14px;
    padding: 16px;
    font-family: "Poppins", sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .publish-btn:hover {
    background: #e6c84e;
  }
  .publish-btn:active {
    background: #d4b03a;
    transform: scale(0.98);
  }

  .color-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
  }

  /* Dropdown de color */
  .color-dropdown-wrapper {
    position: relative;
  }
  .color-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #faf9f0;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    transition: border-color 0.2s;
    text-align: left;
  }
  .color-trigger:focus,
  .color-trigger:hover {
    border-color: #0d3b66;
  }
  .color-trigger.error {
    border-color: #c0392b;
    background: #fff8f8;
  }
  .color-trigger-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #0d3b66;
  }
  .color-trigger-placeholder {
    flex: 1;
    font-size: 14px;
    color: rgba(13, 59, 102, 0.4);
  }
  .select-arrow-inline {
    flex-shrink: 0;
    pointer-events: none;
  }
  .color-dot {
    width: 22px;
    height: 22px;
    min-width: 22px;
    border-radius: 50%;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  .color-dot-empty {
    background: #e8e8ce;
    border-style: dashed;
  }
  .color-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: white;
    border: 1.5px solid #e8e8ce;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 220px;
    overflow-y: auto;
    padding: 4px;
  }
  .color-dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    transition: background 0.15s;
    text-align: left;
  }
  .color-dropdown-item:hover {
    background: #f3f4f6;
  }
  .color-dropdown-item.selected {
    background: #eef2ff;
  }
  .color-dropdown-label {
    font-size: 13px;
    font-weight: 500;
    color: #0d3b66;
  }
</style>
