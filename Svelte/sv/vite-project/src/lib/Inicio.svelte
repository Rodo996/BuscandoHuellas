<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div class="app-container">
  <div class="top-brand-header">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 10.5H5V20H19V10.5H22L12 2Z" stroke="#F4D35E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="#F4D35E"/>
    </svg>
    <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
  </div>

  <div class="hero-section">
    <div class="hero-content">
      <h2>Encuentra a tu mejor amigo</h2>
      <div class="search-container" on:click={() => dispatch('irABuscar')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span class="search-placeholder">Buscar...</span>
      </div>
    </div>
  </div>

  <div class="report-section">
    <div class="report-card">
      <img src="/Img-Inicio/GatoRec5Figma.png" alt="Gato perdido" class="report-img"/>
      <div class="report-info">
        <h3>¿Puedes ayudar a alguien perdido?</h3>
        <button class="report-btn">
          <img src="/Img-Inicio/reporte.png" alt="Icono" style="width: 20px; height: 20px;"/>
          Reportar
        </button>
      </div>
    </div>
  </div>

  <div class="success-section">
    <div class="success-header">
      <h2>Casos de éxito</h2>
      <a href="#" class="view-all">Ver todos</a>
    </div>
    <div class="success-grid">
      <div class="success-card">
        <img src="/Img-Inicio/messi.jpg" alt="Messi" />
        <div class="success-content">
          <h4>Messi</h4>
          <span class="tag-encontrado">¡Encontrado!</span>
          <button class="btn-historia">Ver historia</button>
        </div>
      </div>
      <div class="success-card">
        <img src="/Img-Inicio/juan.png" alt="Juan" />
        <div class="success-content">
          <h4>Juan</h4>
          <span class="tag-encontrado">¡Encontrado!</span>
          <button class="btn-historia">Ver historia</button>
        </div>
      </div>
    </div>
  </div>

  <footer class="footer">
    <div class="footer-brand">
      <span class="text-dark">Buscando</span><span class="text-yellow">Huellas</span>
    </div>
    <p class="footer-desc">Ayudando a reunir familias peludas mexicanas.</p>
    
    <div class="footer-links">
      <div class="link-column">
        <h5>Comunidad</h5>
        <a href="#">Voluntariado</a>
        <a href="#">Blog</a>
        <a href="#">Historias</a>
      </div>
      <div class="link-column">
        <h5>Legal</h5>
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <a href="#">Contacto</a>
      </div>
    </div>

    <div class="social-icons">
      <div class="icon-circle blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></div>
      <div class="icon-circle pink"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div>
    </div>
    <p class="copyright">© 2026 Mascota Perdida. Todos los derechos reservados.</p>
  </footer>

  <nav class="bottom-nav">
    <div class="nav-item active">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <span>Inicio</span>
    </div>
    <div class="nav-item" on:click={() => dispatch('irABuscar')} style="cursor: pointer;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <span>Buscar</span>
    </div>
    <div class="nav-fab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </div>
    <div class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span>Chats</span>
    </div>
    <div class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span>Perfil</span>
    </div>
  </nav>
</div>

<style>
  :global(body) { background-color: #F3F4F6; margin: 0; display: flex; justify-content: center; font-family: 'Poppins', sans-serif; }
  * { box-sizing: border-box; }
  
  .app-container { width: 100%; max-width: 400px; background: #FFFFFF; min-height: 100vh; position: relative; padding-bottom: 90px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); overflow-x: hidden;}
  
  /* Header */
  .top-brand-header { background: #0D3B66; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 20px 0; font-size: 22px; font-weight: 700; }
  .text-white { color: #FFFFFF; } .text-yellow { color: #F4D35E; } .text-dark { color: #111827; }
  
  /* Hero Section */
  .hero-section { background-image: url('/Img-Inicio/perroInicio.jpg'); background-size: cover; background-position: center; height: 260px; position: relative; display: flex; justify-content: center; align-items: center; }
  .hero-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(13, 59, 102, 0.4); } /* Capa oscura para que resalte la letra */
  .hero-content { position: relative; z-index: 2; width: 100%; padding: 0 30px; text-align: center; }
  .hero-content h2 { color: #FAF0CA; font-size: 28px; line-height: 1.2; font-weight: 700; margin: 0 0 20px 0; text-shadow: 0px 2px 4px rgba(0,0,0,0.5); }
  
  .search-container { background: white; border-radius: 50px; padding: 12px 20px; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0px 4px 15px rgba(0,0,0,0.15); transform: translateY(30px); }
  .search-placeholder { color: #9CA3AF; font-size: 14px; font-weight: 500; }
  
  /* Report Card */
  .report-section { padding: 40px 20px 20px 20px; background: #F3F4F6; }
  .report-card { background: white; border-radius: 20px; display: flex; box-shadow: 0px 4px 10px rgba(0,0,0,0.08); overflow: hidden; }
  .report-img { width: 130px; height: 130px; object-fit: cover; }
  .report-info { padding: 16px; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
  .report-info h3 { margin: 0; color: #0D3B66; font-size: 15px; font-weight: 700; line-height: 1.3; text-align: center; }
  .report-btn { background: #F4D35E; border: none; border-radius: 12px; padding: 8px 16px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; display: flex; justify-content: center; align-items: center; gap: 8px; cursor: pointer; }

  /* Casos Éxito */
  .success-section { background: #FEFCE8; padding: 24px 20px; }
  .success-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .success-header h2 { margin: 0; font-size: 18px; color: #111827; font-weight: 700; }
  .view-all { font-size: 12px; color: #FBBF24; font-weight: 600; text-decoration: underline; }
  
  .success-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .success-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0px 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
  .success-card img { width: 100%; height: 120px; object-fit: cover; }
  .success-content { padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .success-content h4 { margin: 0; font-size: 14px; color: #111827; font-weight: 700; }
  .tag-encontrado { background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 12px; }
  .btn-historia { border: 1px solid #FBBF24; background: transparent; color: #FBBF24; border-radius: 12px; padding: 4px 12px; font-size: 10px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; }

  /* Footer */
  .footer { background: #F3F4F6; padding: 32px 24px; border-radius: 24px 24px 0 0; }
  .footer-brand { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .footer-desc { color: #6B7280; font-size: 13px; margin: 0 0 24px 0; }
  .footer-links { display: flex; justify-content: space-between; margin-bottom: 24px; padding-right: 40px;}
  .link-column { display: flex; flex-direction: column; gap: 8px; }
  .link-column h5 { margin: 0; font-size: 14px; font-weight: 700; color: #1F2937; }
  .link-column a { color: #6B7280; font-size: 13px; text-decoration: none; }
  .social-icons { display: flex; gap: 12px; margin-bottom: 20px; }
  .icon-circle { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0px 2px 5px rgba(0,0,0,0.05); }
  .blue { color: #2563EB; } .pink { color: #DB2777; }
  .copyright { color: #9CA3AF; font-size: 11px; text-align: center; margin: 0; }

  /* Nav Inferior - ¡Con el FAB arreglado! */
  .bottom-nav { position: absolute; bottom: 0; width: 100%; background: #FFFEFC; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px 0; z-index: 100; border-radius: 20px 20px 0 0; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #9CA3AF; font-size: 10px; font-weight: 500; transition: color 0.2s ease; }
  .nav-item.active { color: #FBBF24; }
  .nav-fab { background: #FBBF24; width: 56px; height: 56px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 4px solid #FFFFFF; transform: translateY(-25px); box-shadow: 0px 4px 10px rgba(0,0,0,0.15); cursor: pointer; }
</style>