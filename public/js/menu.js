import JsonFile from './clsJson.js';
import { VipClient, RegularClient } from './customer.js';
import { Sale, SaleDetail } from './sales.js';


export class CrudClients {
    constructor() {
        this.json_file = new JsonFile('clientsData'); // Clave para los datos de productos
    }

    create(dni, nombre, apellido, es_vip,descuento,confirma) {
        let valor = 0;
        let cliente;
        if (es_vip === "si") {
            valor = 10000;
            cliente = new VipClient(nombre, apellido, dni);
            cliente.limit = valor;
        } else {
            let card = false
            if(descuento == "si"){
                card = true
            }
            cliente = new RegularClient(nombre, apellido, dni, card);
            valor = cliente.discount;
        }
        const client = {"dni": dni, "nombre": nombre, "apellido": apellido, "valor": valor};
        
        if (confirma) {
            let arreglo = this.json_file.read();
            console.log('print de la lectura: ' + JSON.stringify(arreglo));
            console.log('si entra');
            arreglo.push(client);
            this.json_file.save(arreglo);
            console.log('este es el arreglo que se guarda: ' + JSON.stringify(arreglo));
        }
    }

    update(dni,nombre,apellido,vip,descuento) {
        console.log(dni)
        const dato= this.json_file.read();

        let client_index = null;
    
        for (let idx = 0; idx < dato.length; idx++) {
            const client = dato[idx];
            if (client["dni"] === dni) {
                client_index = idx;
                break;
            }
        }     
        
        const client = dato[client_index];
        console.log(client)
        if (client_index !== null) {
            const client = dato[client_index];
            const valor_actual_nombre = client["nombre"];
            const valor_actual_apellido = client["apellido"];
            if (nombre =='') {
                nombre = valor_actual_nombre
            } else if (apellido == '') {
                apellido =valor_actual_apellido
            } 
            let cliente;
            if (  vip === "si") {
                cliente = new VipClient(nombre, apellido, dni);
                cliente.limit = 10000;
            } else {
                let card = false
                if(descuento == "si"){
                card = true
                }
                cliente = new RegularClient(nombre, apellido, dni, card);
            }
            dato[client_index] = cliente.getJson();
            this.json_file.save(dato);
            console.log("Cliente actualizado exitosamente.");
            
        } else {
            console.log(`No se encontr al cliente con el DNI: ${dni}`);
            
        }
    }

    delete(dni, validar) {
        let dato = this.json_file.read();
    
        console.log('esto es lo que tiene dato: '+JSON.stringify(dato))
        console.log("2222")
        let clients = this.json_file.find("dni", dni);
        console.log(clients)
    
        if (clients.length > 0) { // Verificar si se encontraron clientes con el DNI proporcionado
            // Encontrar el índice del cliente en la lista dato
            let clienteEncontrado = clients[0]; // Obtener el cliente encontrado
            console.log("asefasd")
            console.log(clienteEncontrado)
            let indexCliente = dato.findIndex(cliente => cliente.dni === clienteEncontrado.dni); // Encontrar el índice del cliente en dato
            console.log("22sds2")
            console.log(indexCliente)
            if (indexCliente !== -1) { // Verificar si se encontró el cliente en la lista dato
                dato.splice(indexCliente); // Eliminar el cliente de la lista dato
                if (validar) {
                    this.json_file.save(dato); // Guardar la lista actualizada sin el cliente eliminado
                    console.log("✔✔ Cliente eliminado exitosamente ✔✔");
                } else {
                    console.log("Accion Eliminada");
                    return;
                }
            } else {
                console.log("Error: No se encontró el cliente en la lista.");
            }
        } else {
            console.log("Usuario inexistente.");
        }
    }
    consult(tipoCliente, dni) {
        const clients = [];

        if (tipoCliente === "1") {
            const clientsVIP = this.json_file.find("valor", 10000);
            clients.push(...clientsVIP);
        } else if (tipoCliente === "2") {
            const clients1 = this.json_file.find("valor", 0);
            const clients2 = this.json_file.find("valor", 0.1);
            clients.push(...clients1, ...clients2);
        } else if (tipoCliente === "3") {
            const allClients = this.json_file.read();
            clients.push(...allClients);
        } else if (tipoCliente === "4") {
            const allClients = this.json_file.read();
            const client = allClients.find(client => client.dni === dni);
            if (client) {
                clients.push(client);
            } else {
                return `No se encontró al cliente con el DNI: ${dni}`
            }
        } else {
            return "Opción no válida"
        }

        return clients;
    }
}

