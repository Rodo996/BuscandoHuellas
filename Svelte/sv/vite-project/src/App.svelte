<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import CrearCuenta from './lib/Crear_cuenta.svelte';
  import EditarPerfil from './lib/Editar_perfil.svelte';
  import Navbar from './lib/Navbar.svelte';

  // Lógica de rutas corregida para que no se rompa el inicio
  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== ""); 
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 

  let mascotaSeleccionada = null;

  function navegar(vista, sub = '') {
    vistaActual = vista;
    subVista = sub;
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    // Si es inicio, mantenemos la URL limpia
    const urlFinal = vista === 'inicio' ? '/' : url;
    history.pushState({}, '', urlFinal);
  }

  const irAInicio   = () => navegar('inicio');
  const irABuscar   = () => navegar('buscar');
  const irAPublicar = () => navegar('publicar');
  const irAPerfil   = () => navegar('perfil', 'iniciar_sesion');

  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar('publicacion');
  };

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
  />
</main>

<style>
  /* TU ESTILO ORIGINAL INTACTO */
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