<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const volver = () => dispatch('volver');

  // Variables de los inputs
  let email = '';
  let name = '';
  let password = '';
  
  // Variable para la alerta
  let mensajeAlerta = '';

  const registrar = async () => {
    mensajeAlerta = ''; // Limpiar alertas previas

    try {
      const res = await fetch('http://localhost:3000/api/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });

      if (res.ok) {
        // 1. Borramos los inputs visualmente
        email = '';
        name = '';
        password = '';
        
        // 2. Mostramos la alerta roja solicitada
        mensajeAlerta = 'Te hemos enviado un correo para verificar tu cuenta. Verifícalo para poder inicar sesión.';
      } else {
        const data = await res.json();
        alert(data.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };
</script>

<div class="full-width-container">
  <header class="top-brand-header">
    <div class="brand-wrapper">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
        <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
      </svg>
      <div class="brand-text">
        <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
      </div>
    </div>
  </header>

  <main class="contenedor-central">
    
    <div class="header-content-wrapper">
      <h2 class="page-title">Crear cuenta</h2>
      <button class="close-btn" on:click={volver} aria-label="Cerrar">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    {#if mensajeAlerta}
      <div class="alert-box">
        {mensajeAlerta}
      </div>
    {/if}

    <form class="form" on:submit|preventDefault={registrar}>
      
      <div class="input-group">
        <label for="nombre">Nombre de usuario*</label>
        <div class="input-wrapper">
          <input type="text" id="nombre" placeholder="Ej. Laura García" required bind:value={name} />
        </div>
      </div>

      <div class="input-group">
        <label for="correo">Correo electrónico*</label>
        <div class="input-wrapper">
          <input type="email" id="correo" placeholder="Ej. laura@gmail.com" required bind:value={email} />
        </div>
      </div>

      <div class="input-group">
        <label for="password">Contraseña*</label>
        <div class="input-wrapper">
          <input type="password" id="password" placeholder="Ej. ************" required bind:value={password} />
        </div>
      </div>

      <div class="image-box">
        <img src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=600&auto=format&fit=crop" alt="Mascotas" />
      </div>

      <button type="submit" class="btn-primary">Continuar</button>

      <div class="login-prompt-section">
        <p>¿Ya tienes una cuenta?</p>
        <button type="button" class="btn-primary" style="background-color: transparent; border: 2px solid #0D3B66; color: #0D3B66;" on:click={volver}>Inicia sesión</button>
      </div>
      <div class="navbar-spacer"></div>
    </form>
  </main>
</div>

<style>
  /* Todo con Poppins */
  * {
    font-family: 'Poppins', sans-serif !important;
  }

  .full-width-container {
    width: 100%;
    background-color: #FFFFFF;
  }

  .top-brand-header {
    background: #0D3B66;
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  
  .brand-wrapper { display: flex; align-items: center; gap: 12px; }
  .brand-text { font-size: 24px; font-weight: 800; }
  .text-white { color: #FFFFFF; }
  .text-yellow { color: #F4D35E; }

  .contenedor-central {
    max-width: 480px; /* Límite tipo app */
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .header-content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0D3B66;
    flex-grow: 1;
    text-align: center;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  /* ALERTA ROJA SOLICITADA */
  .alert-box {
    background-color: #f8d7da;
    color: #721c24;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
  }

  .form { display: flex; flex-direction: column; gap: 18px; }

  .input-group { display: flex; flex-direction: column; gap: 6px; align-items: center; }
  .input-group label { font-size: 14px; font-weight: 700; color: #0D3B66; }

  .input-wrapper { width: 100%; }
  .input-wrapper input {
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 12px;
    background-color: #FDF7DF;
    text-align: center;
    font-size: 14px;
  }

  .btn-primary {
    width: 100%;
    height: 56px;
    background-color: #F4D35E;
    color: #0D3B66;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
  }

  .btn-secondary {
    background: transparent;
    border: none;
    color: #0D3B66;
    font-weight: 800;
    text-decoration: underline;
    cursor: pointer;
    font-size: 15px;
  }

  .login-prompt-section {
    text-align: center;
    color: #0D3B66;
    font-weight: 700;
  }

  .image-box {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    margin: 10px 0;
  }
  .image-box img { width: 100%; display: block; }

  /* ESPACIO PARA EL NAVBAR */
  .navbar-spacer {
    height: 50px;
    width: 100%;
  }
</style>