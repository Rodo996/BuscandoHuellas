<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import Chats from './lib/Chats.svelte'; 
  import Chat from './lib/Chat.svelte';

  let vistaActual = window.location.pathname.replace('/', '') || 'inicio';
  let mascotaSeleccionada = null;
  // 1. Variable para guardar con quién estamos chateando
  let contactoActivo = null; 

  function navegar(vista) {
    vistaActual = vista;
    history.pushState({}, '', `/${vista}`);
  }

  const irAInicio     = () => navegar('inicio');
  const irABuscar     = () => navegar('buscar');
  const irAPublicar   = () => navegar('publicar');
  const irAChats      = () => navegar('chats'); 
  
  // 2. Modificamos irAChat para que reciba el contacto
  const irAChat = (event) => {
    // Si viene de la lista de chats, tendrá el detalle del contacto
    if (event && event.detail) {
        contactoActivo = event.detail;
    } else {
        // Si no (por ejemplo, si vienes de la ficha de la mascota directa) le ponemos valores por defecto
        contactoActivo = { nombre: "Dueño", color: "#F4D35E" };
    }
    navegar('chat');
  };
  
  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar('publicacion');
  };

  window.onpopstate = () => {
    vistaActual = window.location.pathname.replace('/', '') || 'inicio';
  };
</script>

<main>
  {#if vistaActual === 'inicio'}
    <Inicio on:irABuscar={irABuscar} on:irAPublicar={irAPublicar} on:irAChats={irAChats} />
  {:else if vistaActual === 'buscar'}
    <Buscar on:volver={irAInicio} on:verPublicacion={irAPublicacion} on:irAPublicar={irAPublicar} on:irAChats={irAChats} />
  {:else if vistaActual === 'publicacion'}
    <Publicacion mascota={mascotaSeleccionada} on:volver={irABuscar} on:irAChat={irAChat} />
  {:else if vistaActual === 'publicar'}
    <Publicar on:volver={irAInicio} />
  {:else if vistaActual === 'chats'}
    <Chats on:volver={irAInicio} on:abrirChat={irAChat} />
  {:else if vistaActual === 'chat'}
    <Chat contacto={contactoActivo} on:volver={() => navegar('chats')} />
  {/if}
</main>
<style>
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

  /* Clase reutilizable para TODAS las vistas */
  :global(.app-container) {
    width: 100%;
    max-width: 400px;
    margin-inline: auto;           /* ← el centrado real */
    background: #FFFFFF;
    min-height: 100vh;
    position: relative;
    padding-bottom: 90px;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
    overflow-x: hidden;
  }

  /* Responsive: sin sombra en móvil pequeño */
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