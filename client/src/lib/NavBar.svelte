<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let vistaActiva = 'inicio';
</script>

<nav class="bottom-nav">

  <button
    class="nav-item"
    class:active={vistaActiva === 'inicio'}
    on:click={() => dispatch('irAInicio')}
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
    <span>Inicio</span>
  </button>

  <button
    class="nav-item"
    class:active={vistaActiva === 'buscar'}
    on:click={() => dispatch('irABuscar')}
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <span>Buscar</span>
  </button>

  <button
    class="nav-fab"
    on:click={() => dispatch('irAPublicar')}
    type="button"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827"
      stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>

  <button 
    class="nav-item" 
    class:active={vistaActiva === 'chats' || vistaActiva === 'chat'} 
    on:click={() => dispatch('irAChats')}
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span>Chats</span>
  </button>

  <button
    class="nav-item"
    class:active={vistaActiva === 'perfil'}
    on:click={() => dispatch('irAPerfil')}
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
    <span>Perfil</span>
  </button>

</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
    background: #fffefc;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 12px 0 20px 0;
    z-index: 100;
    border-radius: 20px 20px 0 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #9ca3af;
    font-size: 10px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-item.active {
    color: #fbbf24;
  }

  .nav-fab {
    background: #fbbf24;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid #ffffff;
    transform: translateY(-25px);
    box-shadow: 0px 4px 10px rgba(0,0,0,0.15);
    cursor: pointer;
  }
</style>