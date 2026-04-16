<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    function ingresar() {
        dispatch('ingresar');
    }

    function irARegistro() {
        dispatch('irARegistro');
    }
</script>

<div class="app-container">
    <div class="curved-header">
        <div class="logo-container">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="2,17 18,4 34,17" stroke="#F4D35E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <rect x="7" y="16" width="22" height="16" rx="1" stroke="#F4D35E" stroke-width="2.5" fill="none"/>
                <ellipse cx="12.5" cy="21" rx="1.3" ry="1.8" transform="rotate(-20 12.5 21)" fill="#F4D35E"/>
                <ellipse cx="15.8" cy="19.5" rx="1.3" ry="1.8" transform="rotate(-6 15.8 19.5)" fill="#F4D35E"/>
                <ellipse cx="19.2" cy="19.5" rx="1.3" ry="1.8" transform="rotate(6 19.2 19.5)" fill="#F4D35E"/>
                <ellipse cx="22.5" cy="21" rx="1.3" ry="1.8" transform="rotate(20 22.5 21)" fill="#F4D35E"/>
                <ellipse cx="17.5" cy="25.5" rx="3.2" ry="2.4" fill="#F4D35E"/>
            </svg>
            <span class="text-white">Buscando</span><span class="text-yellow">Huellas</span>
        </div>
    </div>

    <div class="login-content">
        <div class="welcome-text">
            <h1>Bienvenido de nuevo,</h1>
            <p>Ingresa los siguientes datos para iniciar sesión</p>
        </div>

        <form on:submit|preventDefault={ingresar} class="login-form">
            <div class="input-group">
                <label for="email">Correo electrónico</label>
                <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input type="email" id="email" bind:value={email} placeholder="Ej. juan@gmail.com" required />
                </div>
            </div>

            <div class="input-group">
                <label for="password">Contraseña</label>
                <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input type="password" id="password" bind:value={password} placeholder="Ej. **********" required />
                </div>
            </div>

            <div class="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="btn-primary">Ingresar</button>
        </form>

        <div class="divider">
            <span>o</span>
        </div>

        <button class="btn-google" type="button">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.918H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C10.0121 25.6514 10.0121 22.3683 11.0051 19.4192V13.2373H3.02419C-0.804263 20.8305 -0.804263 27.1893 3.02419 34.7825L11.0051 28.6006Z" fill="#FBBC05"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2005 2.18688 30.4214 -0.068982 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2207L11.0139 19.4025C12.8923 13.7233 18.2099 9.49932 24.48 9.49932Z" fill="#EA4335"/>
            </svg>
            Continua con Google
        </button>

        <div class="register-link">
            <p>¿No tienes una cuenta? <span class="highlight" on:click={irARegistro}>Registrate</span></p>
        </div>
    </div>
</div>

<style>
    /* Estructura Base */
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        max-width: 400px;
        margin: 0 auto;
        background-color: #ffffff;
        position: relative;
    }

    /* Header Curvo Azul */
    .curved-header {
        background: #0d3b66;
        padding: 40px 20px 30px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* Curva exacta basada en la imagen */
        border-radius: 0 0 35px 35px;
    }
    .logo-container {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;
        font-weight: 700;
        font-family: "Poppins", sans-serif;
    }
    .text-white { color: #ffffff; }
    .text-yellow { color: #f4d35e; }

    /* Contenedor del Formulario */
    .login-content {
        padding: 40px 24px 30px 24px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    /* Títulos */
    .welcome-text {
        margin-bottom: 30px;
    }
    .welcome-text h1 {
        color: #0D3B66;
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        margin: 0 0 6px 0;
    }
    .welcome-text p {
        color: #6B7280;
        font-size: 13px;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        margin: 0;
    }

    /* Formulario e Inputs */
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .input-group label {
        color: #111827;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
    }
    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }
    .input-wrapper input {
        width: 100%;
        padding: 14px 14px 14px 44px;
        background-color: #F9FAFB;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: #111827;
        outline: none;
        transition: border-color 0.2s;
    }
    .input-wrapper input:focus {
        border-color: #F4D35E;
    }
    .input-wrapper input::placeholder {
        color: #9CA3AF;
        font-weight: 400;
    }
    .input-icon {
        position: absolute;
        left: 14px;
        color: #9CA3AF;
    }

    /* Olvidé contraseña */
    .forgot-password {
        display: flex;
        justify-content: flex-end;
        margin-top: -4px;
        margin-bottom: 8px;
    }
    .forgot-password a {
        color: #FBBF24;
        font-size: 13px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        text-decoration: none;
    }

    /* Botón Principal */
    .btn-primary {
        background-color: #F4D35E;
        color: #111827;
        border: none;
        padding: 16px;
        border-radius: 12px;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(244, 211, 94, 0.3);
    }

    /* Separador "o" */
    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 24px 0;
        color: #9CA3AF;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
    }
    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #E5E7EB;
    }
    .divider span {
        padding: 0 16px;
    }

    /* Botón Google */
    .btn-google {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background-color: #ffffff;
        color: #374151;
        border: 1px solid #E5E7EB;
        padding: 14px;
        border-radius: 12px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .btn-google:hover {
        background-color: #F9FAFB;
    }

    /* Enlace final (Registro) */
    .register-link {
        margin-top: auto;
        padding-top: 40px;
        text-align: center;
    }
    .register-link p {
        color: #6B7280;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        margin: 0;
    }
    .highlight {
        color: #FBBF24;
        font-weight: 700;
        cursor: pointer;
        margin-left: 4px;
    }
</style>