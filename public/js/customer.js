class Client {
    constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
        this.first_name = first_name;
        this.last_name = last_name;
        this._dni = dni;
    }

    get dni() {
        return this._dni;
    }

    set dni(value) {
        if (value.length === 10 || value.length === 13) {
            this._dni = value;
        } else {
            this._dni = "9999999999";
        }
    }

    DNI1() {
        return this.dni;
    }

    fullName() {
        return this.first_name + ' ' + this.last_name;
    }

    show() {
        console.log('   Nombres    Dni');
        console.log(`${this.fullName()}  ${this.dni}`);
    }
}

export class RegularClient extends Client {
    constructor(first_name = "Cliente", last_name = "Final", dni = "9999999999", card = false) {
        super(first_name, last_name, dni);
        this._discount = card ? 0.10 : 0;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value > 0 ? value : 0;
    }

    show() {
        console.log(`Cliente Minorista: DNI:${this.dni} Nombre:${this.first_name} ${this.last_name} Descuento:${this.discount * 100}%`);
    }

    getJson() {
        return {"dni": this.dni, "nombre": this.first_name, "apellido": this.last_name, "valor": this.discount};
    }
}

export class VipClient extends Client {
    constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
        super(first_name, last_name, dni);
        this._limit = 10000;
    }

    get limit() {
        return this._limit;
    }

    set limit(value) {
        this._limit = (value < 10000 || value > 20000) ? 10000 : value;
    }

    show() {
        console.log(`Cliente Vip: DNI:${this.dni} Nombre: ${this.first_name} ${this.last_name} Cupo: ${this.limit}`);
    }

    getJson() {
        return {"dni": this.dni, "nombre": this.first_name, "apellido": this.last_name, "valor": this.limit};
    }
}


