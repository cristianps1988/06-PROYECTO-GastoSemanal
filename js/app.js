// variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;

// eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;

        // agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    imprimirAlerta(mensaje, tipo){
        // crear el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert');

        // validar tipo de alerta
        if(tipo === 'error'){
            divAlerta.classList.add('alert-danger');
        } else{
            divAlerta.classList.add('alert-success');
        }
        divAlerta.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divAlerta, formulario);

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }

    agregarGastoListado(gastos){
        this.limpiarHtml(); // elimina html previo

        // iterar sobre los gastos
        gastos.forEach(gasto => {
            const {nombre, cantidad, id} = gasto;

            // crear LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id); // esta forma ya no se recomienda mucho
            nuevoGasto.dataset.id = id; // ahora se recomienda esta

            // agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'>$${cantidad}</span>`

            // boton para agregar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // insertar al html
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {restante, presupuesto} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si se acaba el presupuesto
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha terminado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// instanciar 
const ui = new UI();

// funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('De cuanto es tu presupuesto?');
    
    // validar presupuesto
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

function agregarGasto(e){
    e.preventDefault();

    // leer datos de formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    

    // validar
    if(nombre === '' || cantidad ===''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return;
    }

    // generar un objeto, al contrario que el destructuring
    const gasto = {nombre, cantidad, id: Date.now()}

    // agregar un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de gasto correcto
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // resetear formulario
    formulario.reset();
}

// eliminar gasto
function eliminarGasto(id){
    // elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    // elimina los gastos del html
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}