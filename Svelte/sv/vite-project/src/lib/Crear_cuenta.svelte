<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const volver = () => dispatch('volver');
  const registrar = () => dispatch('registroExitoso');
</script>

<div class="app-container">
  <header class="top-bar">
    <div class="logo-container">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L2 12H5V20H19V12H22L12 3Z" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="14" r="2.5" fill="#FBBF24"/>
        <circle cx="9" cy="11" r="1.5" fill="#FBBF24"/>
        <circle cx="12" cy="9" r="1.5" fill="#FBBF24"/>
        <circle cx="15" cy="11" r="1.5" fill="#FBBF24"/>
      </svg>
      <h1 class="brand-title">Buscando Huellas</h1>
    </div>
  </header>

  <main class="content">
    
    <div class="page-title-container">
      <h2 class="page-title">
        <span class="strikethrough">Crear cuenta</span> Crear perfil
      </h2>
      <div class="blue-square"></div>
    </div>

    <form class="form" on:submit|preventDefault={registrar}>
      
      <div class="input-group">
        <label for="nombre">Nombre de usuario*</label>
        <div class="input-wrapper">
          <input type="text" id="nombre" placeholder="Ej. Laura García" required />
          <span class="input-icon">
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
          <span class="input-icon">
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
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="login-section">
        <p class="login-prompt">¿Ya tienes una cuenta?</p>
        <button type="button" class="btn-yellow" on:click={volver}>Inicia sesión</button>
      </div>

      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=600" alt="Gatitos durmiendo" class="cat-image" />
      </div>

      <button type="submit" class="btn-yellow">Continuar</button>

    </form>
  </main>
</div>

<style>
  /* Importamos fuentes: Serif para títulos/labels y Sans para los inputs */
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;600&display=swap');

  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #F3F4F6; /* Fondo gris claro detrás del móvil */
  }

  /* Contenedor principal responsivo */
  .app-container {
    width: 100%;
    max-width: 480px; /* Ancho máximo para no estirarse en PC */
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
  }

  /* Header Azul Superior */
  .top-bar {
    background-color: #0D3B66;
    color: #FBBF24;
    padding: 16px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-title {
    font-family: 'Merriweather', serif;
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
  }

  /* Contenido principal */
  .content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  /* Título de la página */
  .page-title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
    margin-top: 10px;
  }

  .page-title {
    font-family: 'Merriweather', serif;
    font-size: 18px;
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
    text-align: center;
  }

  .strikethrough {
    text-decoration: line-through;
    color: #0D3B66;
    margin-right: 4px;
  }

  .blue-square {
    width: 14px;
    height: 14px;
    background-color: #0D3B66;
  }

  /* Formulario */
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .input-group label {
    font-family: 'Merriweather', serif;
    font-size: 15px;
    font-weight: 700;
    color: #0D3B66;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  /* Inputs Amarillo Bajito */
  .input-wrapper input {
    width: 100%;
    height: 48px;
    padding: 0 40px; /* Espacio para el ícono a la derecha */
    border: none;
    border-radius: 8px;
    background-color: #FDF7DF; /* Amarillo bajito */
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #4B5563;
    text-align: center; /* Texto centrado como en la imagen */
    box-sizing: border-box;
    transition: box-shadow 0.2s;
  }

  .input-wrapper input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #FBBF24;
  }

  .input-wrapper input::placeholder {
    color: #9CA3AF;
  }

  .input-icon {
    position: absolute;
    right: 14px;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  /* Sección de Iniciar Sesión */
  .login-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    gap: 12px;
  }

  .login-prompt {
    font-family: 'Merriweather', serif;
    font-size: 16px;
    font-weight: 700;
    color: #0D3B66;
    margin: 0;
  }

  /* Botones Amarillos */
  .btn-yellow {
    width: 100%;
    height: 48px;
    background-color: #F8D162; /* Amarillo estilo yema */
    color: #000000;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  .btn-yellow:hover {
    background-color: #F5C33B;
  }

  .btn-yellow:active {
    transform: scale(0.98);
  }

  /* Imagen de los gatitos */
  .image-container {
    width: 100%;
    margin: 20px 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .cat-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
</style>