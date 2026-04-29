<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Arreglo para almacenar los casos de éxito traídos de la base de datos
  let casos = [];
  let cargando = true;
  let errorMsg = "";

  // Función para obtener los datos del backend
  const cargarCasos = async () => {
    try {
      // Ajusta la URL según la configuración de tu servidor
      const res = await fetch('http://localhost:3000/api/casos-exito');
      if (res.ok) {
        casos = await res.json();
      } else {
        errorMsg = "No se pudieron cargar las historias de éxito.";
      }
    } catch (e) {
      errorMsg = "Error de conexión con el servidor.";
      console.error(e);
    } finally {
      cargando = false;
    }
  };

  onMount(cargarCasos);
</script>
<div class="top-brand-header">
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Tejado -->
      <polyline
        points="2,17 18,4 34,17"
        stroke="#F4D35E"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- Paredes -->
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
      <!-- Huella: 4 dedos (ovalados, inclinados) -->
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
      <!-- Almohadilla central (ovalada horizontal) -->
      <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
    </svg>
    <span class="text-white">Buscando</span><span class="text-yellow"
      >Huellas</span
    >
  </div>
<div class="casos-page">
  <header class="header">
    <div class="spacer"></div>
    
    <h1 class="title">Casos de Éxito</h1>
    
    <button class="close-btn" on:click={() => dispatch('volver')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </header>

  <main class="content">
    {#if cargando}
      <p class="status-msg">Cargando historias...</p>
    {:else if errorMsg}
      <p class="status-msg error">{errorMsg}</p>
    {:else if casos.length === 0}
      <p class="status-msg">Aún no hay historias para mostrar.</p>
    {:else}
      <div class="pet-grid">
        {#each casos as caso}
          <div class="pet-card">
          <div class="pet-card" on:click={() => dispatch('verHistoria', caso)} style="cursor: pointer;">
            <div class="img-container">
              {#if caso.image_url}
                <img src={caso.image_url} alt="Foto de {caso.name}" />
              {:else}
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Mascota feliz" />
              {/if}
            </div>
            <div class="pet-info">
              <h2 class="pet-name">{caso.name}</h2>
              <div class="home-label">
                <div class="label-avatar">
                   <img src={caso.image_url} alt="Miniavtara de {caso.name}" />
                </div>
                <span>En casa</span>
              </div>
            </div>
          </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
  
  </div>

<style>
  /* Header */
  .top-brand-header {
    background: #0d3b66;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
    font-size: 22px;
    font-weight: 700;
  }
  .text-white {
    color: #ffffff;
  }
  .text-yellow {
    color: #f4d35e;
  }
  .text-dark {
    color: #111827;
  }
  /* Estilos globales de la página (Fondo gris claro) */
  .casos-page {
    width: 100%;
    max-width: 400px; /* Ancho móvil estándar */
    margin: 0 auto;
    background-color: #F9FAFB; /* Fondo gris claro como en la imagen */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Poppins', sans-serif;
    position: relative;
  }

  /* Cabecera centrada y limpia */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: #0D3B66;
    margin: 0; 
  }

  .title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0D3B66; /* Color azul oscuro como en tu imagen */
    text-align: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  /* Este espaciador tiene el mismo ancho que el botón para mantener el centro matemático exacto */
  .spacer {
    width: 32px; 
  }
  /* Contenedor principal con padding para el NavBar */
  .content {
    padding: 20px;
    padding-bottom: 90px; /* Espacio para que el contenido no quede detrás del NavBar global */
    overflow-y: auto;
  }

  /* Mensajes de estado (Cargando, Error, Vacío) */
  .status-msg {
    text-align: center;
    padding: 30px;
    color: #6B7280;
    font-weight: 500;
  }
  .error {
    color: #EF4444;
  }

  /* Cuadrícula de mascotas (Grid de 2 columnas) */
  .pet-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columnas iguales */
    gap: 16px; /* Espacio entre tarjetas */
  }

  /* Tarjeta de mascota individual */
  .pet-card {
    background-color: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
  }

  .pet-card:hover {
    transform: translateY(-2px); /* Pequeño efecto visual al pasar el ratón */
  }

  /* Contenedor de la imagen (mantiene proporción 1:1) */
  .img-container {
    width: 100%;
    aspect-ratio: 1; /* Imagen cuadrada */
    overflow: hidden;
  }

  .img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Recorta la imagen para llenar el contenedor */
  }

  /* Información de la mascota dentro de la tarjeta */
  .pet-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pet-name {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Corta el nombre si es muy largo */
  }

  /* Sello "En casa" con el mini-avatar */
  .home-label {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #F3F4F6;
    border-radius: 10px;
    padding: 4px 8px;
    width: fit-content; /* Se ajusta al contenido */
    border: 1px solid #E5E7EB;
  }

  .label-avatar {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #E5E7EB;
  }

  .label-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .home-label span {
    font-size: 12px;
    font-weight: 500;
    color: #4B5563;
  }
</style>