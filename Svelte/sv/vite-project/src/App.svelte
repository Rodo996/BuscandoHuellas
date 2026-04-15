<script>
  import Inicio from './lib/Inicio.svelte'; 
  import Buscar from './lib/Buscar.svelte';
  import Publicacion from './lib/Publicacion.svelte';

  let vistaActual = 'inicio';
  let mascotaSeleccionada = null; // Guardará la mascota elegida

  // Funciones para navegar
  const irAInicio = () => vistaActual = 'inicio';
  const irABuscar = () => vistaActual = 'buscar';
  
  const irAPublicacion = (event) => {
    mascotaSeleccionada = event.detail; // Recibimos la mascota desde Buscar
    vistaActual = 'publicacion';
  };
</script>

<main>
  {#if vistaActual === 'inicio'}
    <Inicio on:irABuscar={irABuscar} />
  {:else if vistaActual === 'buscar'}
    <Buscar on:volver={irAInicio} on:verPublicacion={irAPublicacion} />
  {:else if vistaActual === 'publicacion'}
    <Publicacion mascota={mascotaSeleccionada} on:volver={irABuscar} />
  {/if}
</main>

<style>
  main {
    margin: 0;
    padding: 0;
  }
</style>