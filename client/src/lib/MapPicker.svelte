<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let lat = 20.6597;
    export let lng = -103.3496;
    export let zoom = 13;
    export let readonly = false; // true en Chat para mostrar el pin
    export let showSearch = true; // false si no se necesita buscador

    let mapEl;
    let map;
    let marker;
    let L;
    let searchQuery = "";
    let searchResults = [];
    let buscando = false;

    onMount(async () => {
        L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");

        // Fix de ícono roto en Vite
        const LIcon = L["Icon"]["Default"];
        delete LIcon.prototype["_getIconUrl"];
        LIcon.mergeOptions({
            iconRetinaUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        if (!readonly && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    lat = pos.coords.latitude;
                    lng = pos.coords.longitude;
                    map.setView([lat, lng], zoom);
                    marker.setLatLng([lat, lng]);
                    emitir(lat, lng);
                },
                () => {
                    // Si el usuario niega el permiso, queda con las coordenadas default
                },
            );
        }

        map = L.map(mapEl).setView([lat, lng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);

        // Pin inicial
        marker = L.marker([lat, lng], { draggable: !readonly }).addTo(map);

        if (!readonly) {
            // Click en el mapa mueve el pin
            map.on("click", (e) => {
                const { lat: newLat, lng: newLng } = e.latlng;
                marker.setLatLng([newLat, newLng]);
                emitir(newLat, newLng);
            });

            // Arrastrar el pin también lo mueve
            marker.on("dragend", () => {
                const { lat: newLat, lng: newLng } = marker.getLatLng();
                emitir(newLat, newLng);
            });
        }
    });

    $: if (map && marker && lat && lng) {
        map.setView([lat, lng], zoom);
        marker.setLatLng([lat, lng]);
    }

    async function emitir(latVal, lngVal) {
        // Reverse geocoding con Nominatim (dado un punto (lat, lng), te dice qué calle/lugar es ese punto)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lngVal}&format=json`,
                { headers: { "Accept-Language": "es" } },
            );
            const data = await res.json();
            dispatch("ubicacion", {
                lat: latVal,
                lng: lngVal,
                address: data.display_name ?? "",
                postcode: data.address?.postcode ?? "",
                municipality:
                    data.address?.municipality ??
                    data.address?.city ??
                    data.address?.town ??
                    data.address?.village ??
                    "",
            });
        } catch {
            dispatch("ubicacion", {
                lat: latVal,
                lng: lngVal,
                address: "",
                postcode: "",
            });
        }
    }

    async function buscarDireccion() {
        if (!searchQuery.trim()) return;
        buscando = true;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=mx`,
                { headers: { "Accept-Language": "es" } },
            );
            searchResults = await res.json();
        } finally {
            buscando = false;
        }
    }

    function seleccionarResultado(r) {
        const newLat = parseFloat(r.lat);
        const newLng = parseFloat(r.lon);
        map.setView([newLat, newLng], 16);
        marker.setLatLng([newLat, newLng]);
        searchResults = [];
        searchQuery = r.display_name;
        emitir(newLat, newLng);
    }

    onDestroy(() => {
        map?.remove();
    });
</script>

{#if showSearch && !readonly}
    <div class="map-search">
        <div class="map-search-row">
            <input
                class="map-search-input"
                type="text"
                placeholder="Buscar dirección..."
                bind:value={searchQuery}
                on:keydown={(e) => e.key === "Enter" && buscarDireccion()}
            />
            <button
                class="map-search-btn"
                type="button"
                on:click={buscarDireccion}
            >
                {#if buscando}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="white"
                            stroke-width="2.5"
                            stroke-dasharray="28"
                            stroke-dashoffset="10"
                            style="transform-origin:center; animation: spin 0.8s linear infinite"
                        />
                    </svg>
                {:else}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle
                            cx="10.5"
                            cy="10.5"
                            r="6.5"
                            stroke="white"
                            stroke-width="2"
                        />
                        <path
                            d="M15.5 15.5L20 20"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                {/if}
            </button>
        </div>
        {#if searchResults.length > 0}
            <ul class="map-results">
                {#each searchResults as r}
                    <li>
                        <button
                            type="button"
                            on:click={() => seleccionarResultado(r)}
                        >
                            {r.display_name}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
{/if}

<div bind:this={mapEl} class="map-container"></div>

<style>
    .map-container {
        width: 100%;
        height: 220px;
        border-radius: 12px;
        border: 1.5px solid #e8e8ce;
        overflow: hidden;
        isolation: isolate;
        position: relative;
        z-index: 0;
    }
    .map-search {
        position: relative;
        margin-bottom: 8px;
    }
    .map-search-row {
        display: flex;
        gap: 6px;
    }
    .map-search-input {
        flex: 1;
        background: #faf9f0;
        border: 1.5px solid #e8e8ce;
        border-radius: 10px;
        padding: 10px 14px;
        font-family: "Poppins", sans-serif;
        font-size: 13px;
        outline: none;
    }
    .map-search-btn {
        background: #0d3b66;
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0 14px;
        cursor: pointer;
        font-size: 15px;
    }
    .map-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1.5px solid #e8e8ce;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        z-index: 999;
        list-style: none;
        padding: 4px;
        max-height: 200px;
        overflow-y: auto;
    }
    .map-results li button {
        width: 100%;
        text-align: left;
        padding: 8px 12px;
        border: none;
        background: transparent;
        font-family: "Poppins", sans-serif;
        font-size: 12px;
        color: #0d3b66;
        cursor: pointer;
        border-radius: 8px;
    }
    .map-results li button:hover {
        background: #f3f4f6;
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
