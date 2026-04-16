<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Variables para los campos solicitados
  let nombreUsuario = "Laura García";
  let correo = "laura.garcia@gmail.com";
  let telefono = ""; 
  let descripcion = "";

  const volver = () => dispatch('volver');
  
  function guardarCambios() {
    console.log("Datos a guardar:", { nombreUsuario, correo, telefono, descripcion });
    alert("Perfil actualizado correctamente");
  }
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

  <div class="header-section">
    <h1 class="page-title">Editar perfil</h1>
    <button class="close-btn" on:click={volver} aria-label="Cerrar">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <main class="content-body">
    
    <form class="profile-form" on:submit|preventDefault={guardarCambios}>
      
      <div class="input-group">
        <label for="nombreUsuario">Nombre de usuario*</label>
        <div class="input-wrapper">
          <input type="text" id="nombreUsuario" bind:value={nombreUsuario} placeholder="Ej. Laura García" required />
          <span class="input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="correo">Correo electrónico*</label>
        <div class="input-wrapper">
          <input type="email" id="correo" bind:value={correo} placeholder="Ej. a01849028@tec.mx" required />
          <span class="input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="telefono">Número telefónico</label>
        <div class="input-wrapper">
          <input type="tel" id="telefono" bind:value={telefono} placeholder="Ej. 55 1234 5678" />
          <span class="input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="descripcion">Descripción</label>
        <div class="input-wrapper">
          <textarea id="descripcion" bind:value={descripcion} placeholder="Cuéntanos un poco sobre ti..." rows="4"></textarea>
          <span class="input-icon textarea-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Continuar</button>
      </div>

    </form>
  </main>
</div>

<style>
  /* Importar solo Poppins */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

  /* Contenedor principal responsivo */
  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
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

  /* Header Secundario con X a la derecha */
  .header-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 24px 24px 16px 24px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0D3B66; /* Azul marino */
    margin: 0;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    right: 24px; /* Pegado a la derecha */
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    transition: opacity 0.2s;
  }

  .close-btn:active {
    opacity: 0.6;
  }

  /* Cuerpo del contenido */
  .content-body {
    flex: 1;
    padding: 0 24px 32px 24px;
    display: flex;
    flex-direction: column;
  }

  /* Formulario */
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center; /* Centrar labels */
  }

  .input-group label {
    font-size: 15px;
    font-weight: 700;
    color: #0D3B66; /* Azul marino */
    text-align: center;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  /* Inputs amarillos (#FDF7DF) centrados */
  .input-wrapper input,
  .input-wrapper textarea {
    width: 100%;
    padding: 0 44px; /* Espacio simétrico */
    border: none;
    border-radius: 12px;
    background-color: #FDF7DF; /* Amarillo tenue pedido */
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #1F2937;
    text-align: center; /* Texto centrado */
    box-sizing: border-box;
    transition: box-shadow 0.2s;
  }

  .input-wrapper input {
    height: 52px;
  }

  /* Estilos específicos para el textarea de descripción */
  .input-wrapper textarea {
    padding-top: 16px;
    padding-bottom: 16px;
    resize: none; /* Evita que rompa el diseño */
  }

  .input-wrapper input:focus,
  .input-wrapper textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.15);
  }

  .input-wrapper input::placeholder,
  .input-wrapper textarea::placeholder {
    color: #9CA3AF;
  }

  /* Icono de lápiz a la derecha */
  .input-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }

  /* Ajuste para que el icono en el textarea no quede tan centrado verticalmente si hay mucho texto */
  .textarea-icon {
    top: 26px; /* Lo mantiene alineado con la primera línea de texto */
  }

  /* Botón de Continuar */
  .form-actions {
    margin-top: 16px;
  }

  .btn-primary {
    width: 100%;
    height: 54px;
    background-color: #F4D35E; /* Amarillo brillante */
    color: #0D3B66; /* Azul marino */
    border: none;
    border-radius: 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  .btn-primary:hover {
    background-color: #E8BF4C;
  }

  .btn-primary:active {
    transform: scale(0.98);
  }
</style>