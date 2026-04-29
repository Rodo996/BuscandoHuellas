<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // RECIBE EL MENSAJE SI INTENTAN ENTRAR A EDITAR SIN SESIÓN
  export let mensajeAlerta = ""; 

  let email = '';
  let password = '';

  // VARIABLE PARA MOSTRAR EL ERROR DEL BACKEND
  let mensajeError = '';

  const volver = () => dispatch('volver');

  // --- CÓDIGO BASURA COMENTADO ---
  /*
  const login = () => {
    console.log('Login intentado con:', email, password);
    dispatch('loginExitoso');
  };
  */

  // --- NUEVO CÓDIGO DE LOGIN ---
  const login = async () => {
    // Limpiamos mensajes pasados antes de un nuevo intento
    mensajeError = '';
    mensajeAlerta = ''; 

    try {
      const res = await fetch('http://localhost:3000/api/iniciar-sesion', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      // BLOQUEO: Si fue 401 (mala contraseña) o 403 (no verificado)
      if (!res.ok) {
        mensajeError = data.error || 'Error al iniciar sesión.'; 
        return; 
      }

      // Si fue exitoso (200), avisamos al App.svelte
      console.log('Login exitoso con:', email);
      dispatch('loginExitoso');

    } catch (error) {
      console.error("Error en la petición:", error);
      mensajeError = "No se pudo conectar con el servidor.";
    }
  };
</script>

<div class="mobile-container">
  
  <header class="top-brand-header">
    <div class="brand-wrapper">
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="2,17 18,4 34,17"
          stroke="#F4D35E"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
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
        <ellipse cx="12.5" cy="21" rx="1.3" ry="1.8" transform="rotate(-20 12.5 21)" fill="#F4D35E" />
        <ellipse cx="15.8" cy="19.5" rx="1.3" ry="1.8" transform="rotate(-6 15.8 19.5)" fill="#F4D35E" />
        <ellipse cx="19.2" cy="19.5" rx="1.3" ry="1.8" transform="rotate(6 19.2 19.5)" fill="#F4D35E" />
        <ellipse cx="22.5" cy="21" rx="1.3" ry="1.8" transform="rotate(20 22.5 21)" fill="#F4D35E" />
        <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
      </svg>
      <div class="brand-text">
        <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
      </div>
    </div>
  </header>

  <div class="section-header">
    <h1 class="page-title">Iniciar sesión</h1>
    <button class="close-btn" on:click={volver} aria-label="Cerrar">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <main class="main-content">
    
    <div class="hero-image">
      <img src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=600&auto=format&fit=crop" alt="Mascotas" />
    </div>

    {#if mensajeAlerta}
      <div style="color: #856404; background-color: #fff3cd; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 5px; border: 1px solid #ffeeba;">
        {mensajeAlerta}
      </div>
    {/if}

    {#if mensajeError}
      <div style="color: #721c24; background-color: #f8d7da; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 5px;">
        {mensajeError}
      </div>
    {/if}

    <form class="auth-form" on:submit|preventDefault={login}>
      
      <div class="field-container">
        <label for="email">Correo electrónico*</label>
        <div class="input-box">
          <input type="email" id="email" required bind:value={email} placeholder="Ej. laura.garcia@gmail.com" />
          <span class="icon-suffix">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="field-container">
        <label for="password">Contraseña*</label>
        <div class="input-box">
          <input type="password" id="password" required bind:value={password} placeholder="Ej. ************" />
          <span class="icon-suffix">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="helper-text">
        <p>¿Aún no tienes cuenta? <a href="/perfil/crear_cuenta">Regístrate</a></p>
      </div>

      <div class="action-container">
        <button type="submit" class="submit-button">Continuar</button>
      </div>

    </form>
  </main>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
  }

  .top-brand-header {
    background-color: #0D3B66;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px 0;
    width: 100%;
  }

  .brand-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .brand-text {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .text-white { color: #FFFFFF; }
  .text-yellow { color: #F4D35E; }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 24px 24px 10px 24px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
  }

  .close-btn {
    position: absolute;
    right: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .main-content {
    /* MANTENEMOS EL PADDING EXTRA DE 120PX PARA QUE EL BOTÓN NO SE OCULTE DETRÁS DEL NAVBAR */
    padding: 0 24px 120px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hero-image {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
  }

  .hero-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .field-container label {
    font-size: 14px;
    font-weight: 700;
    color: #0D3B66;
  }

  .input-box {
    position: relative;
    width: 100%;
  }

  .input-box input {
    width: 100%;
    height: 52px;
    padding: 0 44px;
    border: none;
    border-radius: 12px;
    background-color: #FDF7DF;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }

  .icon-suffix {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }

  .helper-text {
    text-align: center;
    margin: 4px 0;
  }

  .helper-text p {
    font-size: 14px;
    font-weight: 600;
    color: #0D3B66;
  }

  .helper-text a {
    color: #0D3B66;
    font-weight: 800;
    text-decoration: underline;
  }

  .submit-button {
    width: 100%;
    height: 56px;
    background-color: #F4D35E;
    color: #0D3B66;
    border: none;
    border-radius: 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .submit-button:active {
    transform: scale(0.98);
  }
</style>