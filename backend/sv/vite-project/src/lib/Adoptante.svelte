<script>
let  adoptantes= $state([]);
let nombreAdoptante=$state("");
const getAdoptantes = async () => {
   const response = await fetch("http://localhost:1984/api/donantes");
   const data = await response.json();
   adoptantes = data;
   console.log(adoptantes);
 };
const addAdoptantes = async () => {
   adoptantes.push({id: 100,nombre: nombreAdoptante});
   /*const response = await fetch("http://localhost:1984/api/addadoptantes", {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ nombre: nombreDonante }),
     });
   const data = await response.json();
   console.log(data);*/
 };

</script>
<input  bind:value={nombreAdoptante} type='text' >


<ul>
 {#each adoptantes as adoptante}
   <li><span >{adoptante.id}</span>{adoptante.nombre}</li>
 {/each}
</ul>
<button onclick={addAdoptantes}>Añadir adoptante</button>
<button onclick={getAdoptantes}>Traer desde express los datos</button>




