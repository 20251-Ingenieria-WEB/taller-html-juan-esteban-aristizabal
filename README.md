# Rick and Morty characters search

**Rick and Morty characters search** es una aplicación web que permite buscar y explorar información sobre el universo de rick and morty utilizando la [Rick and Morty API](https://rickandmortyapi.com/). La aplicación muestra la información basica de los personajes.

## 🚀 Funcionalidades

- **Búsqueda de personajes**:
  - Permite buscar un personaje por su **nombre**.
- **Lista**:
  - Muestra una lista de los personajes con:
    - Imagen
    - Nombre
    - Especie
    - Estado
    - Origen
    - primera aparicion
    - Ultima ubicacion
- **Lista de los personajes relacionados con un lugar**:
  - devuelve los personajes que tienen un mismo origen.
- **Paginación**:
  - Carga los personajes por lotes de 20 y permite cargar más con un botón.

## 🛠️ Tecnologías Utilizadas

- **HTML**: Estructura de la aplicación.
- **CSS**: Estilos.
- **JavaScript**: Lógica para la funcionalidad de la pagina.
- **Rick and Morty API**: API pública utilizada para obtener datos del universo de Rick and Morty.

## 📂 Estructura del Proyecto

```
web-api-app
├── src
│   ├── index.html        # Archivo index
│   ├── css
│   │   └── style.css     # Estilos CSS 
│   ├── js
│   │   └── app.js        # Código JavaScript 
│   ├── img
│   │   └── img           # imagenes usadas por la pagina
├── README.md             # Documentación del proyecto
```

## 📋 Cómo Ejecutar el Proyecto

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. **Abre el archivo `index.html`** en tu navegador web.
3. **Explora la aplicación**:
   - Usa el campo de búsqueda para buscar un Personaje **nombre**.
   - Haz clic en el botón "Cargar más" para ver más resultados.

## Preview

### Index
![index](/src/img/Captura%20de%20pantalla%202025-04-20%20215746.png)

### Resultados de Búsqueda
![Resultados](/src/img/Captura%20de%20pantalla%202025-04-20%20215925.png)
