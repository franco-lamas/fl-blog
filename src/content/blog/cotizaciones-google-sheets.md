---
title: "Enviando cotizaciones a Google Sheets"
description: "Guía para enviar cotizaciones del mercado argentino a Google Sheets usando SHDA y pygsheets."
pubDate: 2024-10-08
author: "Franco Lamas"
category: "finanzas"
tags: ["python", "google-sheets", "byma"]
---

Trabajando con Cotizaciones y Google Spread Sheets

# Guía: Enviando Cotizaciones a Google Spread Sheets
En la [última guía ](/2024/10/enviar-un-dataframe-a-google-sheets/), detallamos cómo enviar DataFrames de Pandas a Google Sheets, un proceso que resulta muy útil tanto para el almacenamiento como para el análisis de datos.

Partiendo de esa guía y utilizando la librería [SHDA](/2024/08/simple-home-broker-data/), veremos cómo enviar las cotizaciones del mercado argentino a Google Sheets.


Elegimos SHDA sobre [PyHomeBroker](https://github.com/crapher/pyhomebroker) por su facilidad de uso.

## Requisitos previos

### 1. **Instalar las bibliotecas necesarias**:
   
   Debes instalar las bibliotecas pandas y pygsheets si no las tienes instaladas:
   
   ```bash
   pip install pygsheets pandas SHDA
   ```

### 2. **Configurar el acceso a la API de Google Sheets**:
   
   - Ve a [Google Cloud Console](https://console.developers.google.com/) y crea un nuevo proyecto.
   - Habilita la API de Google Sheets y la API de Google Drive.
   - Crea credenciales para una "Cuenta de Servicio" y descarga el archivo JSON de las credenciales.
   - Comparte tu hoja de cálculo con el correo electrónico de la cuenta de servicio que aparece en el archivo JSON.

### 3. **Cuenta en HomeBroker**
   - Es necesario contar con una cuenta en un bróker que utilice la plataforma HomeBroker, así como disponer de las credenciales de acceso a la misma.

## Pasos para enviar Cotizaciones a Google Sheets


### 1. Importar las bibliotecas

```python
import SHDA
import pygsheets
```

### 2. Autenticación en SHDA

Utiliza las credenciales de HomeBroker para establecer la conexión. Aunque lo recomendable es almacenarlas de forma segura, en este ejemplo las incluiremos directamente en el código.

```python
host =          # Numero de Broker
dni = " "       # DNI del usiario
user = ""       # Nombre de usuario
password = ""   # Contraseña 
```
Iniciamos la conexion

```python
hb=SHDA.SHDA(host,dni,user,password)
```

### 3. Autenticación en Google

Usa el archivo de credenciales JSON que descargaste al configurar tu acceso a la API de Google Sheets.

```python
# Autenticación con las credenciales de la API
gc = pygsheets.authorize(service_account_file='ruta/a/tu/credencial.json')
```

### 4. Crear o abrir una hoja de cálculo

Puedes crear una nueva hoja o abrir una existente utilizando su nombre o ID.

```python
# Abre una hoja de cálculo existente por nombre
sh = gc.open('nombre_de_tu_hoja')

# Si quieres abrirla por ID de la hoja:
# sh = gc.open_by_key('ID_de_tu_hoja')
```

### 5. Seleccionar una hoja específica

Elige la hoja dentro del archivo donde vas a escribir el DataFrame.

```python
# Selecciona la primera hoja dentro de la hoja de cálculo
worksheet = sh.sheet1
# O si preferimos utilizar una hora que no sea la primera
#worksheet = sh.worksheet_by_title("Test")
```

### 6. Obtener las cotizaciones
Realizamos la consulta de las cotizaciones deseadas.

```python
df=hb.get_bluechips("24hs")
```

Si queremos obtener cotizaciones de más de un panel, simplemente concatenamos los datos obtenidos.

```python
df=df._append(hb.get_bonds("24hs") , ignore_index=True)
```

### 7. Enviar el DataFrame a Google Sheets

Puedes escribir el DataFrame en la hoja de cálculo.

```python
# Escribir el DataFrame en la hoja de cálculo
worksheet.set_dataframe(df, (1, 1))  # (1, 1) significa comenzar en la celda A1
```

### 8. Ajustar el tamaño de la hoja (opcional)

Puedes ajustar el tamaño de la hoja para adaptarlo al tamaño de tu DataFrame.

```python
worksheet.adjust_column_width(start=1, end=len(df.columns))
```

### 9. Retardo

Agregamos una pequeña espera entre las consultas para evitar saturar los servicios de Google, ya que en su capa gratuita solo permite un número limitado de consultas por minuto.

```python
time.sleep(5)
```

## Código completo

```python
import time
import SHDA
import pygsheets

# Definimos el usuario y contraseña de HomeBroker

host =          # Numero de Broker
dni = " "       # DNI del usiario
user = ""       # Nombre de usuario
password = ""   # Contraseña 

# Iniciamos la conexión
hb=SHDA.SHDA(host,dni,user,password)

# Autenticación con las credenciales de la API
gc = pygsheets.authorize(service_account_file='ruta/a/tu/credencial.json')

# Abre una hoja de cálculo existente por nombre
sh = gc.open('nombre_de_tu_hoja')

# Selecciona la primera hoja
worksheet = sh.sheet1

# O si preferimos utilizar una hora que no sea la primera
#worksheet = sh.worksheet_by_title("Test")

df=hb.get_bluechips("24hs")
df=df._append(hb.get_bonds("24hs") , ignore_index=True)

# Escribir el DataFrame en la hoja de cálculo comenzando en la celda A1
worksheet.set_dataframe(df, (1, 1))

# Ajustar el ancho de las columnas
worksheet.adjust_column_width(start=1, end=len(df.columns))
time.sleep(5)
```

## Notas adicionales

- Asegúrate de que la hoja de cálculo esté compartida con el correo de la cuenta de servicio.
- Si quieres actualizar solo una parte de la hoja, puedes especificar el rango en lugar de sobrescribir toda la hoja.
