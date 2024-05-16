import JsonFile from './clsJson.js';

export class Valida {
    cedulaDecorador( valor) {
        while (true) {
            const cedula = valor;
            if (cedula.length === 10 && !isNaN(cedula)) {
                const provincia = parseInt(cedula.substr(0, 2));
                if (provincia >= 1 && provincia <= 24) {
                    const digitoVerificador = parseInt(cedula[9]);
                    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
                    const cedulaNumerica = [...cedula].map(Number);
                    const suma = coeficientes.reduce((acc, coeficiente, index) => {
                        const producto = coeficiente * cedulaNumerica[index];
                        return acc + (producto < 10 ? producto : producto - 9);
                    }, 0);
                    if ((10 - (suma % 10)) % 10 === digitoVerificador) {
                        return true;
                    }
                }
            }
            return false
        }
    }
    valida_unico_cedula(dni){
        const json_file = new JsonFile('clientsData');
        let dato =json_file.read()
        let buscado = json_file.find("dni",dni)
        console.log(buscado)
        if(buscado.length >= 1){
            console.log(12)
            return true
        }
        return false
        
    }  
    valida_producto (id){
        console.log(id)
        const json_file = new JsonFile('productsData');
        let dato =json_file.read()
        console.log('esto es lo que tiene dato: '+JSON.stringify(dato))
        let buscado = json_file.find("id",id)
        console.log(buscado)
        if(buscado.length >= 1){
            return true
        }
        return false
        
    }
    valida_unica_factura(id){
        const json_file = new JsonFile('invoicesData');
        // let dato =json_file.read()
        let buscado = json_file.find("factura",id)
        if(buscado.length >= 1){
            return true
        }
        return false
    }
}


export default Valida;
