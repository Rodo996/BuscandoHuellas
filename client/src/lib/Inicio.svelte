<script>
  import { createEventDispatcher, onMount } from "svelte";
  import NavBar from "./Navbar.svelte";
  const dispatch = createEventDispatcher();

  // Arreglo para guardar los 2 casos más recientes
  let casosDestacados = [];

  let casoJuan = { name: 'Juan' };

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/casos-exito');
      if (res.ok) {
        const data = await res.json();
        // Tomamos solo los primeros 2 elementos del arreglo (.slice(0, 2))
        casosDestacados = data.slice(0, 2);
      }
    } catch (e) {
      console.error("Error al cargar los casos de éxito en inicio:", e);
    }
  });
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

  <div class="hero-section">
    <div class="hero-content">
      <h2>Encuentra a tu mejor amigo</h2>
      <div class="search-container" on:click={() => dispatch("irABuscar")}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle><line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
          ></line>
        </svg>
        <span class="search-placeholder">Buscar...</span>
      </div>
    </div>
  </div>

  <div class="report-section">
    <div class="report-card">
      <img
        src="/Img-Inicio/GatoRec5Figma.png"
        alt="Gato perdido"
        class="report-img"
      />
      <div class="report-info">
        <h3>¿Puedes ayudar a alguien perdido?</h3>
        <button class="report-btn" on:click={() => dispatch('irAPublicar')}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0D3B66"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <!-- Cuerpo del megáfono -->
            <path
              d="M3 11V13C3 14.1 3.9 15 5 15H7L13 19V5L7 9H5C3.9 9 3 9.9 3 11Z"
            />
            <!-- Ondas de sonido -->
            <path
              d="M16 9C16.83 9.97 17.33 11.24 17.33 12.5C17.33 13.76 16.83 15.03 16 16"
            />
            <path
              d="M19 7C20.5 8.64 21.33 10.54 21.33 12.5C21.33 14.46 20.5 16.36 19 18"
            />
          </svg>
          Reportar
        </button>
      </div>
    </div>
  </div>

