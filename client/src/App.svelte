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
  import { onMount } from 'svelte';   // ← NUEVO

  const API = "http://localhost:3000/api";  // ← NUEVO

  let path = window.location.pathname;
  let partes = path.split('/').filter(p => p !== "");
  let user_id = null;
  
  let vistaActual = partes[0] || 'inicio'; 
  let subVista = partes[1] || ''; 
  let vistaAnterior = "inicio"; 
  let mascotaSeleccionada = null;
  let contactoActivo = null;
  let sesionActiva = false; 

  function navegar(vista, sub = '') {
    vistaAnterior = vistaActual; 
    vistaActual = vista;
    subVista = sub;
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    const urlFinal = vista === 'inicio' ? '/' : url;
    history.pushState({}, '', urlFinal);
  }

  const irAInicio   = () => navegar('inicio');
  const irABuscar   = () => navegar('buscar');
  const irAPublicar = () => { vistaAnterior = vistaActual; navegar('publicar'); };
  const irAPerfil = () => {
    if (sesionActiva) navegar('perfil', 'editar_perfil');
    else navegar('perfil', 'iniciar_sesion');
  };
  const irAChats = () => navegar('chats');
  const irAChat = (event) => {
    contactoActivo = event?.detail ?? { nombre: "Dueño", color: "#F4D35E" };
    navegar('chat');
  };
  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar("publicacion", mascotaSeleccionada.id);  // ← URL cambia a /publicacion/15
  };

  window.onpopstate = () => {
    const p = window.location.pathname.split('/').filter(p => p !== "");
    vistaActual = p[0] || 'inicio';
    subVista = p[1] || '';
  };

  // ── NUEVO: carga directa por URL ─────────────────────────────
  onMount(async () => {
    if (vistaActual === "publicacion" && subVista) {
      try {
        const res = await fetch(`${API}/mascotas/${subVista}`);
        if (res.ok) {
          mascotaSeleccionada = await res.json();
        } else {
          navegar("buscar");
        }
      } catch {
        navegar("buscar");
      }
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
      />

    {:else if vistaActual === 'buscar'}
      <Buscar 
        on:volver={irAInicio} 
        on:verPublicacion={irAPublicacion} 
        on:irAPublicar={irAPublicar} 
        on:irAChats={irAChats}
      />

    <!-- ── MODIFICADO: muestra loading mientras carga por URL ── -->
    {:else if vistaActual === 'publicacion'}
      {#if mascotaSeleccionada}
        <Publicacion 
          mascota={mascotaSeleccionada} 
          on:volver={irABuscar} 
          on:irAChat={irAChat}
        />
      {:else}
        <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
          <p style="font-family:Poppins; color:#0D3B66; font-weight:600;">Cargando...</p>
        </div>
      {/if}

    {:else if vistaActual === 'publicar'}
      <Publicar 
        id_usuario={user_id}
        on:volver={() => navegar(vistaAnterior)} 
        on:publicado={irAInicio}
      />

    {:else if vistaActual === 'chats'}
      <Chats on:volver={irAInicio} on:abrirChat={irAChat} />

    {:else if vistaActual === 'chat'}
      <Chat contacto={contactoActivo} on:volver={irAChats} />

    {:else if vistaActual === 'perfil'}
      {#if subVista === 'editar_perfil' && sesionActiva}
        <EditarPerfil user_id={user_id ?? 0} on:volver={irAInicio} />
      {:else if subVista === 'crear_cuenta'}
        <CrearCuenta on:volver={() => navegar('perfil', 'iniciar_sesion')} />
      {:else}
        <IniciarSesion 
          mensajeAlerta={(!sesionActiva && subVista === 'editar_perfil') ? "Primero debes acceder a tu cuenta" : ""}
          on:irACrearCuenta={() => navegar('perfil', 'crear_cuenta')}
          on:loginExitoso={() => { sesionActiva = true; navegar('perfil', 'editar_perfil'); }} 
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