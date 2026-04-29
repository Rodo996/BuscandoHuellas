<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Props
  export let pet_id; // Recibido desde la vista de publicación

  // Estado del formulario
  let estadoSeleccionado = "Recuperada con éxito";
  let evidenciaTexto = "";
  let imagenEvidencia = null;
  let cargando = false;

  // Manejo de imagen
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      imagenEvidencia = e.target.files[0];
    }
  };

  const confirmarPublicacion = async () => {
    if (!evidenciaTexto.trim()) {
      alert("Por favor, cuéntanos brevemente cómo fue el reencuentro.");
      return;
    }

    cargando = true;
    try {
      // 1. Crear el Post de tipo 'Success Story'
      const res = await fetch('http://localhost:3000/api/casos-exito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet_id: pet_id,
          story: evidenciaTexto
        })
      });

      if (!res.ok) throw new Error("Error al crear el post");
      const { post_id } = await res.json();

      // 2. Subir la imagen de evidencia si existe (usando tu ruta de imágenes)
      if (imagenEvidencia && post_id) {
        const formData = new FormData();
        formData.append("image", imagenEvidencia);
        await fetch(`http://localhost:3000/api/images/upload/${post_id}`, {
          method: "POST",
          body: formData
        });
      }

      // 3. Notificar éxito y navegar
      dispatch('exitoPublicado');
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al cerrar el caso.");
    } finally {
      cargando = false;
    }
  };
</script>

<div class="app-container">
  <header class="top-brand-header">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
      <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E" />
    </svg>
    <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
  </header>

  <div class="page-header">
    <h1 class="page-title">Cerrar caso</h1>
    <button class="close-btn" on:click={() => dispatch('volver')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D3B66" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <main class="form-body">
    <section class="section">
      <h3 class="section-title">Estado del reporte</h3>
      <div class="radio-group">
        <label class="radio-option" class:selected={estadoSeleccionado === "Recuperada con éxito"}>
          <input type="radio" bind:group={estadoSeleccionado} value="Recuperada con éxito" />
          <span class="radio-dot"></span>
          Recuperada con éxito
        </label>
        <label class="radio-option" class:selected={estadoSeleccionado === "En proceso"}>
          <input type="radio" bind:group={estadoSeleccionado} value="En proceso" />
          <span class="radio-dot"></span>
          En proceso
        </label>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">Evidencia</h3>
      
      <label class="upload-area">
        <input type="file" accept="image/*" on:change={handleFileChange} hidden />
        {#if imagenEvidencia}
          <img src={URL.createObjectURL(imagenEvidencia)} alt="Previsualización" class="preview-img" />
        {:else}
          <div class="upload-placeholder">
            <svg width="40" height="36" viewBox="0 0 24 24" fill="none" stroke="#F4D35E" stroke-width="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Subir foto del Reencuentro</span>
          </div>
        {/if}
      </label>

      <textarea 
        class="evidence-textarea" 
        bind:value={evidenciaTexto}
        placeholder="Cuéntanos brevemente cómo fue el reencuentro"
      ></textarea>
    </section>

    <div class="action-buttons">
      <button class="btn-confirm" on:click={confirmarPublicacion} disabled={cargando}>
        {cargando ? 'Publicando...' : 'Confirmar y publicar en Casos de Éxito'}
      </button>
      <button class="btn-cancel" on:click={() => dispatch('volver')}>
        Cancelar
      </button>
    </div>
  </main>
</div>

<style>
  .app-container {
    background: #FFFFFF;
    min-height: 100vh;
  }

  .top-brand-header {
    background: #0D3B66;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 15px 0;
  }

  .text-white { color: white; font-weight: 700; font-size: 20px; }
  .text-yellow { color: #F4D35E; font-weight: 700; font-size: 20px; }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #F3F4F6;
  }

  .page-title { color: #0D3B66; font-size: 18px; font-weight: 700; margin: 0; flex: 1; text-align: center; }

  .close-btn { background: none; border: none; cursor: pointer; padding: 5px; }

  .form-body { padding: 20px; display: flex; flex-direction: column; gap: 25px; }

  .section-title { font-size: 16px; font-weight: 700; color: #1F2937; margin-bottom: 12px; }

  /* Radio Buttons */
  .radio-group { display: flex; flex-direction: column; gap: 10px; }
  .radio-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    color: #1F2937;
  }
  .radio-option.selected { border-color: #F4D35E; background-color: #FFFEFC; }
  .radio-option input { display: none; }
  .radio-dot {
    width: 20px;
    height: 20px;
    border: 2px solid #D1D5DB;
    border-radius: 50%;
    position: relative;
  }
  .selected .radio-dot { border-color: #F4D35E; }
  .selected .radio-dot::after {
    content: "";
    width: 10px;
    height: 10px;
    background: #F4D35E;
    border-radius: 50%;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }

  /* Área de Carga */
  .upload-area {
    width: 100%;
    height: 180px;
    background: #FAF0CA;
    border: 2px dashed #F4D35E;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 15px;
  }
  .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #EAB308; font-size: 14px; text-align: center; }
  .preview-img { width: 100%; height: 100%; object-fit: cover; }

  .evidence-textarea {
    width: 100%;
    height: 120px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 15px;
    font-family: inherit;
    resize: none;
    outline: none;
  }

  /* Botones */
  .action-buttons { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
  .btn-confirm {
    background: #F4D35E;
    color: #0D3B66;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(244, 211, 94, 0.3);
  }
  .btn-cancel {
    background: #F3F4F6;
    color: #4B5563;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }
</style>