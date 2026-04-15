<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let searchQuery = "";
</script>

<div data-layer="Inicio" class="Inicio" style="width: 393px; height: 1350px; position: relative; background: #0D3B66; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); overflow: hidden; border-radius: 30px">
  <div data-layer="Rectangle 29" class="Rectangle29" style="width: 393px; height: 542px; left: 0px; top: 1175px; position: absolute; background: #F3F4F6"></div>
  <div data-layer="Rectangle 29" class="Rectangle29" style="width: 393px; height: 178px; left: 0px; top: 340px; position: absolute; background: #FAF0CA"></div>
  <div data-layer="Rectangle 1" class="Rectangle1" style="width: 100px; height: 100px; left: 211px; top: 429px; position: absolute"></div>
  <div data-svg-wrapper data-layer="Rectangle 3" class="Rectangle3" style="left: 0px; top: 93px; position: absolute">
    <svg width="393" height="246" viewBox="0 0 393 246" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H393V246H0V0Z" fill="black"/>
    </svg>
  </div>
  <img data-layer="15a9e77f448477d8ac7eb66513f86e8c 1" class="A9e77f448477d8ac7eb66513f86e8c1" style="width: 394px; height: 247px; left: 0px; top: 92px; position: absolute; opacity: 0.67" src="/Img-Inicio/perroInicio.jpg" alt="Perro inicio" />
  
  <div class="search-container" on:click={() => dispatch('irABuscar')} style="cursor: pointer;">
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.6 18L18.3 11.7C19.3 10.4 20 8.8 20 7C20 3.1 16.9 0 13 0C9.1 0 6 3.1 6 7C6 10.9 9.1 14 13 14C14.8 14 16.4 13.3 17.7 12.3L24 18.6L24.6 18ZM8 7C8 4.2 10.2 2 13 2C15.8 2 18 4.2 18 7C18 9.8 15.8 12 13 12C10.2 12 8 9.8 8 7Z" fill="#9CA3AF"/> 
    </svg>
    <div class="search-input" style="color: #9CA3AF; line-height: 1.5;">Buscar...</div>
  </div>

  <div data-layer="Encuentra a tu mejor amigo" class="EncuentraATuMejorAmigo" style="width: 321px; height: 80px; left: 34px; top: 100px; position: absolute; justify-content: center; display: flex; flex-direction: column; color: #FAF0CA; font-size: 32px; font-family: Poppins; font-weight: 700; word-wrap: break-word">Encuentra a tu mejor amigo</div>
  <div data-layer="Rectangle 4" class="Rectangle4" style="width: 322px; height: 140px; left: 38px; top: 353px; position: absolute; background: linear-gradient(180deg, white 0%, white 100%); box-shadow: 0px 4px 6px 6px rgba(0, 0, 0, 0.25); border-radius: 25px"></div>
  <img data-layer="Rectangle 5" class="Rectangle5" style="width: 140px; height: 140px; left: 38px; top: 353px; position: absolute; box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.25); border-radius: 25px" src="/Img-Inicio/GatoRec5Figma.png" alt="Gato" />
  <div data-layer="¿Puedes ayudar a alguien perdido?" class="PuedesAyudarAAlguienPerdido" style="width: 150px; height: 35px; left: 190px; top: 358px; position: absolute; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #0D3B66; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">¿Puedes ayudar a alguien perdido?</div>
  <div data-layer="Reportar" class="Reportar" style="width: 150px; height: 35px; left: 190px; top: 458px; position: absolute; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #0D3B66; font-size: 16px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Reportar</div>
  <div data-svg-wrapper data-layer="Rectangle 6" class="Rectangle6" style="left: 235px; top: 402px; position: absolute;">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" rx="10" fill="#F4D35E"/>
    <img src="/Img-Inicio/reporte.png" alt="Reportar" style="position: absolute; top: 15px; left: 15px; width: 30px; height: 30px;">
    </svg>
  </div>
  
  <div data-layer="Rectangle 21" class="Rectangle21" style="width: 393px; height: 423px; left: 0px; top: 518px; position: absolute; background: #FEFCE8"></div>
  <div data-layer="Casos de éxito" class="CasosDeXito" style="width: 171px; height: 73px; left: 26px; top: 500px; position: absolute; justify-content: center; display: flex; flex-direction: column; color: black; font-size: 18px; font-family: Inter; font-weight: 700; line-height: 28px; word-wrap: break-word">Casos de éxito</div>
  
  <div data-layer="Background+Shadow" class="BackgroundShadow" style="width: 157px; height: 171px; left: 17px; top: 698px; position: absolute; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
    <div data-layer="Container" class="Container" style="align-self: stretch; height: 161px; padding: 12px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
      <div data-layer="Heading 4" class="Heading4" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
        <div data-layer="Messi" class="Messi" style="width: 44.03px; height: 20px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #111827; font-size: 14px; font-family: Poppins; font-weight: 700; line-height: 20px; word-wrap: break-word">Messi</div>
      </div>
      <div data-layer="Container" class="Container" style="width: 136px; height: 61px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: flex">
        <div data-layer="Background" class="Background" style="width: 90px; height: 15px; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #DCFCE7; border-radius: 9999px; justify-content: flex-start; align-items: center; gap: 3.99px; display: inline-flex">
          <div data-layer="¡Encontrado!" class="Encontrado" style="width: 64.53px; height: 15px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #15803D; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">¡Encontrado!</div>
        </div>
        <div data-layer="Button:margin" class="ButtonMargin" style="align-self: stretch; padding-top: 4px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
          <div data-layer="Button" class="Button" style="width: 103px; height: 21px; padding-left: 12px; padding-right: 12px; padding-top: 4px; padding-bottom: 4px; border-radius: 9999px; outline: 1px rgba(251, 191, 36, 0.30) solid; outline-offset: -1px; flex-direction: column; justify-content: center; align-items: center; display: flex">
            <div data-layer="Ver Historia" class="VerHistoria" style="width: 69.53px; height: 16px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #FBBF24; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 16px; word-wrap: break-word">Ver Historia</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div data-layer="Background+Shadow" class="BackgroundShadow" style="width: 156px; height: 171px; left: 220px; top: 698px; position: absolute; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
    <div data-layer="Container" class="Container" style="align-self: stretch; padding: 12px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
      <div data-layer="Heading 4" class="Heading4" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
        <div data-layer="Juan" class="Juan" style="width: 44.03px; height: 20px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #111827; font-size: 14px; font-family: Poppins; font-weight: 700; line-height: 20px; word-wrap: break-word">Juan</div>
      </div>
      <div data-layer="Container" class="Container" style="width: 136px; height: 61px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: flex">
        <div data-layer="Background" class="Background" style="width: 90px; height: 15px; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #DCFCE7; border-radius: 9999px; justify-content: flex-start; align-items: center; gap: 3.99px; display: inline-flex">
          <div data-layer="¡Encontrado!" class="Encontrado" style="width: 64.53px; height: 15px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #15803D; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">¡Encontrado!</div>
        </div>
        <div data-layer="Button:margin" class="ButtonMargin" style="align-self: stretch; padding-top: 4px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
          <div data-layer="Button" class="Button" style="width: 103px; height: 21px; padding-left: 12px; padding-right: 12px; padding-top: 4px; padding-bottom: 4px; border-radius: 9999px; outline: 1px rgba(251, 191, 36, 0.30) solid; outline-offset: -1px; flex-direction: column; justify-content: center; align-items: center; display: flex">
            <div data-layer="Ver historia" class="VerHistoria" style="width: 69.53px; height: 16px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #FBBF24; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 16px; word-wrap: break-word">Ver historia</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img data-layer="Rectangle 22" class="Rectangle22" style="width: 157px; height: 140px; left: 17px; top: 570px; position: absolute" src="/Img-Inicio/messi.jpg" alt="Messi"/>
  <img data-layer="Rectangle 23" class="Rectangle23" style="width: 156px; height: 140px; left: 220px; top: 570px; position: absolute" src="/Img-Inicio/juan.png" alt="Juan" />
  
  <div data-layer="Footer" class="Footer" style="width: 393px; height: 363px; padding-top: 32px; padding-bottom: 96px; padding-left: 24px; padding-right: 24px; left: 0px; top: 884px; position: absolute; background: #F3F4F6; border-top-left-radius: 24px; border-top-right-radius: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
    <div data-layer="Container" class="Container" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
      <div data-layer="Container" class="Container" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
        <div data-layer="Heading 4" class="Heading4" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
          <div data-layer="BuscandoHuellas" class="Buscandohuellas" style="align-self: stretch; justify-content: center; display: flex; flex-direction: column"><span style="color: #111827; font-size: 18px; font-family: Poppins; font-weight: 700; line-height: 28px; word-wrap: break-word">Buscando</span><span style="color: #FACC15; font-size: 18px; font-family: Poppins; font-weight: 700; line-height: 28px; word-wrap: break-word">Huellas</span></div>
        </div>
        <div data-layer="Container" class="Container" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
          <div data-layer="Ayudando a reunir familias peludas mexicanas." class="AyudandoAReunirFamiliasPeludasMexicanas" style="align-self: stretch; justify-content: center; display: flex; flex-direction: column; color: #6B7280; font-size: 14px; font-family: Poppins; font-weight: 400; line-height: 20px; word-wrap: break-word">Ayudando a reunir familias peludas mexicanas.</div>
        </div>
      </div>
      <div data-layer="Margin" class="Margin" style="align-self: stretch; padding-top: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div data-layer="Container" class="Container" style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
          <div data-layer="© 2026 Mascota Perdida. Todos los derechos reservados." class="2026MascotaPerdidaTodosLosDerechosReservados" style="width: 340.19px; height: 16px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #9CA3AF; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 16px; word-wrap: break-word">© 2026 Mascota Perdida. Todos los derechos reservados.</div>
        </div>
      </div>
    </div>
  </div>
  <div data-layer="Rectangle 2" class="Rectangle2" style="width: 393px; height: 97px; left: 0px; top: -4px; position: absolute; background: #0D3B66"></div>
  <div data-layer="Rectangle 24" class="Rectangle24" style="width: 393px; height: 97px; left: 135px; top: -6px; position: absolute; background: #0D3B66"></div>
  <div data-layer="Ver todos" class="VerTodos" style="width: 110px; height: 20px; left: 295px; top: 530px; position: absolute; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #F4D35E; font-size: 11px; font-family: Inter; font-weight: 600; text-decoration: underline; line-height: 10px; word-wrap: break-word">Ver todos</div>
  <div data-layer="Huellas" class="Huellas" style="width: 125px; height: 25px; left: 243px; top: 42px; position: absolute; text-align: center; color: #FAF0CA; font-size: 32px; font-family: Poppins; font-weight: 700; word-wrap: break-word">Huellas</div>
  <div data-layer="Buscando" class="Buscando" style="width: 166px; height: 22px; left: 78px; top: 42px; position: absolute; color: #F4D35E; font-size: 32px; font-family: Poppins; font-weight: 700; word-wrap: break-word">Buscando</div>
  
  <div data-layer="Nav" class="Nav" style="width: 393px; height: 112px; left: 0px; top: 1238px; position: absolute; background: #FFFEFC; border-top: 1px #E5E7EB solid">
    
    <div data-layer="Link" class="Link" style="left: 20.38px; top: 31.50px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
      <div data-svg-wrapper data-layer="Container" class="Container">
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z" fill="#FBBF24"/>
        </svg>
      </div>
      <div data-layer="Container" class="Container" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div data-layer="Text" class="Text" style="width: 26.80px; height: 15px; justify-content: center; display: flex; flex-direction: column; color: #FBBF24; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">Inicio</div>
      </div>
    </div>

    <div data-layer="Link" class="Link" on:click={() => dispatch('irABuscar')} style="left: 87.94px; top: 31.50px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex; cursor: pointer;">
      <div data-svg-wrapper data-layer="Container" class="Container">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#9CA3AF"/>
        </svg>
      </div>
      <div data-layer="Container" class="Container" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div data-layer="Text" class="Text" style="width: 34.75px; height: 15px; justify-content: center; display: flex; flex-direction: column; color: #9CA3AF; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">Buscar</div>
      </div>
    </div>
    
    <div data-layer="Link" class="Link" style="left: 274.22px; top: 30.50px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
      <div data-svg-wrapper data-layer="Container" class="Container">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.125L3.15 14ZM2 14V2V14Z" fill="#9CA3AF"/>
        </svg>
      </div>
      <div data-layer="Container" class="Container" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div data-layer="Text" class="Text" style="width: 30.06px; height: 15px; justify-content: center; display: flex; flex-direction: column; color: #9CA3AF; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">Chats</div>
      </div>
    </div>
    
    <div data-layer="Link" class="Link" style="left: 345.05px; top: 32.50px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
      <div data-svg-wrapper data-layer="Container" class="Container">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#9CA3AF"/>
        </svg>
      </div>
      <div data-layer="Container" class="Container" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div data-layer="Text" class="Text" style="width: 24.56px; height: 15px; justify-content: center; display: flex; flex-direction: column; color: #9CA3AF; font-size: 10px; font-family: Poppins; font-weight: 500; line-height: 15px; word-wrap: break-word">Perfil</div>
      </div>
    </div>
    
    <div data-layer="Container" class="Container" style="left: 163.45px; top: -2.75px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
      <div data-layer="Button" class="Button" style="padding: 16px; position: relative; background: #FBBF24; border-radius: 9999px; outline: 4px white solid; outline-offset: -4px; justify-content: center; align-items: center; display: inline-flex">
        <div data-svg-wrapper data-layer="Container" class="Container">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 10H0V7.5H7.5V0H10V7.5H17.5V10H10V17.5H7.5V10Z" fill="#111827"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Aquí van los estilos de la barra de búsqueda original */
  .search-container {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 9999px; 
    padding: 12px 16px;
    position: absolute; 
    top: 247px; 
    width: 90%; 
    max-width: 350px; 
    left: 50%; 
    transform: translateX(-50%); 
    z-index: 10; 
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
    gap: 12px;
  }

  .search-input {
    border: none;
    outline: none;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    color: #111827; 
    background: transparent;
  }

  .search-input::placeholder {
    color: #9CA3AF; 
  }
</style>