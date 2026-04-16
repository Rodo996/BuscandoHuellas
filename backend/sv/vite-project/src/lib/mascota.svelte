<script>
 let { nombre="Remy" } = $props();

 function handleInput(evento) {
      console.log("Tecleaste...");     
 }

</script>
<div><h1>Mascota: <span id='nombreMascota'>{nombre}</span></h1></div>
<input oninput={handleInput} type='text' id='myInput'>

