<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import CrearCuenta from './lib/Crear_cuenta.svelte';
  import EditarPerfil from './lib/Editar_perfil.svelte';
  import Navbar from './lib/Navbar.svelte';

  // --- LÓGICA DE RUTAS UNIFICADA ---
  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== ""); 
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 
  let vistaAnterior = "inicio"; // De la versión de tu compañero

  let mascotaSeleccionada = null;

  function navegar(vista, sub = '') {
    vistaAnterior = vistaActual; // Guardamos dónde estábamos antes de cambiar
    vistaActual = vista;
    subVista = sub;
    
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    const urlFinal = vista === 'inicio' ? '/' : url;
    history.pushState({}, '', urlFinal);
  }

  // --- FUNCIONES DE NAVEGACIÓN ---
  const irAInicio   = () => navegar('inicio');
  const irABuscar   = () => navegar('buscar');
  
  // Modificada para usar la lógica de "volver" de tu compañero
  const irAPublicar = () => {
    vistaAnterior = vistaActual;
    navegar('publicar');
  };

  const irAPerfil   = () => navegar('perfil', 'iniciar_sesion');

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
      <Publicar 
        on:volver={() => navegar(vistaAnterior)} 
        on:publicado={irAInicio}
      />

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
  /* ESTILOS UNIFICADOS (Combinando ambas versiones) */
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
    margin-inline: auto; /* Centrado horizontal */
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

  /* Mejora visual de fondo para pantallas grandes (de tu compañero) */
  @media (min-width: 401px) {
    :global(body) {
      background-color: #f3f4f6;
    }
  }
</style>