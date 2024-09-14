class entidadesDeSalud {
    constructor(nombre){
        this.nombre = nombre;
    }

    mostrarInfo(){
        console.log(`Nombre: ${this.nombre}`);
    }
}

// entidades disponibles para el usuario
const entidadesDisponibles = [
    new entidadesDeSalud("ColSanitas"),
    new entidadesDeSalud("SaludCop"),
    new entidadesDeSalud("Pediatric"),
];

// Llenar el dropdown al cargar la página
poblarDropdown();

// Recuperar datos guardados en LocalStorage
let iterador = parseInt(localStorage.getItem('iterador')) || 0; 

buttonHtml = document.querySelector(".send");

// Opciones de registro para agendar cita médica
function getOptions() {
    let Name = document.getElementById("name");
    let email = document.getElementById("email");
    let number = document.getElementById("number");
    const dropdown = document.getElementById("entidadesDropdown");
    const success = document.getElementById("success");
    const danger = document.getElementById("danger");

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    //  Imprimir el array de usuarios registrados
    console.log("Usuarios registrados en memoria:", usuariosRegistrados);
    console.log("Email a verificar:", email.value.trim());

    // Verificar si todos los campos están completos, incluyendo la selección del dropdown
    if (Name.value.trim() === "" || email.value.trim() === "" || number.value.trim() === "" || dropdown.value === "") {
        danger.innerText = "Por favor completa todos los campos";
        danger.style.display = 'block';
        success.style.display = 'none';
        return; // Salir de la función si no se cumplen las condiciones
    }

    const usuarioExistente = usuariosRegistrados.find(usuario => usuario.email === email.value.trim());

    if (usuarioExistente) {
        danger.innerText = "Ya se ha registrado anteriormente";
        danger.style.display = 'block';
        success.style.display = 'none';
    } else {
        // Si todos los campos están completos y el usuario no existe, registrar usuario
        usuariosRegistrados.push({
            name: Name.value.trim(),
            email: email.value.trim(),
            number: number.value.trim(),
            entidad: dropdown.options[dropdown.selectedIndex].text
        });

        // Guardar datos en LocalStorage
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

        // Incrementar contador y guardar en LocalStorage
        iterador++;
        localStorage.setItem('iterador', iterador);

        // Mostrar mensaje de éxito
        success.innerText = "Tu cita ha sido agendada con éxito!";
        success.style.display = 'block';
        danger.style.display = 'none';

        setTimeout(() => {
            // Limpiar los campos después de 4 segundos
            Name.value = "";
            email.value = "";
            number.value = "";
            dropdown.value = ""; // Resetear el dropdown
        }, 4000);
    }

    // Ocultar el mensaje de error después de 2 segundos
    setTimeout(() => {
        danger.style.display = 'none';
    }, 2000);
}

// Añadir eventos input para ocultar el mensaje de éxito cuando el usuario empiece a escribir
document.getElementById("name").addEventListener('input', () => {
    document.getElementById("success").style.display = 'none';
});
document.getElementById("email").addEventListener('input', () => {
    document.getElementById("success").style.display = 'none';
});
document.getElementById("number").addEventListener('input', () => {
    document.getElementById("success").style.display = 'none';
});
document.getElementById("entidadesDropdown").addEventListener('change', () => {
    document.getElementById("success").style.display = 'none';
});

// Poblamos el dropdown
function poblarDropdown(){
    const dropdown = document.getElementById("entidadesDropdown");
    dropdown.innerHTML = `<option value="">Seleccione una entidad</option>`;

    entidadesDisponibles.forEach((entidad,index) =>{
        let option = document.createElement("option");
        option.text = entidad.nombre;
        option.value = index;
        dropdown.add(option);
    });

    // Ocultamos la visualización de success y danger al hacer una selección
    dropdown.addEventListener('change', () => {
        if(dropdown.value !== ""){
            console.log("Entidad seleccionada:", entidadesDisponibles[dropdown.value].nombre);
        }
    });
}

// Asignamos el evento click al botón para poblar el dropdown
buttonHtml.addEventListener('click', getOptions);


