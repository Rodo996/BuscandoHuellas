// src/lib/contactos.js
// Fuente temporal hasta tener API real.
// Tanto Chats.svelte como App.svelte importan desde aquí.

export const listaContactos = [
    { id: 1, nombre: "Laura García",pet_id: 40, color: "#1A5C8C" },
    { id: 2, nombre: "Rodolfo", pet_id: 2,      color: "#9CA3AF" },
    { id: 3, nombre: "Christian", pet_id: 3,    color: "#FBBF24" },
    { id: 4, nombre: "Maria", pet_id: 4,         color: "#C2410C" },
    { id: 5, nombre: "Andrea", pet_id: 5,        color: "#ED1A1A" },
    { id: 6, nombre: "Carlos", pet_id: 6,        color: "#1ABFD2" },
    { id: 7, nombre: "Roberto", pet_id: 7,       color: "#24FB32" },
    { id: 8, nombre: "Diego", pet_id: 8,         color: "rgba(13,59,102,0.6)" }
];

// Colores de fallback para contactos nuevos
const COLORES_FALLBACK = [
    "#1A5C8C", "#9CA3AF", "#FBBF24", "#C2410C",
    "#ED1A1A", "#1ABFD2", "#24FB32", "#6D28D9"
];

/**
 * Busca un contacto por nombre del dueño.
 * Si no existe, lo crea y lo agrega a la lista (persistencia en memoria).
 * Retorna el objeto contacto listo para abrir el chat.
 */
export function obtenerOCrearContacto(nombreDueno, petId = null) {
    const existente = listaContactos.find(
        c => c.nombre.toLowerCase() === nombreDueno?.toLowerCase()
    );
    if (existente) return existente;

    // Crear contacto nuevo
    const nuevoId = listaContactos.length + 1;
    const color = COLORES_FALLBACK[nuevoId % COLORES_FALLBACK.length];
    const nuevo = {
        id: nuevoId,
        nombre: nombreDueno ?? "Usuario",
        pet_id: petId,
        color
    };
    listaContactos.push(nuevo);
    return nuevo;
}