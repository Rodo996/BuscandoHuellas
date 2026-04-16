<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const volver = () => dispatch('volver');
  const registrar = () => dispatch('registroExitoso');
</script>

<div class="mobile-container">
  <header class="top-brand-header">
    <svg
      width="36"
      height="36"
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
  </header>

  <main class="content">
    
    <div class="header-content-wrapper">
      <h2 class="page-title">Crear cuenta</h2>
      <button class="close-btn" on:click={volver} aria-label="Cerrar">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0D3B66" 
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <form class="form" on:submit|preventDefault={registrar}>
      
      <div class="input-group">
        <label for="nombre">Nombre de usuario*</label>
        <div class="input-wrapper">
          <input type="text" id="nombre" placeholder="Ej. Laura García" required />
          <span class="input-icon-right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="correo">Correo electrónico*</label>
        <div class="input-wrapper">
          <input type="email" id="correo" placeholder="Ej. a01849028@tec.mx" required />
          <span class="input-icon-right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="password">Contraseña*</label>
        <div class="input-wrapper">
          <input type="password" id="password" placeholder="Ej. ************" required />
          <span class="input-icon-right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="login-prompt-section">
        <p>¿Ya tienes una cuenta?</p>
        <button type="button" class="btn-primary" on:click={volver}>Inicia sesión</button>
      </div>

      <div class="image-box">
        <img src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=600&auto=format&fit=crop" alt="Gatitos" />
      </div>

      <button type="submit" class="btn-primary">Continuar</button>

    </form>
  </main>
</div>

<style>
  /* Única fuente: Poppins */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif; /* Poppins en toda la pestaña */
    overflow-x: hidden;
  }

  /* Banner Superior */
  .top-brand-header {
    background: #0D3B66;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
  }
  
  .brand-text {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .text-white { color: #FFFFFF; }
  .text-yellow { color: #F4D35E; }

  /* Cuerpo */
  .content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  /* Header de la sección */
  .header-content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
    flex-grow: 1;
    text-align: center;
    padding-left: 32px; /* Alineación visual compensando la X */
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: opacity 0.2s;
  }

  .close-btn:active {
    opacity: 0.6;
  }

  /* Formulario */
  .form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .input-group label {
    font-size: 14px;
    font-weight: 700;
    color: #0D3B66;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  /* Inputs con el amarillo tenue pedido */
  .input-wrapper input {
    width: 100%;
    height: 50px;
    padding: 0 44px;
    border: none;
    border-radius: 12px;
    background-color: #FDF7DF;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #1F2937;
    text-align: center;
    box-sizing: border-box;
  }

  .input-wrapper input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.1);
  }

  .input-icon-right {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }

  .login-prompt-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  .login-prompt-section p {
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
    font-size: 15px;
  }

  /* Botones con Poppins y colores del banner */
  .btn-primary {
    width: 100%;
    height: 52px;
    background-color: #F4D35E;
    color: #0D3B66;
    border: none;
    border-radius: 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background-color: #E8BF4C;
  }

  .btn-primary:active {
    transform: scale(0.98);
  }

  /* Caja de imagen responsiva */
  .image-box {
    width: 100%;
    margin: 12px 0;
    border-radius: 16px;
    overflow: hidden;
  }

  .image-box img {
    width: 100%;
    display: block;
    height: auto;
    object-fit: cover;
  }
</style>