<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import CrearCuenta from './lib/Crear_cuenta.svelte';
  import EditarPerfil from './lib/Editar_perfil.svelte';
  import Navbar from './lib/Navbar.svelte';
  // --- IMPORTACIONES DE CHAT (AÑADIDAS) ---
  import Chats from './lib/Chats.svelte'; 
  import Chat from './lib/Chat.svelte';

  // --- LÓGICA DE RUTAS UNIFICADA ---
  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== ""); 
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 
  let vistaAnterior = "inicio"; 

  let mascotaSeleccionada = null;
  // --- ESTADO DEL CHAT (AÑADIDO) ---
  let contactoActivo = null; 

  function navegar(vista, sub = '') {
    vistaAnterior = vistaActual; 
    vistaActual = vista;
    subVista = sub;
    
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    const urlFinal = vista === 'inicio' ? '/' : url;
    history.pushState({}, '', urlFinal);
  }

  // --- FUNCIONES DE NAVEGACIÓN ---
  const irAInicio   = () => navegar('inicio');
  const irABuscar   = () => navegar('buscar');
  
  const irAPublicar = () => {
    vistaAnterior = vistaActual;
    navegar('publicar');
  };

  const irAPerfil   = () => navegar('perfil', 'iniciar_sesion');

  // --- NAVEGACIÓN DE CHATS (AÑADIDA) ---
  const irAChats = () => navegar('chats');

  const irAChat = (event) => {
    // Si viene de la lista de chats tiene detalle, si no (desde ficha mascota) es genérico
    if (event && event.detail) {
        contactoActivo = event.detail;
    } else {
        contactoActivo = { nombre: "Dueño", color: "#F4D35E" };
    }
    navegar('chat');
  };

  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar('publicacion');
  };

  // Sincronización con el botón "Atrás" del navegador
  window.onpopstate = () => {
    const p = window.location.pathname.split('/').filter(p => p !== "");
    vistaActual = p[0] || 'inicio';
    subVista = p[1] || '';
  };
</script>

<main>
  <div class="app-container">

    {#if vistaActual === 'inicio'}
      <Inicio 
        on:irABuscar={irABuscar} 
        on:irAPublicar={irAPublicar} 
        on:irAChats={irAChats}
      />

    {:else if vistaActual === 'buscar'}
      <Buscar 
        on:volver={irAInicio} 
        on:verPublicacion={irAPublicacion} 
        on:irAPublicar={irAPublicar} 
        on:irAChats={irAChats}
      />

    {:else if vistaActual === 'publicacion'}
      <Publicacion 
        mascota={mascotaSeleccionada} 
        on:volver={irABuscar} 
        on:irAChat={irAChat}
      />

    {:else if vistaActual === 'publicar'}
      <Publicar 
        on:volver={() => navegar(vistaAnterior)} 
        on:publicado={irAInicio}
      />

    {:else if vistaActual === 'chats'}
      <Chats on:volver={irAInicio} on:abrirChat={irAChat} />

    {:else if vistaActual === 'chat'}
      <Chat contacto={contactoActivo} on:volver={irAChats} />

    {:else if vistaActual === 'perfil'}
        {#if subVista === 'crear_cuenta'}
          <CrearCuenta on:volver={() => navegar('perfil', 'iniciar_sesion')} />
        {:else if subVista === 'editar_perfil'}
          <EditarPerfil on:volver={irAPerfil} />
        {:else}
          <IniciarSesion 
            on:irACrearCuenta={() => navegar('perfil', 'crear_cuenta')}
            on:loginExitoso={() => navegar('perfil', 'editar_perfil')} 
            on:volver={irAInicio}
          />
        {/if}
    {/if}

  </div>

  <Navbar 
    vistaActiva={vistaActual}
    on:irAInicio={irAInicio}
    on:irABuscar={irABuscar}
    on:irAPublicar={irAPublicar}
    on:irAPerfil={irAPerfil}
    on:irAChats={irAChats} 
  />
</main>

<style>
  /* ESTILOS UNIFICADOS (Tus estilos originales de 151 líneas) */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

  :global(html), :global(body) {
    width: 100%;
    margin: 0;
    padding: 0;
    min-height: 100dvh;
    font-family: 'Poppins', sans-serif;
    background-color: #F3F4F6;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(.app-container) {
    width: 100%;
    max-width: 400px;
    margin-inline: auto; 
    background: #FFFFFF;
    min-height: 100vh;
    position: relative;
    padding-bottom: 50px;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
    overflow-x: hidden;
  }

  @media (max-width: 400px) {
    :global(.app-container) {
      box-shadow: none;
    }
  }

  @media (min-width: 401px) {
    :global(body) {
      background-color: #f3f4f6;
    }
  }
</style>