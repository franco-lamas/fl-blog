---
title: "Servicios personalizados en SystemD"
description: "Cómo crear y gestionar servicios personalizados en SystemD para Linux."
pubDate: 2024-08-11
author: "Franco Lamas"
category: "linux"
tags: ["systemd", "linux", "sysadmin"]
---

Servicios personalizados en SystemD.

SystemD es un sistema de inicialización y administración de servicios para Linux que facilita la creación, gestión y monitoreo de servicios en segundo plano (daemons). En este ejemplo, vamos a crear un servicio personalizado para controlar un ventilador de GPU AMD.

## Creación del archivo de servicio

Primero, creamos un archivo con extensión `.service` dentro de la carpeta `/etc/systemd/system/`. Este archivo contendrá la configuración de nuestro servicio:

```ini
[Unit]
Description=AMD GPU Fan
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=user
ExecStart=

[Install]
WantedBy=multi-user.target
```

### Explicación de las secciones del archivo:

- **[Unit]**: Define las dependencias y el orden de inicio del servicio.
  - `Description`: Breve descripción del servicio.
  - `After=network.target`: El servicio se iniciará después de que se configure la red.

- **[Service]**: Configura el comportamiento del servicio.
  - `Type=simple`: Indica que el servicio se inicia directamente a partir del proceso especificado en `ExecStart`.
  - `Restart=always`: Configura el servicio para reiniciarse automáticamente si falla.
  - `RestartSec=1`: Indica que el servicio esperará 1 segundo antes de reiniciarse tras un fallo.
  - `User=user`: Especifica que el servicio se ejecutará bajo el usuario `user`.
  - `ExecStart=`: Aquí debería ir el comando que inicia el servicio (por ejemplo, el script o binario que controla el ventilador de la GPU).

- **[Install]**: Configura cómo y cuándo se activa el servicio.
  - `WantedBy=multi-user.target`: Hace que el servicio se cargue en el nivel de ejecución multiusuario.

## Recargar SystemD

Una vez que hemos creado el archivo del servicio, debemos recargar el demonio de `systemd` para que reconozca los nuevos archivos de servicio:

```sh
sudo systemctl daemon-reload
```

Este comando actualiza `systemd` con cualquier cambio en los archivos de configuración de los servicios sin necesidad de reiniciar el sistema.

## Iniciar el servicio manualmente

Para iniciar el servicio en la sesión actual sin reiniciar el equipo, usamos el siguiente comando:

```sh
sudo systemctl start amd-gpu-fan
```

Este comando ejecuta el servicio inmediatamente, permitiéndonos comprobar si funciona correctamente.

## Habilitar el servicio para inicio automático

Si queremos que el servicio se inicie automáticamente cada vez que arranque el sistema, debemos habilitarlo con:

```sh
sudo systemctl enable amd-gpu-fan
```

Este comando crea un enlace simbólico que garantiza que el servicio se iniciará en el arranque del sistema.
