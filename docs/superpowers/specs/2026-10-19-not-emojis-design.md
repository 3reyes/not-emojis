# not-emojis: diseño inicial

## Intención

not-emojis es un proyecto de código abierto para impedir que se incorporen emojis en código y documentación. Se ejecuta como parte de GitHub Actions dentro del CI que el repositorio ya tenga configurado.

## Problema

Los repositorios pueden establecer una regla editorial que prohíba emojis, pero revisarla manualmente en cada cambio es inconsistente. not-emojis automatiza esa regla: examina el contenido del repositorio, informa cada coincidencia y devuelve un resultado fallido para que GitHub Actions marque el CI como fallido.

## Usuario y flujo

El usuario instala/configura not-emojis en un workflow de GitHub Actions. Cuando el workflow se ejecuta al subir cambios a `main`, not-emojis revisa los archivos de código y documentación del repositorio. Si encuentra emojis, reporta ruta, línea y el carácter detectado, y termina con estado de error. Si no encuentra ninguno, termina correctamente.

## Objetivos de la primera versión

- Detectar emojis en archivos de código y documentación.
- Revisar el repositorio al ejecutarse el workflow; no limitar el análisis a las líneas del último commit.
- Hacer fallar la ejecución si hay uno o más hallazgos.
- Mostrar ubicaciones concretas para que cada hallazgo pueda corregirse.
- Permitir incorporarlo a un workflow GitHub Actions existente junto con lint, pruebas y validaciones de commits.
- Mantener el análisis local dentro del runner de GitHub Actions; el contenido del repositorio no se envía a un servicio externo.

## Fuera de alcance

- Detectar palabras vulgares u otras reglas editoriales.
- Corregir o eliminar emojis automáticamente.
- Reemplazar o configurar lint, pruebas u otras partes del CI.
- Revisar comentarios de pull request o bloquear merges directamente; GitHub Actions comunica el resultado al mecanismo de protección de ramas existente.
- Revisar binarios como imágenes, audio o archivos comprimidos.

## Comportamiento y reporte

- Cada hallazgo debe incluir como mínimo la ruta del archivo y el número de línea; también debe identificar el emoji detectado.
- El workflow debe ver una ejecución fallida cuando existen hallazgos y una ejecución exitosa cuando no existen.
- Los errores al leer o analizar archivos deben notificarse como errores, para evitar que el chequeo pase silenciosamente sin completar la revisión.
- La primera versión no necesita comentarios en línea en los pull requests ni autocorrecciones.

## Alcance de archivos

La herramienta se orienta a archivos de texto que contengan código o documentación. Los formatos concretos, la detección de archivos binarios y las exclusiones razonables para dependencias o artefactos generados quedan para la decisión de implementación, preservando el objetivo de revisar el contenido mantenido por el proyecto.

## Restricciones y decisiones para implementación

- Debe funcionar dentro de GitHub Actions y poder añadirse a workflows existentes.
- La elección entre una GitHub Action publicada, una CLI invocada desde el workflow u otro empaquetado, y el lenguaje de implementación quedan a criterio del constructor, siempre que la instalación sea clara y la ejecución no dependa de un servicio externo.
- La definición técnica de los caracteres emoji debe cubrir secuencias Unicode compuestas, no solo caracteres aislados, en la medida que lo permita el enfoque escogido.
- La configuración inicial debe ser mínima. Cualquier opción de exclusión debe evitar que directorios de dependencias o salida generada produzcan ruido, sin ocultar por defecto código o documentación del proyecto.

## Criterio de éxito

Un mantenedor puede añadir not-emojis a un workflow existente; el job identifica emojis presentes en código o documentación con ruta y línea, falla de manera visible cuando los hay y pasa cuando no los hay.
