---
title: "Instalación de Python para EPGB"
description: "Guía para instalar Python y las dependencias necesarias para la planilla EPGB."
pubDate: 2024-09-16
author: "Franco Lamas"
category: "finanzas"
tags: ["python", "epgb", "tutorial"]
---

Instalando Python y dependencias para la planilla EPGB.

## Guía para Instalar Python en Windows

### Paso 1: Descargar el instalador de Python

Abre tu navegador y accede a: https://www.python.org/downloads/. 

La página debería detectar automáticamente tu sistema operativo y mostrar el botón Download Python con la versión más reciente.

![](/images/2024/EPGB/EPGB-1.png)


Descarga el archivo ejecutable:

Haz clic en el botón de descarga para obtener el instalador (archivo .exe).
![](/images/2024/EPGB/EPGB-2.png)

### Paso 2: Ejecutar el instalador de Python

Una vez descargado, haz doble clic en el archivo para ejecutar el instalador.
Asegúrate de marcar la opción "Add Python to PATH":

![](/images/2024/EPGB/EPGB-3-short.png)

Al abrir el instalador, marca la casilla que dice "Add Python 3.x to PATH" en la parte inferior de la ventana. Esto es importante para poder ejecutar Python desde cualquier lugar en la terminal sin problemas adicionales.
Selecciona "Install Now":

Después de marcar la opción anterior, haz clic en Install Now para proceder con la instalación.

### Paso 3: Verificación de la instalación de Python y pip
Abrir la terminal de comandos:

Presiona las teclas Windows + R, escribe *powershell* y presiona Enter para abrir la consola de comandos.

En la consola de comandos, escribe:
```bash
python --version
```
Si la instalación fue exitosa, deberías ver algo como Python 3.x.x.

Escribe el siguiente comando para verificar que también se instaló pip (el administrador de paquetes de Python):
```bash
pip --version
```
![](/images/2024/EPGB/EPGB-4-short.png)

Con estos pasos correctamente seguidos tenemos una instalacion de python funcional.

## Guía para Instalar la planilla EPGB

La planilla EPGB requiere tener instalado el paquete de Office, específicamente Excel. Generalmente, este software viene preinstalado en la mayoría de los equipos. En caso contrario, es posible instalarlo por separado; sin embargo, este proceso no será cubierto en este tutorial.

### Paso 1: Descargar la planilla
Abre tu navegador y accede a: https://beacons.ai/sabrofrehley/

![](/images/2024/EPGB/EPGB-5-short.png)

Haz clic en el botón de *Planillas EPGB actualizadas*

Pon el cursador del mouse sobre el archivo zip y haz clic en el botón *Descargar*

![](/images/2024/EPGB/EPGB-6-short.png)

Vamos hacia la carpeta *Descargas*, buscamos el archivo descargado y hacemos click derecho en el archivo descargado, y hacemos click en *Extraer Todo*


![](/images/2024/EPGB/EPGB-7-short.png)

### Paso 2: Instalar dependencias
Abrir la terminal de comandos:

Presiona las teclas Windows + R, escribe *powershell* y presiona Enter para abrir la consola de comandos.

En la consola de comandos, escribe:
```bash
pip install pyhomebroker xlwings
```

![](/images/2024/EPGB/EPGB-8.png)

Una vez ejecutado este comando, se iniciará la instalación de las dependencias.

![](/images/2024/EPGB/EPGB-9.png)

Una vez finalizada la instalación, estaremos listos para continuar.

### Paso 3: Configurar las credenciales

Nos dirigimos a la carpeta donde se encuentran los archivos de la EPGB y hacemos clic derecho en el archivo *main_HM.py*. A continuación, seleccionamos la opción *Edit with IDLE*.

![](/images/2024/EPGB/EPGB-10-short.png)

Se abrirá la ventana del editor IDLE, y descenderemos hasta la sección *Datos del Broker*. En esta sección, modificaremos las líneas correspondientes con nuestra información.

![](/images/2024/EPGB/EPGB-11-short.png)
