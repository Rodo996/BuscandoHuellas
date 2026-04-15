<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Esta variable recibe los datos desde App.svelte
  export let mascota; 
</script>

<div class="app-container">
  <header class="header-simple">
      <button class="back-btn" on:click={() => dispatch('volver')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#0D3B66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
  </header>

  <div class="content-wrapper">
      <div class="image-container">
          <img src={mascota.img} alt={mascota.raza} class="main-image" />
          <div class="badge-extraviado">{mascota.estado}</div>
      </div>

      <div class="top-grid">
          <div class="col-left">
              <div class="info-card">
                  <span class="label">Raza</span>
                  <span class="value">{mascota.raza}</span>
              </div>
              <div class="info-card">
                  <span class="label">Tamaño</span>
                  <span class="value">{mascota.tamano}</span>
              </div>
              <div class="info-card">
                  <span class="label">Color</span>
                  <span class="value">{mascota.color}</span>
              </div>
          </div>
          <div class="col-right">
              <div class="info-card tall">
                  <span class="label">Sexo</span>
                  <span class="symbol">
                      {#if mascota.sexo === 'Macho'} ♂ {:else} ♀ {/if}
                  </span>
              </div>
              <div class="info-card tall">
                  <span class="label">Especie</span>
                  <span class="value">{mascota.especie}</span>
              </div>
          </div>
      </div>

      <div class="triple-grid">
          <div class="info-card center-text">
              <span class="label">Cruza</span>
              <span class="value">{mascota.cruza}</span>
          </div>
          <div class="info-card center-text">
              <span class="label">Discapacidades</span>
              <span class="value">{mascota.discapacidades}</span>
          </div>
          <div class="info-card center-text">
              <span class="label">¿Tiene cola?</span>
              <span class="value">{mascota.cola}</span>
          </div>
      </div>

      <div class="double-grid">
          <div class="info-card">
              <span class="label">Última vez visto en</span>
              <span class="value">{mascota.ubicacion}</span>
          </div>
          <div class="info-card yellow-card flex-row">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0D3B66" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>Rasgos característicos</span>
              <span>></span>
          </div>
      </div>

      <div class="contact-section">
          <div class="owner-info">
              <h4>{mascota.dueno}</h4>
              <p>Dueño • {mascota.duenoTiempo}</p>
          </div>
          <button class="contact-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Contactar >
          </button>
      </div>
  </div>

  <nav class="bottom-nav">
      </nav>
</div>

<style>
  .app-container { width: 100%; max-width: 400px; background-color: #FFFFFF; min-height: 100vh; position: relative; padding-bottom: 90px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); margin: 0 auto;}
  .header-simple { padding: 16px; display: flex; align-items: center; }
  .back-btn { background: transparent; border: none; cursor: pointer; padding: 8px; }
  .content-wrapper { padding: 0 16px; display: flex; flex-direction: column; gap: 16px; }
  
  /* Imagen */
  .image-container { position: relative; width: 100%; display: flex; flex-direction: column; align-items: flex-end;}
  .main-image { width: 100%; height: 250px; object-fit: cover; border-radius: 16px; }
  .badge-extraviado { background-color: #9CA3AF; color: white; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-family: 'Poppins', sans-serif; font-size: 14px; margin-top: -15px; margin-right: 10px; z-index: 2; position: relative;}
  
  /* Tarjetas Generales */
  .info-card { background-color: #FAF0CA; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: center;}
  .label { color: #6B7280; font-size: 12px; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif;}
  .value { color: #0D3B66; font-weight: 700; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;}
  
  /* Grillas */
  .top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .col-left { display: flex; flex-direction: column; gap: 12px; }
  .col-right { display: flex; flex-direction: column; gap: 12px; }
  .tall { flex: 1; align-items: center; text-align: center;}
  .symbol { font-size: 48px; color: #0D3B66; line-height: 1; margin-top: 8px;}
  
  .triple-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .center-text { text-align: center; align-items: center;}
  
  .double-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .yellow-card { background-color: #F4D35E; }
  .flex-row { flex-direction: row; align-items: center; justify-content: space-between; font-weight: 600; font-size: 12px; color: #111827;}
  
  /* Contacto */
  .contact-section { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-bottom: 20px;}
  .owner-info h4 { margin: 0; color: #0D3B66; font-size: 16px; font-family: 'Poppins', sans-serif; font-weight: 700;}
  .owner-info p { margin: 0; color: #6B7280; font-size: 12px;}
  .contact-btn { background-color: #F4D35E; border: none; padding: 12px 20px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; cursor: pointer;}
  
  /* Bottom Nav genérico para mantener el diseño */
  .bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 400px; background: #FFFEFC; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px 0; z-index: 100; left: 50%; transform: translateX(-50%);}
</style>