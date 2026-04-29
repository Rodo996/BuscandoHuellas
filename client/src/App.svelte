<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';
  import Publicar from './lib/Publicar.svelte';
  import IniciarSesion from './lib/Iniciar_sesion.svelte';
  import CrearCuenta from './lib/Crear_cuenta.svelte';
  import EditarPerfil from './lib/Editar_perfil.svelte';
  import Navbar from './lib/Navbar.svelte';
  import Chats from './lib/Chats.svelte'; 
  import Chat from './lib/Chat.svelte';

  // --- LÓGICA DE RUTAS ---
  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== ""); 
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 
  let vistaAnterior = "inicio"; 

  let mascotaSeleccionada = null;
  let contactoActivo = null; 

  // --- NUEVA VARIABLE DE ESTADO DE SESIÓN ---
  let sesionActiva = false; // Controla si el usuario ya entró

  function navegar(vista, sub = '') {
    vistaAnterior = vistaActual; 
    vistaActual = vista;
    subVista = sub;
    
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    const urlFinal = vista === 'inicio' ? '/' : url;
    history.pushState({}, '', urlFinal);
  }

  // --- FUNCIONES DE NAVEGACIÓN MODIFICADAS ---
  const irAInicio = () => navegar('inicio');
  const irABuscar = () => navegar('buscar');
  const irAPublicar = () => navegar('publicar');
  const irAChats = () => navegar('chats');

  // MODIFICACIÓN AQUÍ: Ya no va a 'perfil' a secas si hay sesión
  const irAPerfil = () => {
    if (sesionActiva) {
      navegar('perfil', 'editar_perfil'); // Directo a editar si ya logueó
    } else {
      navegar('perfil'); // A iniciar sesión si no hay cuenta activa
    }
  };

  const verMascota = (m) => {
    mascotaSeleccionada = m;
    navegar('publicacion');
  };

  const abrirChat = (contacto) => {
    contactoActivo = contacto;
    navegar('chats', 'detalle');
  };
</script>

<main>
  <div class="container">
    {#if vistaActual === 'inicio'}
      <Inicio on:verMascota={(e) => verMascota(e.detail)} />
    
    {:else if vistaActual === 'buscar'}
      <Buscar />

    {:else if vistaActual === 'publicacion'}
      <Publicacion 
        mascota={mascotaSeleccionada} 
        on:volver={() => navegar(vistaAnterior)} 
      />

    {:else if vistaActual === 'publicar'}
      <Publicar on:volver={irAInicio} />

    {:else if vistaActual === 'chats'}
        {#if subVista === 'detalle'}
          <Chat contacto={contactoActivo} on:volver={irAChats} />
        {:else}
          <Chats on:seleccionarChat={(e) => abrirChat(e.detail)} />
        {/if}

    {:else if vistaActual === 'perfil'}
        {#if subVista === 'crear_cuenta'}
          <CrearCuenta on:volver={() => navegar('perfil', 'iniciar_sesion')} />
        
        {:else if subVista === 'editar_perfil'}
          <EditarPerfil on:volver={irAInicio} />
        
        {:else}
          <IniciarSesion 
            on:irACrearCuenta={() => navegar('perfil', 'crear_cuenta')}
            on:loginExitoso={() => {
              sesionActiva = true; // <--- ACTIVAMOS LA SESIÓN
              navegar('perfil', 'editar_perfil'); // <--- MANDAMOS A EDITAR
            }} 
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
  /* Tus estilos se mantienen exactamente igual */
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

  .container {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    background-color: white;
    min-height: 100dvh;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    position: relative;
    padding-bottom: 70px;
  }
</style>