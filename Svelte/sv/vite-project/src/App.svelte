<script>
  // ... tus otras importaciones
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import CrearCuenta from './lib/Crear_cuenta.svelte';
  import EditarPerfil from './lib/Editar_perfil.svelte';
  import Navbar from './lib/Navbar.svelte';

  // Modificamos la lógica para detectar subrutas
  let path = window.location.pathname;
  let vistaActual = path.split('/')[1] || 'inicio'; 
  let subVista = path.split('/')[2] || ''; // Captura lo que sigue de /perfil/

  let mascotaSeleccionada = null;

  function navegar(vista, sub = '') {
    vistaActual = vista;
    subVista = sub;
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    history.pushState({}, '', url);
  }

  // Helpers de navegación
  const irAInicio = () => navegar('inicio');
  const irABuscar = () => navegar('buscar');
  const irAPerfil = () => navegar('perfil', 'iniciar_sesion'); // Por defecto va a login

  window.onpopstate = () => {
    const p = window.location.pathname.split('/');
    vistaActual = p[1] || 'inicio';
    subVista = p[2] || '';
  };
</script>

<main>
  <div class="app-container">
    {#if vistaActual === 'perfil'}
      {#if subVista === 'crear_cuenta'}
        <CrearCuenta on:irALogin={() => navegar('perfil', 'iniciar_sesion')} />
      
      {:else if subVista === 'editar_perfil'}
        <EditarPerfil on:volver={irAPerfil} />
      
      {:else}
        <IniciarSesion 
          on:irARegistro={() => navegar('perfil', 'crear_cuenta')}
          on:loginExitoso={() => navegar('perfil', 'editar_perfil')} 
        />
      {/if}
    {/if}
  </div>

  <Navbar 
    vistaActiva={vistaActual}
    on:irAInicio={irAInicio}
    on:irABuscar={irABuscar}
    on:irAPerfil={irAPerfil}
  />
</main>