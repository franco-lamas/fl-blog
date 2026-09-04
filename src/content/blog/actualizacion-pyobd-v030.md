---
title: "Actualización PyOBD v0.3.0: Compatibilidad con pyhomebroker y nuevas funciones"
description: "PyOBD v0.3.0 ahora es compatible con la API de pyhomebroker y ofrece acceso extendido a datos históricos y corporativos de BYMA."
pubDate: 2026-03-15
author: "Franco Lamas"
category: "finanzas"
tags: ["python", "byma", "trading", "pyobd"]
---

Presentamos la versión v0.3.0 de PyOBD, ahora con compatibilidad total con la API de pyhomebroker y acceso extendido a datos históricos y corporativos.

# La Evolución de PyOBD

PyOBD continúa evolucionando para ofrecer una solución robusta y profesional para desarrolladores de trading en Argentina. Esta versión v0.3.0 marca un hito al integrar todo el historial de desarrollo previo en un único repositorio unificado, facilitando el mantenimiento y la expansión futura.

## ¿Qué hay de nuevo en la v0.3.0?

Esta actualización se centra en la compatibilidad y la expansión de datos disponibles:

### 1. Compatibilidad con pyhomebroker
La nueva PyOBD actúa como un **drop-in replacement** para las funciones de datos de `pyhomebroker`, permitiendo consultar históricos sin necesidad de una cuenta de broker activa:

```python
from pyobd import BymaData
client = BymaData()

# Histórico diario (igual que en pyhomebroker)
df = client.get_daily_history("GGAL", "2026-01-01", "2026-03-01")
```

### 2. Datos Intradiarios (1 Minuto)
Soporte para series históricas de alta resolución (1 minuto), fundamental para análisis técnico detallado y backtesting.

```python
idf = client.get_intraday_history("GGAL")
```

### 3. Información Corporativa Profunda
Acceso estructurado a datos que antes requerían navegación manual:
- **Balances:** Último balance y estado patrimonial.
- **Management:** Nómina de directivos y autoridades.
- **Perfiles:** ISIN, capitalización y datos técnicos.

---

## Guía Completa de Métodos (v0.3.0)

Aquí tienes la referencia completa de llamadas disponibles en el cliente `BymaData`:

### Consultas Generales
- `get_market_time()`: Estado del mercado (Abierto/Cerrado) y horarios.
- `get_indices()`: Cotizaciones de índices (Merval, Merval 25, etc.).
- `get_dictionary()`: Diccionario de traducciones oficial de BYMA.

### Renta Variable y CEDEARs
- `get_bluechips()`: Panel de acciones líderes.
- `get_general_board()`: Panel de acciones del mercado general.
- `get_cedears()`: Certificados de Depósito Argentinos.
- `get_current_quote(symbol, settlement)`: Precio actual y puntas (CI, 24hs, 48hs).

### Renta Fija (Bonos y Letras)
- `get_government_bonds()`: Títulos públicos nacionales.
- `get_corporate_bonds()`: Obligaciones Negociables (ONs).
- `get_short_term_government_bonds()`: Letras del Tesoro (LECAPs, etc.).

### Series Históricas (OHLCV)
- `get_daily_history(symbol, from_date, to_date, resolution='D')`: Datos diarios/semanales.
- `get_intraday_history(symbol, from_date, to_date)`: Datos minuto a minuto.

### Data de Empresas
- `get_company_info(symbol)`: Datos de contacto y legales de la sociedad.
- `get_equity_profile(symbol)`: Perfil técnico de la especie (ISIN, moneda, etc.).
- `get_company_management(symbol)`: Información sobre el directorio.
- `get_company_balance(symbol)`: Datos del último balance presentado.

---


## Instalación

```bash
pip install PyOBD
```

---

## Conclusión

PyOBD v0.3.0 se consolida como una herramienta esencial para la consulta de datos de BYMA en Python. La unificación de los repositorios y la compatibilidad con `pyhomebroker` simplifican enormemente el flujo de trabajo para analistas y desarrolladores.

---
