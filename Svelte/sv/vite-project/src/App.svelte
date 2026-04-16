<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';

  let vistaActual = window.location.pathname.replace('/', '') || 'inicio';
  let mascotaSeleccionada = null;

  function navegar(vista) {
    vistaActual = vista;
    history.pushState({}, '', `/${vista}`);
  }

  const irAInicio     = () => navegar('inicio');
  const irABuscar     = () => navegar('buscar');
  const irAPublicar   = () => navegar('publicar');
  
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
    <Inicio on:irABuscar={irABuscar} on:irAPublicar={irAPublicar} />
  {:else if vistaActual === 'buscar'}
    <Buscar on:volver={irAInicio} on:verPublicacion={irAPublicacion} on:irAPublicar={irAPublicar} />
  {:else if vistaActual === 'publicacion'}
    <Publicacion mascota={mascotaSeleccionada} on:volver={irABuscar} />
  {:else if vistaActual === 'publicar'}
    <Publicar on:volver={irAInicio} />
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