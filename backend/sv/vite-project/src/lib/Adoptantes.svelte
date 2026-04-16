<script>
  let users = [];
  
  // 1. Cambiamos 'nombre' por las variables exactas que tu Backend espera
  let name = ""; 
  let email = "";
  let phone_num = "";
  let descripcion = "";
  
  let mensajeError = ""; 

  async function cargarUsuarios() {
    try {
      // 2. Cambiamos /users a /Users (con U mayúscula)
      const res = await fetch("http://localhost:2026/Users"); 
      const data = await res.json();
      
      if (Array.isArray(data)) {
        users = data;
        mensajeError = "";
      } else {
        mensajeError = "El backend respondió, pero no con una lista de usuarios.";
      }
    } catch (error) {
      mensajeError = "No se pudo conectar con el backend. ¿Está corriendo Express?";
    }
  }

  async function agregar() {
    if (!name) return; 
    
    // 3. Enviamos el cuerpo (body) con los 4 campos que espera tu POST
    await fetch("http://localhost:2026/Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone_num, descripcion })
    });
    
    // Limpiamos los inputs
    name = ""; email = ""; phone_num = ""; descripcion = ""; 
    cargarUsuarios(); 
  }

  // 4. Recibimos el user_id para actualizar
  async function actualizar(user_id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    if (!nuevoNombre) return;

    await fetch(`http://localhost:2026/Users/${user_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nuevoNombre }) // Solo actualizamos el nombre como ejemplo
    });
    cargarUsuarios();
  }

  // 5. Recibimos el user_id para eliminar
  async function eliminar(user_id) {
    await fetch(`http://localhost:2026/Users/${user_id}`, {
      method: "DELETE"
    });
    cargarUsuarios();
  }

  cargarUsuarios();
</script>

<main style="padding: 20px; font-family: sans-serif;">
  <h1>Mi Gestor de Adoptantes</h1>

  {#if mensajeError}
    <p style="color: red;">{mensajeError}</p>
  {/if}

  <div style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin-bottom: 20px;">
    <input bind:value={name} placeholder="Nombre..." />
    <input bind:value={email} placeholder="Correo electrónico..." />
    <input bind:value={phone_num} placeholder="Teléfono..." />
    <input bind:value={descripcion} placeholder="Descripción..." />
    <button on:click={agregar}>Agregar a DB</button>
  </div>

  <hr>

  <h2>Lista desde la Base de Datos</h2>
  {#if users.length === 0}
    <p>No hay usuarios todavía.</p>
  {:else}
    <ul>
      {#each users as user}
        <li style="margin-bottom: 10px;">
          <strong>{user.name}</strong> ({user.email})
          <button on:click={() => actualizar(user.user_id)}>Editar</button>
          <button on:click={() => eliminar(user.user_id)}>Eliminar</button>
        </li>
      {/each}
    </ul>
  {/if}
</main>