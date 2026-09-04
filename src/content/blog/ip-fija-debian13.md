---
title: "Configuración de IP Fija en Debian 13"
description: "Guía completa para configurar una dirección IP estática en Debian 13 usando interfaces o nmcli."
pubDate: 2024-02-01
author: "Franco Lamas"
category: "linux"
tags: ["debian", "networking", "sysadmin"]
---

Guía completa para configurar una dirección IP estática en Debian 13 usando diferentes métodos de línea de comandos.


## Introducción

En Debian 13, existen varias formas de configurar una dirección IP estática. En este tutorial cubriremos dos métodos principales: la configuración tradicional usando el archivo `/etc/network/interfaces` y el método moderno usando NetworkManager a través de la herramienta de línea de comandos `nmcli`.

## Método 1: Usando /etc/network/interfaces

Este es el método tradicional de Debian para configurar interfaces de red. Es ideal para servidores o sistemas donde no se usa NetworkManager.

### Paso 1: Identificar la interfaz de red

Primero, identificamos el nombre de nuestra interfaz de red:

```bash
ip addr show
```

o

```bash
ip link show
```

Esto mostrará algo como `eth0`, `enp0s3`, `ens33`, etc.

### Paso 2: Editar el archivo de configuración

Editamos el archivo de configuración de interfaces con privilegios de superusuario:

```bash
sudo nano /etc/network/interfaces
```

### Paso 3: Configurar la IP estática

Agregamos o modificamos la configuración de nuestra interfaz. Por ejemplo, para la interfaz `enp0s3`:

```ini
auto enp0s3
iface enp0s3 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

**Parámetros:**
- `auto enp0s3`: Inicia la interfaz automáticamente al arrancar
- `iface enp0s3 inet static`: Define la interfaz como estática usando IPv4
- `address`: Dirección IP que queremos asignar
- `netmask`: Máscara de subred
- `gateway`: Puerta de enlace predeterminada
- `dns-nameservers`: Servidores DNS (opcional)

### Paso 4: Reiniciar el servicio de red

Aplicamos los cambios reiniciando el servicio de red:

```bash
sudo systemctl restart networking
```

O reiniciamos la interfaz específica:

```bash
sudo ifdown enp0s3 && sudo ifup enp0s3
```

## Método 2: Usando nmcli (NetworkManager)

NetworkManager es el gestor de red moderno en Debian. El comando `nmcli` nos permite configurarlo desde la terminal.

### Paso 1: Verificar que NetworkManager está activo

```bash
sudo systemctl status NetworkManager
```

Si no está activo, lo iniciamos:

```bash
sudo systemctl start NetworkManager
sudo systemctl enable NetworkManager
```

### Paso 2: Listar las conexiones

Verificamos las conexiones existentes:

```bash
nmcli connection show
```

### Paso 3: Configurar IP estática

Configuramos una nueva conexión con IP estática. Reemplaza `enp0s3` con tu interfaz:

```bash
sudo nmcli connection add \
    type ethernet \
    con-name "static-connection" \
    ifname enp0s3 \
    ipv4.addresses 192.168.1.100/24 \
    ipv4.gateway 192.168.1.1 \
    ipv4.dns "8.8.8.8 8.8.4.4" \
    ipv4.method manual
```

**Parámetros:**
- `type ethernet`: Tipo de conexión
- `con-name`: Nombre de la conexión
- `ifname`: Nombre de la interfaz
- `ipv4.addresses`: IP y máscara en notación CIDR (/24 = 255.255.255.0)
- `ipv4.gateway`: Puerta de enlace
- `ipv4.dns`: Servidores DNS separados por espacios
- `ipv4.method manual`: Método manual (estático)

### Paso 4: Modificar una conexión existente

Si ya existe una conexión y queremos cambiarla a IP estática:

```bash
sudo nmcli connection modify "Wired connection 1" \
    ipv4.addresses 192.168.1.100/24 \
    ipv4.gateway 192.168.1.1 \
    ipv4.dns "8.8.8.8 8.8.4.4" \
    ipv4.method manual
```

### Paso 5: Activar la conexión

Activamos la conexión:

```bash
sudo nmcli connection up "static-connection"
```

O si modificamos una existente:

```bash
sudo nmcli connection down "Wired connection 1"
sudo nmcli connection up "Wired connection 1"
```

## Verificación de la configuración

### Verificar la dirección IP asignada

```bash
ip addr show
```

o

```bash
ip a
```

### Verificar la puerta de enlace

```bash
ip route show
```

### Verificar los servidores DNS

```bash
cat /etc/resolv.conf
```

### Probar la conectividad

Verificamos conectividad con el gateway:

```bash
ping -c 4 192.168.1.1
```

Verificamos conectividad a internet:

```bash
ping -c 4 8.8.8.8
```

Verificamos resolución DNS:

```bash
ping -c 4 google.com
```

## Solución de problemas comunes

### NetworkManager vs networking tradicional

Si tienes NetworkManager instalado y activo, puede entrar en conflicto con `/etc/network/interfaces`. Para evitar esto:

**Opción 1:** Deshabilitar NetworkManager en la interfaz específica editando `/etc/NetworkManager/NetworkManager.conf`:

```ini
[keyfile]
unmanaged-devices=interface-name:enp0s3
```

**Opción 2:** Usar únicamente NetworkManager y no configurar la interfaz en `/etc/network/interfaces`.

### Reinicio completo de la red

Si los cambios no se aplican correctamente, podemos reiniciar NetworkManager:

```bash
sudo systemctl restart NetworkManager
```

O reiniciar el sistema:

```bash
sudo reboot
```

## Conclusión

Ahora tienes una dirección IP estática configurada en tu sistema Debian 13. El método que elijas dependerá de tu entorno:

- **`/etc/network/interfaces`**: Ideal para servidores y sistemas sin entorno gráfico
- **`nmcli`**: Recomendado para sistemas de escritorio con NetworkManager

Recuerda siempre verificar que tu configuración de red no entre en conflicto con otros dispositivos en la red y que uses direcciones IP dentro del rango de tu subred.
