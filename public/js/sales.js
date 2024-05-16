export class SaleDetail {
  static _line = 0;
  constructor(product, quantity) {
    SaleDetail._line++;
    this.__id = SaleDetail._line;
    this.product = product.descripcion;
    this.preci = product.precio;
    console.log(`precio en la clase saledetail: ${this.preci}`)
    console.log(product.precio)
    console.log(this.product)
    //console.log(product.descripcion)
    console.log(quantity)
    this.quantity = quantity;
  }
  
  get id() {
    return this.__id;
  }

  toString() {
    return `${this.id} ${this.product.descrip} ${this.preci} ${this.quantity}`;
  }
}

export class Sale {
  static next = parseInt(localStorage.getItem('nextInvoiceNumber')) || 1;
  static FACTOR_IVA = 0.12;
  constructor(client) {
    Sale.next++;
    this.__invoice = Sale.next-1;
    this.date = new Date().toISOString().slice(0, 10);
    this.client = client;
    this.subtotal = 0;
    this.percentage_discount = client.discount;
    this.discount = 0;
    this.iva = 0;
    this.total = 0;
    this.sale_detail = [];
  }

  get invoice() {
    return this.__invoice;
  }

  toString() {
    return `Factura# ${this.invoice} ${this.date} ${this.client.fullName()} ${this.total}`;
  }

  cal_iva(iva = 0.12, valor = 0) {
    return parseFloat((valor * iva).toFixed(2));
  }

  cal_discount(valor = 0, discount = 0) {
    return valor * discount;
  }
  

  add_detail(product) {
    //const detail = new SaleDetail(product, qty);
    // const detail = new SaleDetail(product, product.quantity); // Descomentar esta línea para crear el objeto SaleDetail

    const detail = product
    console.log(`detalle en add-detail: ${JSON.stringify(detail)}`)
    this.subtotal += parseFloat((detail.preci * detail.quantity).toFixed(2));
    console.log(this.subtotal)
    console.log(detail.preci)
    console.log(detail.quantity)
    this.discount = parseFloat(this.cal_discount(this.subtotal, this.percentage_discount).toFixed(2));
    this.iva = this.cal_iva(Sale.FACTOR_IVA, this.subtotal - this.discount);
    this.total = parseFloat((this.subtotal + this.iva - this.discount).toFixed(2));
    this.sale_detail.push(detail);
    
    console.log(`detalle: ${JSON.stringify(detail)}`)
  }

  print_invoice(company) {
    // Implementa tu lógica para imprimir la factura en la consola
  }
  

  getJson() {
    const invoice = {
      factura: this.invoice,
      Fecha: this.date,
      dni: this.client.DNI1(),
      cliente: this.client.fullName(),
      subtotal: this.subtotal,
      descuento: this.discount,
      iva: this.iva,
      total: this.total,
      detalle: []
    };
    for (const det of this.sale_detail) {
      invoice.detalle.push({
        producto: det.product,
        precio: det.preci,
        cantidad: det.quantity
    });
    
    }
    return invoice;
  }

  static cal(lista, name) {
    name = name.split(' ')[0];
    try {
      let subtotal = lista.reduce((acc, producto) => acc + parseFloat(producto.precio) * parseInt(producto.cantidad), 0);
      let discount = subtotal * 0.10;
      let json_file  = new JsonFile(path_json)
      let valide = json_file.find('nombre', name);
      valide = valide[0];
      if (valide['valor'] !== 0) {
        discount = subtotal * 0.10;
      } else {
        discount = subtotal * 0;
      }
      let iva = subtotal * 0.12;
      let total = subtotal + iva - discount;
      return [subtotal, discount, iva, total];
    } catch (e) {
      return [0, 0, 0, 0];
    }
  }
}
