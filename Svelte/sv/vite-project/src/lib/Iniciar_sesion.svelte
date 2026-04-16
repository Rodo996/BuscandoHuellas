<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let email = '';
  let password = '';

  const volver = () => dispatch('volver');
  
  const login = () => {
    console.log('Login intentado con:', email, password);
    dispatch('loginExitoso');
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

    <form class="auth-form" on:submit|preventDefault={login}>
      
      <div class="field-container">
        <label for="email">Ingresa tu correo electrónico*</label>
        <div class="input-box">
          <input type="email" id="email" bind:value={email} placeholder="Ej. laura.garcia@gmail.com" required />
          <span class="icon-suffix">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="field-container">
        <label for="password">Ingresa tu contraseña*</label>
        <div class="input-box">
          <input type="password" id="password" bind:value={password} placeholder="Ej. ************" required />
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

  /* ESTILOS CLONADOS EXACTAMENTE DE BUSCAR.SVELTE */
  .top-brand-header {
    background-color: #0D3B66;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px 0; /* Padding estándar de Buscar.svelte */
    width: 100%;
  }

  .brand-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .brand-text {
    font-size: 24px;
    font-weight: 800; /* Extra Bold para el logo */
    letter-spacing: -0.5px;
  }

  .text-white { color: #FFFFFF; }
  .text-yellow { color: #F4D35E; }

  /* Ajustes de la cabecera de la sección */
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
    padding: 0 24px 32px 24px;
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
    background-color: #FDF7DF; /* Amarillo suave */
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
    background-color: #F4D35E; /* Amarillo fuerte */
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