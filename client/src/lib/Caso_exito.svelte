<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Datos de prueba: Sustitúyelos más adelante con la llamada a tu API o base de datos.
  let casosExito = [
    {
      id: 1,
      nombre: "Max",
      historia: "Gracias a la comunidad de Buscando Huellas, Max fue encontrado a 3 cuadras de su casa. Estaba un poco asustado pero ya está de vuelta con su familia.",
      imagen: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" 
    },
    {
      id: 2,
      nombre: "Luna",
      historia: "Una vecina la reconoció por la publicación. Luna había estado escondida en un jardín cercano durante la tormenta.",
      imagen: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      nombre: "Simba",
      historia: "Lo encontraron cerca del parque municipal. Alguien escaneó su plaquita y nos contactó inmediatamente.",
      imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" 
    }
  ];
</script>

<div class="casos-container">
  <header class="header">
    <button class="back-btn" on:click={() => dispatch('volver')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Casos de éxito</h1>
  </header>

  <main class="casos-list">
    {#each casosExito as caso}
      <article class="caso-card">
        <div class="img-container">
          <img src={caso.imagen} alt="Foto de {caso.nombre} ya en casa" />
        </div>
        <div class="caso-info">
          <h2>{caso.nombre}</h2>
          <p>{caso.historia}</p>
        </div>
      </article>
    {/each}
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
</style>