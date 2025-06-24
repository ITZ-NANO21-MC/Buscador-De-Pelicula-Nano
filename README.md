# Buscador-De-Pelicula-Con-OMDB-API-Nano

## Descripción
Un buscador de películas que se conecta a la API de OMDB para obtener información sobre películas, series y episodios. Permite buscar títulos, filtrar por tipo y año, ver detalles completos y navegar por los resultados con paginación.

## Características principales
- **Búsqueda dinámica** de películas, series y episodios
- **Filtros avanzados** por tipo y año
- **Paginación inteligente** con navegación y resaltado de página actual
- **Detalles completos** de cada título (año, género, director, actores, calificación, etc.)
- **Diseño responsive** adaptado a móviles y desktop
- **Manejo de errores** con mensajes claros al usuario

## Tecnologías utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos, animaciones y diseño responsive
- **JavaScript**: Lógica de la aplicación y conexión con API
- **OMDB API**: Fuente de datos de películas
- **Font Awesome**: Iconos

## Instalación y uso
1. Clona este repositorio:
```bash
git clone https://github.com/ITZ-NANO21-MC/Buscador-De-Pelicula-Nano
```

2. Abre el archivo `index.html` en cualquier navegador moderno

3. Usa el buscador:
   - Ingresa un título en el campo de búsqueda
   - Utiliza los filtros para refinar tus resultados
   - Haz clic en cualquier película para ver detalles completos
   - Navega entre páginas con los controles de paginación

## Estructura de archivos
```
buscador-peliculas/
├── index.html          # Archivo principal
├── styles.css          # Archivo css
├── script.html         # Archivo javascript
├── README.md           # Este archivo
```

## Personalización
Puedes modificar los estilos editando las variables CSS en el archivo HTML:
```css
:root {
    --primary-color: #e50914;
    --secondary-color: #141414;
    --accent-color: #f5c518;
    --text-color: #ffffff;
    --text-secondary: #b3b3b3;
    --bg-color: #000000;
    --card-bg: #181818;
    --error-color: #e50914;
    --success-color: #46d369;
    --transition-speed: 0.3s;
}
```

## Mejoras futuras
- [ ] Implementar búsqueda por voz
- [ ] Añadir favoritos con almacenamiento local
- [ ] Integrar tráilers de YouTube
- [ ] Agregar modo oscuro/ligero
- [ ] Soporte para múltiples idiomas

## Contribuciones
Las contribuciones son bienvenidas. Sigue estos pasos:
1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la licencia [MIT](LICENSE).

---

**Nota**: Para usar la aplicación, necesitarás obtener una API key gratuita de [OMDB API](http://www.omdbapi.com/apikey.aspx) y reemplazarla en el archivo JavaScript.
