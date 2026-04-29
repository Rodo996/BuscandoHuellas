<script>
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  export let user_id;

  // Variables inicializadas
  let name = "";
  let email = "";
  let phoneNumber = "";
  let description = "";
  let cargando = true;

  onMount(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user_id}`);
      const data = await res.json();
      name = data.name ?? "";
      email = data.email ?? "";
      phoneNumber = data.phone_num ?? "";
      description = data.description ?? "";
    } finally {
      cargando = false;
    }
  });

  const volver = () => dispatch("volver");

  async function guardarCambios() {
    const datos = { name, email, phoneNumber, description };
    console.log("Datos a enviar al backend:", datos);

    try {
      const response = await fetch("http://localhost:3000/api/editar-perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resServidor = await response.json();

      if (response.ok) {
        if (resServidor.cambios) {
          alert("¡Perfil actualizado con éxito!");
        } else {
          alert("No se realizaron cambios (los datos ya eran iguales).");
        }
      } else {
        alert("Error: " + resServidor.error);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor. ¿Está encendido el backend?");
    }
  }
</script>

<div class="mobile-container">
  <header class="top-brand-header">
    <div class="brand-wrapper">
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
        <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
      </svg>
      <div class="brand-text">
        <span class="text-white">Buscando</span><span class="text-yellow"
          >Huellas</span
        >
      </div>
    </div>
  </header>

  <main class="content">
    <div class="section-title-container">
      <h2 class="page-title">Editar Perfil</h2>
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

    <form class="edit-form" on:submit|preventDefault={guardarCambios}>
      <div class="field-group">
        <label for="name">Nombre</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="name"
            bind:value={name}
            placeholder="Tu nombre"
          />
          <span class="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="field-group">
        <label for="email">Correo electrónico</label>
        <div class="input-wrapper">
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="tu@correo.com"
          />
          <span class="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="field-group">
        <label for="phone">Teléfono</label>
        <div class="input-wrapper">
          <input
            type="tel"
            id="phone"
            bind:value={phoneNumber}
            placeholder="Tu teléfono"
          />
          <span class="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="field-group">
        <label for="desc">Descripción</label>
        <div class="input-wrapper">
          <textarea
            id="desc"
            rows="4"
            bind:value={description}
            placeholder="Cuéntanos sobre ti..."
          ></textarea>
          <span class="input-icon textarea-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Guardar cambios</button>
      </div>
    </form>
  </main>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    font-family: "Poppins", sans-serif;
    overflow-x: hidden;
  }

  /* Header Superior */
  .top-brand-header {
    background-color: #0d3b66;
    padding: 18px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .brand-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-text {
    font-size: 24px;
    font-weight: 800;
  }

  .text-white {
    color: #ffffff;
  }
  .text-yellow {
    color: #f4d35e;
  }

  /* Contenido Principal */
  .content {
    flex: 1;
    padding: 24px 24px 120px 24px; /* <--- ESPACIO EXTRA PARA LA NAVBAR */
    display: flex;
    flex-direction: column;
  }

  .section-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0d3b66;
    margin: 0;
    flex: 1;
    text-align: center;
    padding-left: 32px;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  /* Avatar */
  .profile-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
    background-color: #fdf7df;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .change-photo-link {
    background: none;
    border: none;
    color: #0d3b66;
    font-size: 14px;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
  }

  /* Formulario */
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .field-group label {
    font-size: 14px;
    font-weight: 700;
    color: #0d3b66;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  .input-wrapper input,
  .input-wrapper textarea {
    width: 100%;
    padding: 0 44px;
    border: none;
    border-radius: 12px;
    background-color: #fdf7df;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #1f2937;
    text-align: center;
    box-sizing: border-box;
  }

  .input-wrapper input {
    height: 52px;
  }

  .input-wrapper textarea {
    padding-top: 16px;
    padding-bottom: 16px;
    resize: none;
  }

  .input-wrapper input:focus,
  .input-wrapper textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.15);
  }

  .input-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }

  .textarea-icon {
    top: 26px;
  }

  /* Botón */
  .btn-primary {
    width: 100%;
    height: 56px;
    background-color: #f4d35e;
    color: #0d3b66;
    border: none;
    border-radius: 12px;
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s ease;
    margin-top: 10px;
  }

  .btn-primary:active {
    transform: scale(0.98);
  }
</style>
