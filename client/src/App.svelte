<script>
  import Inicio from "./lib/Inicio.svelte";
  import Buscar from "./lib/Buscar.svelte";
  import Publicacion from "./lib/Publicacion.svelte";
  import Publicar from "./lib/Publicar.svelte";
  import IniciarSesion from "./lib/Iniciar_sesion.svelte";
  import CrearCuenta from "./lib/Crear_cuenta.svelte";
  import EditarPerfil from "./lib/Editar_perfil.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Chats from "./lib/Chats.svelte";
  import Chat from "./lib/Chat.svelte";
  import CasosExito from "./lib/Caso_exito.svelte";
  import FichaExito from "./lib/Ficha_exito.svelte";
  import CasoCerrado from "./lib/Caso_cerrado.svelte";
  import { onMount } from "svelte";

  const API = "http://localhost:3000/api";
  let noLeidas = 0;
  let user_id = null;

  let path = window.location.pathname;
  let partes = path.split("/").filter((p) => p !== "");
  let vistaActual = partes[0] || "inicio";
  let subVista = partes[1] || "";
  let vistaAnterior = "inicio";
  let mascotaSeleccionada = null;
  let sesionActiva = false;
  let casoSeleccionado = null;
  let contactoActivo = null;
  let cargandoContacto = false;

  function navegar(vista, sub = "") {
    vistaAnterior = vistaActual;
    vistaActual = vista;
    subVista = sub;
    const url = sub ? `/${vista}/${sub}` : `/${vista}`;
    const urlFinal = vista === "inicio" ? "/" : url;
    history.pushState({}, "", urlFinal);
  }

  const irAInicio = () => navegar("inicio");
  const irABuscar = () => navegar("buscar");
  const verCasosExito = () => navegar("casos_exito");
  const irAPublicar = () => { vistaAnterior = vistaActual; navegar("publicar"); };
  const irAPerfil = () => {
    noLeidas = 0;
    if (sesionActiva) navegar("perfil", "editar_perfil");
    else navegar("perfil", "iniciar_sesion");
  };
  
  // Guardamos la vista anterior por si el usuario cancela el login de chats
  const irAChats = () => { vistaAnterior = vistaActual; navegar("chats"); };
  
  const irAChat = (event) => {
    vistaAnterior = vistaActual;
    // Guardamos vista por si requiere login
    if (event && event.detail) contactoActivo = event.detail;
    else contactoActivo = { nombre: "Dueño", color: "#F4D35E" };
    navegar("chat", contactoActivo.id);
  };

  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail;
    navegar("publicacion", mascotaSeleccionada.id);
  };

  window.onpopstate = () => {
    const p = window.location.pathname.split("/").filter((p) => p !== "");
    vistaActual = p[0] || "inicio";
    subVista = p[1] || "";
  };

  async function cargarNotificaciones() {
    if (!user_id) return;
    try {
      const res = await fetch(`${API}/notifications/${user_id}`);
      const data = await res.json();
      noLeidas = data.filter((n) => !n.is_read).length;
    } catch {}
  }

  onMount(() => {
    (async () => {
      cargarNotificaciones();

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

      if (vistaActual === "chat" && subVista) {
        cargandoContacto = true;
        try {
            const res = await fetch(`${API}/chats/${subVista}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const chat = data.find(c => c.other_user_id === Number(subVista));
            contactoActivo = chat ? {
                id: chat.other_user_id,
                chat_id: chat.chat_id,
                nombre: chat.other_user_name,
                color: '#1A5C8C'
            } : null;
            if (!contactoActivo) navegar('chats');
        } catch {
            navegar('chats');
        } finally {
            cargandoContacto = false;
        }
     }
    })();

    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  });
  $: console.log('user_id en App:', user_id);
</script>

<main>
  <div class="app-container">
    {#if vistaActual === "inicio"}
      <Inicio
        on:irABuscar={irABuscar}
        on:irAPublicar={irAPublicar}
        on:irAChats={irAChats}
        on:verCasosExito={verCasosExito}
        on:verHistoria={(e) => { casoSeleccionado = e.detail; navegar("ficha_exito"); }}
      />

    {:else if vistaActual === "caso_cerrado"}
      <CasoCerrado
        pet_id={mascotaSeleccionada?.pet_id || mascotaSeleccionada?.id || contactoActivo?.pet_id}
        on:volver={() => navegar("publicacion")}
        on:exitoPublicado={() => navegar("casos_exito")}
      />

    {:else if vistaActual === "buscar"}
      <Buscar
        on:volver={irAInicio}
        on:verPublicacion={irAPublicacion}
        on:irAPublicar={irAPublicar}
        on:irAChats={irAChats}
      />

    {:else if vistaActual === "casos_exito"}
      <CasosExito
        on:volver={irAInicio}
        on:verCasosExito={verCasosExito}
        on:verHistoria={(e) => { casoSeleccionado = e.detail; navegar("ficha_exito"); }}
      />

    {:else if vistaActual === "ficha_exito"}
      <FichaExito caso={casoSeleccionado} on:volver={() => navegar("casos_exito")} />

    {:else if vistaActual === "publicacion"}
      {#if mascotaSeleccionada}
        <Publicacion
          mascota={mascotaSeleccionada}
          {user_id}
          on:volver={irABuscar}
          on:irAChat={irAChat}
          on:cerrarCaso={() => navegar("caso_cerrado")}
        />
      {:else}
        <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
          <p style="font-family:Poppins; color:#0D3B66; font-weight:600;">Cargando...</p>
        </div>
      {/if}

    {:else if vistaActual === "publicar"}
      {#if sesionActiva && user_id}
        <Publicar
          id_usuario={user_id}
          on:volver={() => navegar(vistaAnterior)}
          on:publicado={irAInicio}
        />
      {:else}
        <IniciarSesion
          mensajeAlerta="Debes iniciar sesión para publicar"
          on:irACrearCuenta={() => navegar("perfil", "crear_cuenta")}
          on:loginExitoso={(e) => { sesionActiva = true; user_id = e.detail.user_id; sessionStorage.setItem('user_id', user_id); navegar("publicar"); }}
          on:volver={() => navegar(vistaAnterior)}
        />
      {/if}

    {:else if vistaActual === "chats"}
      {#if sesionActiva && user_id}
        <Chats {user_id} on:volver={irAInicio} on:abrirChat={irAChat} />
      {:else}
        <IniciarSesion
          mensajeAlerta="Debes iniciar sesión para acceder a chats"
          on:irACrearCuenta={() => navegar("perfil", "crear_cuenta")}
          on:loginExitoso={(e) => { sesionActiva = true; user_id = e.detail.user_id; navegar("chats"); }}
          on:volver={() => navegar(vistaAnterior)}
        />
      {/if}

    {:else if vistaActual === "chat"}
      {#if sesionActiva && user_id}
        {#if cargandoContacto}
          <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
            <p style="font-family:Poppins; color:#0D3B66; font-weight:600;">Cargando...</p>
          </div>
        {:else}
          <Chat contacto={contactoActivo} {user_id} on:volver={irAChats} on:cerrarCaso={() => navegar("caso_cerrado")} />
        {/if}
      {:else}
        <IniciarSesion
          mensajeAlerta="Debes iniciar sesión para acceder a chats"
          on:irACrearCuenta={() => navegar("perfil", "crear_cuenta")}
          on:loginExitoso={(e) => { sesionActiva = true; user_id = e.detail.user_id; navegar("chat", subVista); }}
          on:volver={() => navegar(vistaAnterior)}
        />
      {/if}

    {:else if vistaActual === "perfil"}
      {#if subVista === "editar_perfil" && sesionActiva}
        <EditarPerfil user_id={user_id ?? 0} on:volver={irAInicio} />
      {:else if subVista === "crear_cuenta"}
        <CrearCuenta on:volver={() => navegar("perfil", "iniciar_sesion")} />
      {:else}
        <IniciarSesion
          mensajeAlerta={!sesionActiva && subVista === "editar_perfil" ? "Primero debes acceder a tu cuenta" : ""}
          on:irACrearCuenta={() => navegar("perfil", "crear_cuenta")}
          on:loginExitoso={(e) => { sesionActiva = true; user_id = e.detail.user_id; navegar("perfil", "editar_perfil"); }}
          on:volver={irAInicio}
        />
      {/if}
    {/if}
  </div>

  <Navbar
    vistaActiva={vistaActual}
    {noLeidas}
    on:irAInicio={irAInicio}
    on:irABuscar={irABuscar}
    on:irAPublicar={irAPublicar}
    on:irAPerfil={irAPerfil}
    on:irAChats={irAChats}
  />
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");

  :global(html), :global(body) {
    width: 100%;
    margin: 0;
    padding: 0;
    min-height: 100dvh;
    font-family: "Poppins", sans-serif;
    background-color: #f3f4f6;
  }
  :global(*) { box-sizing: border-box; }
  :global(.app-container) {
    width: 100%;
    max-width: 400px;
    margin-inline: auto;
    background: #ffffff;
    min-height: 100vh;
    position: relative;
    padding-bottom: 50px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow-x: clip;
  }

  @media (max-width: 400px) {
    :global(.app-container) { box-shadow: none; }
  }
  @media (min-width: 401px) {
    :global(body) { background-color: #f3f4f6; }
  }
</style>