export class CrudProducts {
    constructor() {
        this.json_file = new JsonFile('productsData'); // Clave para los datos de productos
    }

    create(descripcion, precio, stock) {
        descripcion = descripcion.toUpperCase();
    
        let data = this.json_file.read();
    
        // Calculamos el próximo ID disponible
        let nextId = 1;
        if (data.length > 0) {
            // Encontramos el máximo ID existente y le sumamos 1
            const maxId = Math.max(...data.map(product => product.id));
            nextId = maxId + 1;
        }
    
        // Verificamos si la descripción ya existe en la lista de productos
        const exists = data.some(product => product.descripcion === descripcion);
        if (exists) {
            console.log("El producto ya se encuentra agregado");
            return 'duplicate'; // Indicador de que el producto ya existe
        }
    
        // Creamos un nuevo producto con el próximo ID disponible
        const nuevoProducto = {
            id: nextId,
            descripcion: descripcion,
            precio: precio,
            stock: stock
        };
    
        // Agregamos el nuevo producto al arreglo de productos
        data.push(nuevoProducto);
    
        // Guardamos el arreglo actualizado en el archivo JSON
        this.json_file.save(data);
    
        // Mostramos un mensaje de éxito
        console.log(`Producto creado: ID - ${nextId}, Descripción - ${descripcion}, Precio - ${precio}, Stock - ${stock}`);
        return 'success'; // Indicador de que el producto se agregó correctamente
    }

    update(productId, newDescripcion, newPrecio, newStock) {
        newDescripcion = newDescripcion.toUpperCase()
        // Obtenemos los datos existentes del archivo JSON

        let data = this.json_file.read();

        // Convertimos productId a número entero
        productId = parseInt(productId);

        // Buscamos el producto por su ID
        const productIndex = data.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            console.log(`No se encontró el producto con el ID: ${productId}`);
            console.warn("esta es la data"+ JSON.stringify(data))
            return;
        }

        const product = data[productIndex];

        // Mostramos la información del producto encontrado
        console.log("------------------ Producto Encontrado -----------------");
        console.log("Producto: ", product.descripcion);
        console.log("Precio: ", product.precio);
        console.log("Stock: ", product.stock);
        console.log("-------------------------------------------------------");

        // Actualizamos los valores del producto si se proporcionan nuevos valores
        if (newDescripcion !== null) {
            product.descripcion = newDescripcion;
        }

        if (newPrecio !== null) {
            product.precio = parseFloat(newPrecio);
        }

        if (newStock !== null) {
            product.stock = parseInt(newStock);
        }

