class JsonFile {
    constructor(key) {
        this.key = key;
    }

    save(data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(this.key, jsonData);
            console.log('Datos guardados en el almacenamiento local correctamente.');
        } catch (error) {
            console.error('Error al guardar en el almacenamiento local:', error);
        }
    }

    read() {
        try {
            const jsonData = localStorage.getItem(this.key);
            if (jsonData) {
                const data = JSON.parse(jsonData);
                return data;
            } else {
                console.log('No se encontraron datos en el almacenamiento local.');
                return [];
            }
        } catch (error) {
            console.error('Error al leer del almacenamiento local:', error);
            return [];
        }
    }

    find(atributo, buscado) {
        try {
            const data = this.read();
            const foundData = data.filter(item => item[atributo] === buscado);
            return foundData;
        } catch (error) {
            console.error('Error al buscar en el almacenamiento local:', error);
            return [];
        }
    }
}

export default JsonFile;
