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
  import CasosExito from './lib/Caso_exito.svelte'; 
  import FichaExito from './lib/Ficha_exito.svelte';
  import { listaContactos } from './lib/contactos.js';
  import { onMount } from 'svelte';
  // --- LÓGICA DE RUTAS UNIFICADA ---
  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== "");
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 
  let vistaAnterior = "inicio"; 
  let mascotaSeleccionada = null;
  // --- ESTADO DE SESIÓN AÑADIDO ---
  let sesionActiva = false; 
  let casoSeleccionado = null;
  //Estos dos let son para chat.svelte
  let contactoActivo = null;
  let cargandoContacto = false;

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
  const verCasosExito = () => navegar('casos_exito');
  const irAPublicar = () => {
    vistaAnterior = vistaActual;
    navegar('publicar');
  };

  // --- GUARDIÁN DE RUTAS EN EL PERFIL ---
  const irAPerfil = () => {
    // Si ya inició sesión, lo manda a editar su perfil.
    if (sesionActiva) {
      navegar('perfil', 'editar_perfil');
    } else {
      // Si no, lo manda a iniciar sesión.
      navegar('perfil', 'iniciar_sesion');
    }
  };

  const irAChats = () => navegar('chats');
  
  const irAChat = (event) => {
    if (event && event.detail) {
        contactoActivo = event.detail;
    } else {
        contactoActivo = { nombre: "Dueño", color: "#F4D35E" };
    }
    navegar('chat', contactoActivo.id);
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
 onMount(async () => {
    if (vistaActual === 'chat' && subVista) {
        cargandoContacto = true;  // ← bloquea el render de Chat
        const encontrado = listaContactos.find(c => c.id === Number(subVista));
        contactoActivo = encontrado ?? null;
        if (!contactoActivo) navegar('chats');
        cargandoContacto = false; // ← libera el render
    }
});
</script>

<main>
  <div class="app-container">

    {#if vistaActual === 'inicio'}
      <Inicio 
        on:irABuscar={irABuscar} 
        on:irAPublicar={irAPublicar} 
        on:irAChats={irAChats}
        on:verCasosExito={verCasosExito}
        on:verHistoria={(e) => {
            casoSeleccionado = e.detail; 
            navegar('ficha_exito'); 
        }}
      />
    {:else if vistaActual === 'caso_cerrado'}
      <CasoCerrado 
      pet_id={mascotaSeleccionada?.pet_id}
    on:volver={() => navegar('publicacion')} 
    on:exitoPublicado={() => navegar('casos_exito')}
      />
    {:else if vistaActual === 'casos_exito'}
      <CasosExito 
      on:volver={irAInicio} 
      on:verCasosExito={verCasosExito}
      on:verHistoria={(e) => {
            casoSeleccionado = e.detail; // Guardamos los datos de la mascota
            navegar('ficha_exito'); // Cambiamos de pantalla
        }}
      />
    {:else if vistaActual === 'ficha_exito'}
      <FichaExito 
        caso={casoSeleccionado} 
        on:volver={() => navegar('casos_exito')} 
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
  {#if cargandoContacto}
    <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
      <p style="font-family:Poppins; color:#0D3B66; font-weight:600;">Cargando...</p>
    </div>
  {:else}
    <Chat contacto={contactoActivo} on:volver={irAChats} />
  {/if}
    {:else if vistaActual === 'perfil'}
        {#if subVista === 'editar_perfil' && sesionActiva}
          <EditarPerfil on:volver={irAInicio} />
          
        {:else if subVista === 'crear_cuenta'}
          <CrearCuenta on:volver={() => navegar('perfil', 'iniciar_sesion')} />
          
        {:else}
          <IniciarSesion 
            mensajeAlerta={(!sesionActiva && subVista === 'editar_perfil') ? "Primero debes acceder a tu cuenta" : ""}
            on:irACrearCuenta={() => navegar('perfil', 'crear_cuenta')}
            on:loginExitoso={() => {
              sesionActiva = true; // Activa la sesión en toda la app
              navegar('perfil', 'editar_perfil');
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
  /* ESTILOS ORIGINALES INTACTOS */
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
    overflow-x: clip;
    /*overflow-x: hidden;*/
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