# not-emojis

**not-emojis** es una GitHub Action y herramienta de línea de comandos que encuentra secuencias emoji en archivos de texto registrados por Git. Informa el archivo y la línea de cada hallazgo, y devuelve un estado de error para detener el job del CI.

## Uso en GitHub Actions

Agrega un paso a tu workflow existente después de descargar el repositorio. Reemplaza `OWNER` por la cuenta u organización de GitHub donde se publique este proyecto y usa una etiqueta de versión disponible.

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Revisar emojis
    uses: OWNER/not-emojis@v1
```

La Action analiza los archivos que Git conoce en el repositorio descargado. Omite binarios y enlaces simbólicos. Cada hallazgo aparece como una advertencia con archivo y línea; cualquier hallazgo hace fallar el paso. Los errores de lectura o análisis también hacen fallar el paso.

Para ejecutarla cuando se suben cambios a `main`, agrega el paso al workflow que ya ejecuta lint, pruebas y validación de commits. Hay un ejemplo completo en [`.github/workflows/not-emojis.yml`](.github/workflows/not-emojis.yml).

## Ejecución local

Requisitos: Node.js 24 o posterior, npm y Git.

```sh
npm install --global not-emojis
not-emojis
```

También puedes ejecutarla desde una copia local de este proyecto:

```sh
npm ci
npm run check -- --root /ruta/al/repositorio
```

El comando devuelve estado `0` si no encuentra emojis ni errores de análisis, `1` si encuentra emojis o no puede completar el análisis, y `2` si los argumentos de línea de comandos son incorrectos. La salida indica ruta, línea (empezando en 1) y emoji detectado.

## Alcance y configuración

La primera versión revisa todo el contenido de texto registrado por Git en el repositorio; no se limita al último commit. Omite binarios y enlaces simbólicos. No tiene archivo de configuración ni exclusiones configurables. No detecta palabras vulgares, no modifica archivos ni envía contenido del repositorio a servicios externos.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para desarrollar y [la guía técnica](docs/technical-guide.md) para conocer el análisis y el empaquetado.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
