<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import Navbar from './lib/Navbar.svelte';

  let vistaActual = window.location.pathname.replace('/', '') || 'inicio';
  let mascotaSeleccionada = null;

  function navegar(vista) {
    vistaActual = vista;
    history.pushState({}, '', `/${vista}`);
  }

  const irAInicio   = () => navegar('inicio');
  const irABuscar   = () => navegar('buscar');
  const irAPublicar = () => navegar('publicar');
  const irAPerfil   = () => navegar('perfil');

  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar('publicacion');
  };

  window.onpopstate = () => {
    vistaActual = window.location.pathname.replace('/', '') || 'inicio';
  };
</script>

<main>
  <div class="app-container">

    {#if vistaActual === 'inicio'}
      <Inicio 
        on:irABuscar={irABuscar} 
        on:irAPublicar={irAPublicar} 
      />

    {:else if vistaActual === 'buscar'}
      <Buscar 
        on:volver={irAInicio} 
        on:verPublicacion={irAPublicacion} 
        on:irAPublicar={irAPublicar} 
      />

    {:else if vistaActual === 'publicacion'}
      <Publicacion 
        mascota={mascotaSeleccionada} 
        on:volver={irABuscar} 
      />

    {:else if vistaActual === 'publicar'}
      <Publicar on:volver={irAInicio} />

    {:else if vistaActual === 'perfil'}
      <IniciarSesion on:volver={irAInicio} />
    {/if}

  </div>

  <!-- Navbar global -->
  <Navbar 
    vistaActiva={vistaActual}
    on:irAInicio={irAInicio}
    on:irABuscar={irABuscar}
    on:irAPublicar={irAPublicar}
    on:irAPerfil={irAPerfil}
  />
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

  :global(.app-container) {
    width: 100%;
    max-width: 400px;
    margin-inline: auto;
    background: #FFFFFF;
    min-height: 100vh;
    position: relative;
    padding-bottom: 90px;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
    overflow-x: hidden;
  }

  @media (max-width: 400px) {
    :global(.app-container) {
      box-shadow: none;
    }
  }
</style>