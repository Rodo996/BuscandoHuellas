<script>
import { onMount, onDestroy } from 'svelte';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';


let mapDiv;
let map;
let zoom=$state(10);
let {lat, lng} = $props();

onMount(() => {
    if (mapDiv) {
      map = L.map(mapDiv).setView([lat, lng], zoom);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    
    map.on('click', onMapClick);
    }
  });

onDestroy(() => {
     if (map) {
       map.remove();
     }
   });

   function onMapClick() {
    console.log('Mapa clickeado');
  }
</script>
<div bind:this={mapDiv} style="width: 100%; height: 300px;"></div>