        // Guardamos los cambios en el archivo JSON
        data[productIndex] = product;
        this.json_file.save(data);
        console.log("✔✔ Producto actualizado exitosamente ✔✔");
    }

    delete(producto) {
        return new Promise((resolve, reject) => {
            // Obtenemos los datos existentes del archivo JSON
            let data = this.json_file.read();
    
            // Convertimos el nombre del producto a mayúsculas
            producto = producto.toUpperCase();
    
            // Buscamos el producto por su descripción
            const productIndex = data.findIndex(product => product.descripcion.toUpperCase() === producto);
    
            // Mostramos la información del producto encontrado si existe
            const product = data[productIndex];
    
            // Utilizamos SweetAlert para mostrar el cuadro de diálogo de confirmación
            Swal.fire({
                title: `¿Seguro que desea eliminar el producto ${product ? product.descripcion : producto}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then((result) => {
                if (result.isConfirmed && product) {
                    // Eliminamos el producto
                    data.splice(productIndex, 1);
                    this.json_file.save(data);
                    // Resolvemos la promesa con un mensaje de éxito y el producto eliminado
                    resolve({
                        success: true,
                        message: `El producto ${product.descripcion} fue eliminado con éxito.`,
                        deletedProduct: product
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Si la operación de eliminación es cancelada, rechazamos la promesa con un mensaje de error
                    reject({
                        success: false,
                        message: "Operación de eliminación cancelada."
                    });
                } else {
                    // Si el producto no se encuentra, rechazamos la promesa con un mensaje de error
                    reject({
                        success: false,
                        message: `No se encontró el producto con el nombre: ${producto}`
                    });
                }
            });
        });
    }
    

        
    async consult(producto) {
        producto = producto.toUpperCase();
        let products = this.json_file.find("descripcion", producto);

        if (products.length > 0) {
            // Devolvemos el primer producto encontrado
            return products[0];
        } else {
            // Si no se encuentra el producto, devolvemos null
            return null;
        }
    }
}


export class CrudSales {
    
    constructor() {
        this.json_file = new JsonFile('invoicesData'); // Clave para los datos de productos
    }

    create(dni, productos) {
        console.log(`dni:${dni}`)
        console.log(`productos:${JSON.stringify(productos)}`)
        // Crear una nueva venta
        const json_file = new JsonFile('clientsData');
        const json_file_products = new JsonFile('productsData')
        const cliente = json_file.find("dni", dni);
        
        if (!cliente) {
            console.log('Cliente no encontrado.');
            return;
        }
    
        const clienteData = cliente[0];
        console.log(`clientdata: ${JSON.stringify(clienteData)}`)
        const clienteObj = new RegularClient(clienteData.nombre, clienteData.apellido, clienteData.dni, true);
        console.log(`cliente objeto: ${JSON.stringify(clienteObj)}`)
        const nuevaVenta = new Sale(clienteObj);
        console.log(`nueva venta: ${nuevaVenta}`)
        
        let productsNotFound = []
        for (const producto of productos) {
            const id = producto.id;
            const products = json_file_products.find("id", parseInt(id));
            if (products.length === 0) {
                productsNotFound.push(producto)
            }
        }

        if (productsNotFound.length > 0){
            console.log('los siguientes productos no fueron encontrados: ' + JSON.stringify(productsNotFound))
            return productsNotFound
        }
        // Agregar los productos a la venta
        for (const producto of productos) {
            const id = producto.id;
            const products = json_file_products.find("id", parseInt(id));

            const products2 = products[0];
            const descripcion = products2.descripcion; // Cambiado de descripción a nombre
            const precio = products2.precio;
            console.log(`precio: ${producto.precio}`)
            console.log(`precio: ${precio}`)
            console.log(`nombre: ${descripcion}`)
            console.log(`id: ${id}`)
            const cantidad = producto.cantidad;
    
            const detalleVenta = new SaleDetail({ id, descripcion, precio }, cantidad); // Se pasa el objeto de producto completo
            console.log(`detalle venta: ${JSON.stringify(detalleVenta)}`)
            console.log(`detalle venta: ${detalleVenta}`)
            
            nuevaVenta.add_detail(detalleVenta);
            console.log(`nueva venta: ${nuevaVenta}`)
            console.log(`nueva venta1: ${detalleVenta.product}`)
        }
        // Guardar la venta en el archivo JSON
        const ventas = this.json_file.read();
        ventas.push(nuevaVenta.getJson());
        this.json_file.save(ventas);
        console.log("estas son las ventas registradas"+ JSON.stringify(ventas))
        console.log('Venta registrada exitosamente.');
        return []
    }

    delete(numeroFactura) {
        let ventas = this.json_file.read();
        const index = ventas.findIndex(venta => venta.factura === numeroFactura);
    
        if (index === -1) {
            swal("Error", `No se encontró ninguna venta.`, "error");
            return;
        }
    
        ventas.splice(index, 1); // Eliminar la venta del array
        this.json_file.save(ventas); // Guardar el array actualizado
        swal("Éxito", `Venta con número de factura ${numeroFactura} eliminada correctamente.`, "success");
    }
    
    consult(numeroFactura) {
        const facturaNumero = parseInt(numeroFactura);
    
        if (isNaN(facturaNumero)) {
            console.log('El número de factura proporcionado no es válido.');
            return null;
        }
    
        const ventas = this.json_file.read();
        const ventaEncontrada = ventas.find(venta => venta.factura === facturaNumero);
        
        if (ventaEncontrada) {
            console.log( JSON.stringify(ventaEncontrada))
            return ventaEncontrada;
            
        } else {
            console.log('No se encontró la venta con el número de factura especificado.');
            return null;
        }
    }
    update(fecha, dni, nombre, subtotal, descuento, iva, total, facturaId) {
        // Obtenemos los datos existentes del archivo JSON
        let data = this.json_file.read();
        // Convertimos facturaId a número entero
        facturaId = parseInt(facturaId);
        console.log('esto es la id de factura: '+facturaId)
        
        // Buscamos la factura por su ID
        const facturaIndex = data.findIndex(factura => factura.factura === facturaId);
        console.log('esto es lo que tiene el index de factura'+facturaIndex)
        const factura = data[facturaIndex];
    
        // Actualizamos los valores de la factura si se proporcionan nuevos valores
        if (fecha !== '') {
            factura.Fecha = fecha; // Actualizamos el campo Fecha
        }
    
        if (dni !== '') {
            factura.dni = dni;
        }
    
        if (nombre !== '') {
            factura.cliente = nombre; // Actualizamos el campo cliente
        }
    
        if (subtotal !== '') {
            factura.subtotal = parseFloat(subtotal);
        }
    
        if (descuento !== '') {
            factura.descuento = parseFloat(descuento);
        }
    
        if (iva !== '') {
            factura.iva = parseFloat(iva);
        }
    
        if (total !== '') {
            factura.total = parseFloat(total);
        }
    
        // Guardamos los cambios en el archivo JSON
        data[facturaIndex] = factura;
        this.json_file.save(data);
        console.warn("Esta es la data: " + JSON.stringify(data));
        console.log("✔✔ Factura actualizada exitosamente ✔✔");
    }
}



export function ConsultasGenerales() {
    // Obtener referencias a los elementos de las tablas en el HTML
    const tableMayorStock = document.getElementById("tableMayorStock");
    const tableMenorStock = document.getElementById("tableMenorStock");
    const tableMasFacturas = document.getElementById("tableMasFacturas");
    const tableMayorValor = document.getElementById("tableMayorValor");
    const tableMenorValor = document.getElementById("tableMenorValor");

    // PRODUCTO CON MÁS STOCK
    const products = new JsonFile('productsData').read();
    const maxStock = Math.max(...products.map(product => product.stock));
    const products_major_stock = products.filter(product => product.stock === maxStock);

    // Llenar la tabla de Producto con Mayor Stock
    fillTable(tableMayorStock, products_major_stock);

    // PRODUCTO CON MENOS STOCK
    const minStock = Math.min(...products.map(product => product.stock));
    const products_minor_stock = products.filter(product => product.stock === minStock);

    // Llenar la tabla de Producto con Menor Stock
    fillTable(tableMenorStock, products_minor_stock);
    
    // CLIENTES CON MÁS FACTURAS
    const invoices = new JsonFile('invoicesData').read();
    const clients_invoices = invoices.reduce((acc, invoice) => {
        // Usamos el DNI del cliente para contar las facturas por cliente
        acc[invoice.dni] = (acc[invoice.dni] || 0) + 1;
        return acc;
    }, {});

    const maxInvoices = Math.max(...Object.values(clients_invoices));

    // Filtramos los clientes con más facturas y agregamos el número de facturas a cada cliente
    const clientsWithMostInvoices = Object.entries(clients_invoices)
        .filter(([dni, numInvoices]) => numInvoices === maxInvoices)
        .map(([dni]) => {
            // Buscamos la información del cliente usando su DNI
            const clientInfo = new JsonFile('clientsData').find('dni', dni)[0];
            return { dni, ...clientInfo, numInvoices: maxInvoices };
        });

    // Llenar la tabla de Clientes con Más Facturas
    console.log(clientsWithMostInvoices)
    fillTable(tableMasFacturas, clientsWithMostInvoices);
        
    // FACTURAS CON MAYOR VALOR
    const invoices_higher_value = invoices
        .filter(invoice => invoice.total === Math.max(...invoices.map(inv => inv.total)))
        .map(invoice => {
            // Eliminamos la clave 'detalle' de cada factura
            delete invoice.detalle;
            const client = new JsonFile('clientsData').find('dni', invoice.dni)[0];
            return { ...invoice, dni: client.dni };
        });

    // Llenar la tabla de Facturas con Mayor Valor
    fillTable(tableMayorValor, invoices_higher_value);

    // FACTURAS CON MENOR VALOR
    const invoices_lower_value = invoices
        .filter(invoice => invoice.total === Math.min(...invoices.map(inv => inv.total)))
        .map(invoice => {
            // Eliminamos la clave 'detalle' de cada factura
            delete invoice.detalle;
            const client = new JsonFile('clientsData').find('dni', invoice.dni)[0];
            return { ...invoice, dni: client.dni };
        });

    // Llenar la tabla de Facturas con Menor Valor
    fillTable(tableMenorValor, invoices_lower_value);

}

// Función para llenar una tabla con datos
function fillTable(tableElement, data) {
    // Limpiar la tabla antes de llenarla con nuevos datos
    tableElement.innerHTML = "";

    // Crear las filas y celdas de la tabla y agregarlas al elemento de tabla proporcionado
    data.forEach(item => {
        const row = tableElement.insertRow();
        Object.entries(item).forEach(([key, value], index) => {
            const cell = row.insertCell();
            // Si es la última columna, insertamos el número de facturas
            if (index === Object.keys(item).length - 1 && key === 'numInvoices') {
                cell.textContent = value;
            } else {
                // De lo contrario, insertamos el valor normalmente
                cell.textContent = value;
            }
        });
    });
}

