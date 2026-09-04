---
title: "Enviar un DataFrame a Google Sheets"
description: "Cómo enviar DataFrames de pandas a Google Sheets utilizando la librería pygsheets."
pubDate: 2024-10-08
author: "Franco Lamas"
category: "python"
tags: ["python", "pandas", "google-sheets"]
---

Trabajando con Pandas y Google Spread Sheets


# Guía: Enviar un DataFrame a Google Sheets usando pygsheets

Esta guía te enseñará cómo enviar un DataFrame de pandas a Google Sheets utilizando la librería pygsheets. Esta biblioteca permite interactuar con Google Sheets a través de su API de manera fácil.

## Requisitos previos

### 1. **Instalar las bibliotecas necesarias**:
   
   Debes instalar las bibliotecas pandas y pygsheets si no las tienes instaladas:
   
   ```bash
   pip install pygsheets pandas
   ```

### 2. **Configurar el acceso a la API de Google Sheets**:
   
   - Ve a [Google Cloud Console](https://console.developers.google.com/) y crea un nuevo proyecto.
   - Habilita la API de Google Sheets y la API de Google Drive.
   - Crea credenciales para una "Cuenta de Servicio" y descarga el archivo JSON de las credenciales.
   - Comparte tu hoja de cálculo con el correo electrónico de la cuenta de servicio que aparece en el archivo JSON.

## Pasos para enviar un DataFrame a Google Sheets

### 1. Importar las bibliotecas

```python
import pygsheets
import pandas as pd
```

### 2. Autenticación

Usa el archivo de credenciales JSON que descargaste al configurar tu acceso a la API de Google Sheets.

```python
# Autenticación con las credenciales de la API
gc = pygsheets.authorize(service_account_file='ruta/a/tu/credencial.json')
```

### 3. Crear o abrir una hoja de cálculo

Puedes crear una nueva hoja o abrir una existente utilizando su nombre o ID.

```python
# Abre una hoja de cálculo existente por nombre
sh = gc.open('nombre_de_tu_hoja')

# Si quieres abrirla por ID de la hoja:
# sh = gc.open_by_key('ID_de_tu_hoja')
```

### 4. Seleccionar una hoja específica

Elige la hoja dentro del archivo donde vas a escribir el DataFrame.

```python
# Selecciona la primera hoja dentro de la hoja de cálculo
worksheet = sh.sheet1
```

### 5. Cargar tu DataFrame

Crea un DataFrame de ejemplo o usa uno que ya tengas.

```python
# Crear un DataFrame de ejemplo
data = {'Nombre': ['Juan', 'Ana', 'Luis'],
        'Edad': [28, 24, 22],
        'Ciudad': ['Buenos Aires', 'Córdoba', 'Mendoza']}
df = pd.DataFrame(data)
```

### 6. Enviar el DataFrame a Google Sheets

Puedes escribir el DataFrame en la hoja de cálculo.

```python
# Escribir el DataFrame en la hoja de cálculo
worksheet.set_dataframe(df, (1, 1))  # (1, 1) significa comenzar en la celda A1
```

### 7. Ajustar el tamaño de la hoja (opcional)

Puedes ajustar el tamaño de la hoja para adaptarlo al tamaño de tu DataFrame.

```python
worksheet.adjust_column_width(start=1, end=len(df.columns))
```

## Código completo

```python
import pygsheets
import pandas as pd

# Autenticación con las credenciales de la API
gc = pygsheets.authorize(service_account_file='ruta/a/tu/credencial.json')

# Abre una hoja de cálculo existente por nombre
sh = gc.open('nombre_de_tu_hoja')

# Selecciona la primera hoja
worksheet = sh.sheet1

# Crear un DataFrame de ejemplo
data = {'Nombre': ['Juan', 'Ana', 'Luis'],
        'Edad': [28, 24, 22],
        'Ciudad': ['Buenos Aires', 'Córdoba', 'Mendoza']}
df = pd.DataFrame(data)

# Escribir el DataFrame en la hoja de cálculo comenzando en la celda A1
worksheet.set_dataframe(df, (1, 1))

# Ajustar el ancho de las columnas
worksheet.adjust_column_width(start=1, end=len(df.columns))
```

## Notas adicionales

- Asegúrate de que la hoja de cálculo esté compartida con el correo de la cuenta de servicio.
- Si quieres actualizar solo una parte de la hoja, puedes especificar el rango en lugar de sobrescribir toda la hoja.
