<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    // Recibimos los datos del caso seleccionado
    export let caso;

    // Función para formatear la fecha que viene de MySQL
    const formatearFecha = (fechaString) => {
        if (!fechaString) return "Fecha desconocida";
        
        // Pasamos el objeto directamente como segundo parámetro
        return new Date(fechaString).toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
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
    <header class="header-simple">
        <button class="back-btn" on:click={() => dispatch("volver")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#0D3B66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <h1 class="title">Historia de Éxito</h1>
        <div style="width: 40px;"></div> </header>

    <div class="content-wrapper">
        <div class="image-container">
            {#if caso.image_url}
                <img src={caso.image_url} alt={caso.name} class="main-image" />
            {:else}
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Mascota feliz" class="main-image" />
            {/if}
            <div class="badge-recuperado">¡Recuperado!</div>
        </div>

        <div class="celebration-card">
            <h2>¡{caso.name} ya está en casa!</h2>
            <p class="date-text">Se reunió con su familia el <strong>{formatearFecha(caso.fecha_recuperacion)}</strong>.</p>
        </div>
        <div class="image-section">
        <img 
            src={caso.evidencia_url || caso.image_url} 
            alt="Final feliz" 
            class="main-image" 
        />
        <div class="badge-recuperado">¡RECUPERADO!</div>
    </div>
        <div class="info-card">
            <span class="label">Detalles del reencuentro</span>
            <span class="value">
                {#if caso.story}
                    {caso.story}
                {:else}
                    El dueño no proporcionó detalles adicionales sobre este reencuentro.
                {/if}   
            </span>
        </div>
    </div>
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

    .app-container {
        width: 100%;
        max-width: 400px;
        background-color: #F9FAFB;
        min-height: 100vh;
        position: relative;
        margin: 0 auto;
        font-family: 'Poppins', sans-serif;
    }

    .header-simple {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #FFFFFF;
        border-bottom: 1px solid #E5E7EB;
    }

    .title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #0D3B66;
    }

    .back-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 8px;
    }

    .content-wrapper {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .image-container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .main-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .badge-recuperado {
        background-color: #15803D; /* Verde éxito */
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 15px;
        margin-top: -20px; /* Para que se superponga a la imagen */
        z-index: 2;
        position: relative;
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        border: 3px solid #FFFFFF;
    }

    .celebration-card {
        background-color: #FEFCE8; /* Amarillo muy claro */
        border: 1px solid #FEF08A;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
    }

    .celebration-card h2 {
        margin: 0 0 8px 0;
        color: #0D3B66;
        font-size: 20px;
        font-weight: 800;
    }

    .date-text {
        margin: 0;
        color: #0D3B66;
        font-size: 14px;
    }

    .info-card {
        background-color: #FFFFFF;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .label {
        color: #0D3B66;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
    }

    .value {
        color: #0D3B66;
        font-size: 14px;
        line-height: 1.6;
    }
</style>