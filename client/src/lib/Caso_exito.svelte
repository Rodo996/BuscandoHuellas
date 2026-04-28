<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();


  let casosExito = [];
  let cargando = true;
  let errorMsg = "";

  
  // Función para obtener los datos del backend
  const cargarCasos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/casos-exito');
      if (res.ok) {
        casosExito = await res.json();
      } else {
        errorMsg = "No se pudieron cargar los casos de éxito.";
      }
    } catch (e) {
      errorMsg = "Error de conexión con el servidor.";
    } finally {
      cargando = false;
    }
  };

  // Se ejecuta automáticamente al abrir la vista
  onMount(cargarCasos);
</script>

<div class="casos-container">
  <header class="header">
    <button class="back-btn" on:click={() => dispatch('volver')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Casos de éxito</h1>
  </header>

  <main class="casos-list">
    {#if cargando}
      <p class="status-msg">Cargando historias...</p>
    {:else if errorMsg}
      <p class="status-msg error">{errorMsg}</p>
    {:else if casosExito.length === 0}
      <p class="status-msg">Aún no hay historias para mostrar.</p>
    {:else}
      {#each casosExito as caso}
        <article class="caso-card">
          <div class="img-container">
            <img src={caso.image_url} alt={caso.name} class="main-image" />
          </div>
          <div class="caso-info">
            <h2>{caso.name}</h2>
          </div>
        </article>
      {/each}
    {/if}
  </main>
</div>

<style>
  .casos-container {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background-color: #F3F4F6; /* Fondo gris claro general */
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    position: relative;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #FFFEFC;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back-btn {
    background: none;
    border: none;
    padding: 8px;
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1F2937;
  }

  .header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1F2937;
  }

  .casos-list {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    padding-bottom: 32px;
  }

  .caso-card {
    background: #FFFEFC;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
  }

  .img-container {
    width: 100%;
    height: 220px;
    overflow: hidden;
  }

  .img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .caso-info {
    padding: 16px;
  }

  .caso-info h2 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 700;
    color: #1F2937;
  }

  .caso-info p {
    margin: 0;
    font-size: 14px;
    color: #4B5563;
    line-height: 1.5;
  }
  .status-msg {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }
  .error {
    color: #ef4444;
  }
</style>