<div class="success-section">
    <div class="success-header">
      <h2>Casos de éxito</h2>
      <button class="btn-ver-todos" on:click={() => dispatch('verCasosExito')}>
        Ver todos
      </button>   
    </div>
    
    <div class="success-grid">
      {#if casosDestacados.length > 0}
        {#each casosDestacados as caso}
          <div class="success-card">
            {#if caso.image_url}
              <img src={caso.image_url} alt={caso.name} />
            {:else}
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Mascota feliz" />
            {/if}
            
            <div class="success-content">
              <h4>{caso.name}</h4>
              <span class="tag-encontrado">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#15803D"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="7 12 10.5 15.5 17 9" />
                </svg>
                ¡Encontrado!
              </span>
              <button class="btn-historia" on:click={() => dispatch('verHistoria', caso)}>
                Ver historia
              </button>        
            </div>
          </div>
        {/each}
      {:else}
        <p style="grid-column: span 2; text-align: center; color: #9CA3AF; font-size: 14px; padding: 10px;">
          Cargando casos de éxito...
        </p>
      {/if}
    </div>
  </div>

  <footer class="footer">
    <div class="footer-brand">
      <span class="text-dark">Buscando</span><span class="text-yellow"
        >Huellas</span
      >
    </div>
    <p class="footer-desc">Ayudando a reunir familias peludas mexicanas.</p>

    <div class="footer-links">
      <div class="link-column">
        <h5>Comunidad</h5>
        <a href="#">Voluntariado</a>
        <a href="#">Blog</a>
        <a href="#">Historias</a>
      </div>
      <div class="link-column">
        <h5>Legal</h5>
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <a href="#">Contacto</a>
      </div>
    </div>

    <div class="social-icons">
      <div class="icon-circle blue">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path
            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          ></path></svg
        >
      </div>
      <div class="icon-circle pink">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path
            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
          ></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg
        >
      </div>
    </div>
    <p class="copyright">
      © 2026 Buscando Huellas. Todos los derechos reservados.
    </p>
  </footer>

  <NavBar
    vistaActiva="inicio"
    on:irABuscar={() => dispatch("irABuscar")}
    on:irAPublicar={() => dispatch("irAPublicar")}
  />
</div>

<style>
.btn-ver-todos {
    background: transparent;
    border: none;
    color: #F4D35E; /* Tu color amarillo exacto */
    font-family: "Poppins", sans-serif;
    font-size: 14px; /* Ajusta este valor si lo necesitas más grande o pequeño */
    font-weight: 600;
    
    /* Aquí está la magia del subrayado */
    text-decoration: underline;
    text-decoration-color: #F4D35E;
    text-decoration-thickness: 2px; /* Hace la línea un poco más gruesa */
    text-underline-offset: 4px; /* Separa la línea del texto para que se vea como en tu diseño */
    
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s ease;
  }

  .btn-ver-todos:hover {
    opacity: 0.8; /* Un pequeño efecto visual al pasar el ratón */
  }
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

  .hero-section {
    background-image: url("/Img-Inicio/perroInicio.jpg");
    background-size: cover;
    background-position: center;
    height: 260px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(13, 59, 102, 0.4);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 0 30px;
    text-align: center;
  }

  .hero-content h2 {
    color: #faf0ca;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    margin: 0 0 20px 0;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .search-container {
    background: white;
    border-radius: 50px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
    margin-top: 20px;
  }
  .search-placeholder {
    color: #9ca3af;
    font-size: 14px;
    font-weight: 500;
  }

  /* Report Card */
  .report-section {
    padding: 20px 20px 20px 20px;
    background: #f3f4f6;
  }
  .report-card {
    background: white;
    border-radius: 20px;
    display: flex;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
  .report-img {
    width: 130px;
    height: 130px;
    object-fit: cover;
  }
  .report-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }
  .report-info h3 {
    margin: 0;
    color: #0d3b66;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
  }
  .report-btn {
    background: #f4d35e;
    border: none;
    border-radius: 12px;
    padding: 8px 16px;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  /* Casos Éxito */
  .success-section {
    background: #fefce8;
    padding: 24px 20px;
  }
  .success-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .success-header h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
    font-weight: 700;
  }
  .view-all {
    font-size: 12px;
    color: #fbbf24;
    font-weight: 600;
    text-decoration: underline;
  }

  .success-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .success-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }
  .success-card img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
  .success-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .success-content h4 {
    margin: 0;
    font-size: 14px;
    color: #111827;
    font-weight: 700;
  }
  .tag-encontrado {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #dcfce7;
    color: #15803d;
    font-size: 10px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
  }
  .btn-historia {
    border: 1px solid #fbbf24;
    background: transparent;
    color: #fbbf24;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 10px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    cursor: pointer;
  }

  /* Footer */
  .footer {
    background: #f3f4f6;
    padding: 32px 24px;
    border-radius: 24px 24px 0 0;
  }
  .footer-brand {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .footer-desc {
    color: #6b7280;
    font-size: 13px;
    margin: 0 0 24px 0;
  }
  .footer-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-right: 40px;
  }
  .link-column {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .link-column h5 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
  }
  .link-column a {
    color: #6b7280;
    font-size: 13px;
    text-decoration: none;
  }
  .social-icons {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }
  .icon-circle {
    width: 36px;
    height: 36px;
    background: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  }
  .blue {
    color: #2563eb;
  }
  .pink {
    color: #db2777;
  }
  .copyright {
    color: #9ca3af;
    font-size: 11px;
    text-align: center;
    margin: 0;
  }

  @media (max-width: 400px) {
    .hero-content h2 {
      font-size: 24px;
    }

    .report-img {
      width: 110px;
      height: 110px;
    }

    .report-info h3 {
      font-size: 13px;
    }
  }
</style>
