
export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('miBaseDeDatos', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
          // Crear tabla "categorias" si no existe
            if (!db.objectStoreNames.contains('categorias')) {
                db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: false });
            }

            // Crear tabla "productos" si no existe
            if (!db.objectStoreNames.contains('productos')) {
                const productStore = db.createObjectStore('productos', { keyPath: 'id', autoIncrement: false });

                // Crear índice para relación con categorias
                productStore.createIndex('category', 'category', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

export const addData = async (data) => {
    const db = await openDatabase();
    const transaction = db.transaction('productos', 'readwrite');
    const store = transaction.objectStore('productos');
    store.add(data);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('Dato agregado exitosamente');
        transaction.onerror = () => reject('Error al agregar dato');
    });
}

// Ejemplo de uso
//addData({ nombre: 'Juan', edad: 30 }).then(console.log).catch(console.error);

export const saveData = async (data) => {
    const db = await openDatabase();
    const transaction = db.transaction(['categorias', 'productos'], 'readwrite');

    const categoriasStore = transaction.objectStore('categorias');
    const productosStore = transaction.objectStore('productos');

    try {
        for (const categoria of data) {
            // Guardar la categoría
            categoriasStore.put({
                id: categoria.id,
                name: categoria.name,
                posicion: categoria.posicion,
                tipo: categoria.tipo,
                status: categoria.status,
            });

            // Guardar los productos relacionados
            const products = JSON.parse(categoria.products);
            for (const product of products) {
                productosStore.put(product);
            }
        }

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve('Datos guardados correctamente');
            transaction.onerror = () => reject('Error al guardar datos');
        });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        throw error;
    }
};


export const getAllData = async () => {
    const db = await openDatabase();
    const transaction = db.transaction('miStore', 'readonly');
    const store = transaction.objectStore('miStore');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Error al leer datos');
    });
}

// Ejemplo de uso
//getAllData().then(console.log).catch(console.error);

export const updateData = async (id, newData) => {
    const db = await openDatabase();
    const transaction = db.transaction('miStore', 'readwrite');
    const store = transaction.objectStore('miStore');

    const existingData = await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Error al obtener dato para actualizar');
    });

    if (existingData) {
        const updatedData = { ...existingData, ...newData };
        store.put(updatedData);
    } else {
        throw new Error('Dato no encontrado');
    }
}
 
// Ejemplo de uso
//updateData(1, { edad: 35 }).then(() => console.log('Dato actualizado')).catch(console.error);

export const deleteData = async (id) => {
    const db = await openDatabase();
    const transaction = db.transaction('miStore', 'readwrite');
    const store = transaction.objectStore('miStore');
    store.delete(id);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('Dato eliminado exitosamente');
        transaction.onerror = () => reject('Error al eliminar dato');
    });
}

// Ejemplo de uso
//deleteData(1).then(console.log).catch(console.error);


export const deleteDatabase = (dbName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);

        request.onsuccess = () => {
            resolve(`Base de datos '${dbName}' eliminada exitosamente`);
        };

        request.onerror = (event) => {
            reject(`Error al eliminar la base de datos: ${event.target.error}`);
        };

        request.onblocked = () => {
            reject('La eliminación de la base de datos está bloqueada. Cierre las conexiones abiertas.');
        };
    });
}

/* deleteDatabase('miBaseDeDatos')
    .then(console.log)
    .catch(console.error);
 */


