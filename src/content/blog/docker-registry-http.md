---
title: "Configurar Docker Login con Registry HTTP (Insecure)"
description: "Cómo configurar Docker para permitir login en registries HTTP sin certificados SSL."
pubDate: 2026-02-23
author: "Franco Lamas"
category: "devops"
tags: ["docker", "registry", "containers"]
draft: true
---

Guía completa para configurar Docker y permitir login en registries HTTP sin certificados SSL, incluyendo configuración en Linux, Docker Desktop y mejores prácticas de seguridad.


## Introducción

Por defecto, Docker requiere que todos los registries utilicen HTTPS con certificados válidos. Sin embargo, en entornos de desarrollo local, laboratorios o redes privadas, puede ser necesario conectarse a registries HTTP sin cifrado.

### ⚠️ Advertencia de seguridad

**IMPORTANTE:** Los registries HTTP inseguros NO deben usarse en producción porque:

- Las credenciales se transmiten sin cifrar
- Las imágenes pueden ser interceptadas o modificadas
- No hay autenticación de la identidad del servidor
- Vulnerables a ataques man-in-the-middle

**Usa esta configuración SOLO en:**
- Entornos de desarrollo local
- Redes privadas aisladas
- Laboratorios de prueba
- Cuando tengas control completo de la red

## Escenarios de uso

### Cuándo necesitas un registry HTTP inseguro:

1. **Registry local para desarrollo:**
```bash
localhost:5000
192.168.1.100:5000
```

2. **Registry interno sin certificados:**
```bash
registry.local:5000
harbor.internal:80
```

3. **Entornos de prueba:**
```bash
dev-registry.company.local:5000
```

## Método 1: Configurar daemon.json (Linux - Recomendado)

Este es el método recomendado para sistemas Linux con Docker Engine.

### Paso 1: Editar o crear daemon.json

El archivo de configuración está en `/etc/docker/daemon.json`. Si no existe, créalo:

```bash
sudo nano /etc/docker/daemon.json
```

### Paso 2: Agregar el registry inseguro

Si el archivo está **vacío**, agrega:

```json
{
  "insecure-registries": ["192.168.1.100:5000"]
}
```

Si el archivo **ya tiene contenido**, agrégalo respetando la sintaxis JSON:

```json
{
  "insecure-registries": ["192.168.1.100:5000", "localhost:5000"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

**Múltiples registries:**

```json
{
  "insecure-registries": [
    "192.168.1.100:5000",
    "localhost:5000",
    "registry.local:5000",
    "10.0.0.50:8080"
  ]
}
```

### Paso 3: Reiniciar Docker daemon

Aplica los cambios reiniciando el servicio:

```bash
sudo systemctl restart docker
```

### Paso 4: Verificar la configuración

Comprueba que el daemon se reinició correctamente:

```bash
sudo systemctl status docker
```

Verifica que el registry inseguro esté configurado:

```bash
docker info | grep -A 10 "Insecure Registries"
```

Deberías ver algo como:

```
Insecure Registries:
  192.168.1.100:5000
  localhost:5000
  127.0.0.0/8
```

## Método 2: Docker Desktop (Windows/Mac)

### Windows

1. Abre Docker Desktop
2. Haz clic en el icono de configuración (⚙️)
3. Ve a **Docker Engine**
4. Edita el JSON y agrega:

```json
{
  "insecure-registries": ["192.168.1.100:5000"]
}
```

5. Haz clic en **Apply & Restart**

### macOS

1. Abre Docker Desktop
2. Haz clic en el icono de Docker en la barra de menú
3. Selecciona **Preferences** → **Docker Engine**
4. Edita el JSON:

```json
{
  "insecure-registries": ["192.168.1.100:5000"]
}
```

5. Haz clic en **Apply & Restart**

## Método 3: Configuración específica para Debian/Ubuntu

En sistemas Debian/Ubuntu, también puedes configurar usando systemd override.

### Opción A: Usando daemon.json (Recomendado)

Sigue el Método 1 descrito anteriormente.

### Opción B: Usando systemd override

1. Crea un archivo override:

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo nano /etc/systemd/system/docker.service.d/override.conf
```

2. Agrega el contenido:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// --insecure-registry=192.168.1.100:5000
```

3. Recarga systemd y reinicia Docker:

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

**Nota:** Este método está obsoleto. Usa `daemon.json` preferentemente.

## Usar el registry inseguro

Una vez configurado, puedes interactuar con el registry normalmente.

### Login al registry

```bash
docker login 192.168.1.100:5000
```

Si el registry no requiere autenticación, puedes omitir el login.

### Etiquetar una imagen

```bash
docker tag mi-imagen:latest 192.168.1.100:5000/mi-imagen:latest
```

### Push al registry

```bash
docker push 192.168.1.100:5000/mi-imagen:latest
```

### Pull desde el registry

```bash
docker pull 192.168.1.100:5000/mi-imagen:latest
```

### Listar imágenes en el registry

Si el registry expone la API v2:

```bash
curl http://192.168.1.100:5000/v2/_catalog
```

Ver tags de una imagen:

```bash
curl http://192.168.1.100:5000/v2/mi-imagen/tags/list
```

## Levantar un registry local para pruebas

Si necesitas un registry local rápido para desarrollo:

### Registry básico sin autenticación

```bash
docker run -d -p 5000:5000 --name registry registry:2
```

### Registry con volumen persistente

```bash
docker run -d \
  -p 5000:5000 \
  --name registry \
  -v /mnt/registry:/var/lib/registry \
  registry:2
```

### Registry con autenticación básica

1. Crear directorio para configuración:

```bash
mkdir -p ~/docker-registry/auth
```

2. Crear usuario y contraseña:

```bash
docker run --rm --entrypoint htpasswd httpd:2 -Bbn usuario password > ~/docker-registry/auth/htpasswd
```

3. Levantar el registry:

```bash
docker run -d \
  -p 5000:5000 \
  --name registry \
  -v ~/docker-registry/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  -v /mnt/registry:/var/lib/registry \
  registry:2
```

4. Login:

```bash
docker login localhost:5000
# Usuario: usuario
# Password: password
```

## Configuración con Docker Compose

Puedes definir un registry completo con Docker Compose:

```yaml
version: '3.8'

services:
  registry:
    image: registry:2
    container_name: local-registry
    ports:
      - "5000:5000"
    environment:
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
    volumes:
      - ./registry-data:/data
    restart: unless-stopped

  registry-ui:
    image: joxit/docker-registry-ui:latest
    container_name: registry-ui
    ports:
      - "8080:80"
    environment:
      - REGISTRY_TITLE=My Local Registry
      - REGISTRY_URL=http://registry:5000
      - SINGLE_REGISTRY=true
    depends_on:
      - registry
    restart: unless-stopped
```

Levantar:

```bash
docker-compose up -d
```

Acceder a la UI: `http://localhost:8080`

## Solución de problemas comunes

### Error: x509: certificate signed by unknown authority

Este error aparece cuando intentas conectarte a un registry HTTPS con certificado autofirmado.

**Solución 1:** Configúralo como insegure registry (no recomendado para HTTPS)

**Solución 2:** Agrega el certificado a los certificados confiables del sistema

En Debian/Ubuntu:

```bash
sudo mkdir -p /etc/docker/certs.d/192.168.1.100:5000
sudo cp ca.crt /etc/docker/certs.d/192.168.1.100:5000/
sudo systemctl restart docker
```

### Error: http: server gave HTTP response to HTTPS client

Este es el error típico cuando intentas conectarte a un registry HTTP sin configurarlo como inseguro.

**Solución:** Agrega el registry a `insecure-registries` en `daemon.json`:

```json
{
  "insecure-registries": ["192.168.1.100:5000"]
}
```

Reinicia Docker:

```bash
sudo systemctl restart docker
```

### Error: denied: requested access to the resource is denied

Problemas de autenticación o permisos.

**Verificar:**

1. Haz login correctamente:

```bash
docker login 192.168.1.100:5000
```

2. Verifica las credenciales almacenadas:

```bash
cat ~/.docker/config.json
```

3. Si usas autenticación básica, verifica el archivo htpasswd:

```bash
cat ~/docker-registry/auth/htpasswd
```

### Error: failed to resolve reference

El registry no es accesible o el nombre/IP es incorrecto.

**Verificar conectividad:**

```bash
ping 192.168.1.100
curl http://192.168.1.100:5000/v2/
```

Deberías recibir: `{}`

### Docker daemon no reinicia después de cambios

**Verificar errores en daemon.json:**

```bash
sudo journalctl -u docker --no-pager | tail -20
```

**Validar JSON:**

```bash
cat /etc/docker/daemon.json | jq .
```

Si `jq` encuentra errores, corrígelos. JSON no permite comas finales:

```json
// ❌ Incorrecto
{
  "insecure-registries": ["localhost:5000"],
}

// ✅ Correcto
{
  "insecure-registries": ["localhost:5000"]
}
```

### Contenedores no pueden alcanzar el registry

Si usas un registry en `localhost:5000` desde dentro de un contenedor, `localhost` se refiere al contenedor, no al host.

**Soluciones:**

1. **Linux:** Usa `host.docker.internal` (Docker 20.10+):

```bash
docker build -t host.docker.internal:5000/mi-imagen .
```

2. **O usa la IP del host:**

```bash
docker build -t 192.168.1.100:5000/mi-imagen .
```

3. **O usa modo red host:**

```bash
docker run --network host mi-contenedor
```

## Mejores prácticas y alternativas seguras

### 1. Usar túnel SSH para registries remotos

En lugar de HTTP inseguro, crea un túnel SSH:

```bash
ssh -L 5000:localhost:5000 usuario@servidor-remoto
```

Luego usa:

```bash
docker pull localhost:5000/mi-imagen
```

### 2. Proxy reverso con HTTPS

Usa Nginx o Traefik con Let's Encrypt para agregar HTTPS al registry:

**Ejemplo con Nginx:**

```nginx
server {
    listen 443 ssl;
    server_name registry.midominio.com;

    ssl_certificate /etc/letsencrypt/live/registry.midominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/registry.midominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Certificados autofirmados para desarrollo

Si necesitas HTTPS en desarrollo local, genera certificados autofirmados:

```bash
mkdir -p ~/certs
cd ~/certs

# Generar certificado autofirmado
openssl req -newkey rsa:4096 -nodes -sha256 -keyout registry.key \
  -x509 -days 365 -out registry.crt \
  -subj "/CN=localhost"

# Levantar registry con HTTPS
docker run -d \
  -p 5000:5000 \
  --name registry \
  -v ~/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registry.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/registry.key \
  registry:2
```

Luego agrega el certificado a tus certificados confiables del sistema.

### 4. Usar servicios de registry gestionados

Para producción, considera:

- **Docker Hub** (público/privado)
- **GitHub Container Registry** (ghcr.io)
- **GitLab Container Registry**
- **Amazon ECR**
- **Google Container Registry**
- **Azure Container Registry**
- **Harbor** (self-hosted con UI completa)

### 5. Restringir insecure-registries solo a redes privadas

Si debes usar registries HTTP, al menos restringe a IPs privadas:

```json
{
  "insecure-registries": [
    "127.0.0.1:5000",
    "192.168.0.0/16:5000",
    "10.0.0.0/8:5000"
  ]
}
```

### 6. No exponer registries HTTP a internet

Usa firewall para bloquear acceso externo:

```bash
# Permitir solo red local
sudo ufw allow from 192.168.1.0/24 to any port 5000
sudo ufw deny 5000
```

### 7. Implementar autenticación incluso en HTTP

Aunque la conexión sea HTTP, siempre usa autenticación básica como mínimo.

### 8. Rotar credenciales regularmente

Si usas autenticación básica, cambia las credenciales periódicamente:

```bash
docker run --rm --entrypoint htpasswd httpd:2 -Bbn nuevo_usuario nueva_password > ~/docker-registry/auth/htpasswd
docker restart registry
```

### 9. Monitorear accesos al registry

Habilita logs detallados en el registry:

```yaml
log:
  level: info
  formatter: json
  fields:
    service: registry
```

### 10. Considerar Harbor para entornos corporativos

Harbor es un registry empresarial con:
- UI web completa
- Escaneo de vulnerabilidades
- Control de acceso basado en roles (RBAC)
- Replicación entre registries
- Firma de contenido

Instalación con Docker Compose:

```bash
wget https://github.com/goharbor/harbor/releases/download/v2.8.0/harbor-offline-installer-v2.8.0.tgz
tar xzvf harbor-offline-installer-v2.8.0.tgz
cd harbor
./install.sh
```

## Verificación de configuración completa

### Script de verificación

Crea un script para verificar todo:

```bash
#!/bin/bash

REGISTRY="192.168.1.100:5000"

echo "1. Verificando configuración de Docker..."
docker info | grep -A 5 "Insecure Registries"

echo -e "\n2. Verificando conectividad al registry..."
curl -s http://$REGISTRY/v2/ && echo "✓ Registry accesible" || echo "✗ Registry no accesible"

echo -e "\n3. Probando push/pull..."
docker pull hello-world
docker tag hello-world:latest $REGISTRY/hello-world:test
docker push $REGISTRY/hello-world:test && echo "✓ Push exitoso" || echo "✗ Push falló"
docker rmi $REGISTRY/hello-world:test
docker pull $REGISTRY/hello-world:test && echo "✓ Pull exitoso" || echo "✗ Pull falló"

echo -e "\n4. Limpieza..."
docker rmi $REGISTRY/hello-world:test

echo -e "\nVerificación completa."
```

Guarda como `test-registry.sh`, dale permisos y ejecuta:

```bash
chmod +x test-registry.sh
./test-registry.sh
```

## Conclusión

Configurar Docker para usar registries HTTP inseguros es útil para desarrollo y pruebas, pero requiere precauciones:

- ✅ **Úsalo SOLO en desarrollo/testing**
- ✅ **Nunca en producción**
- ✅ **Restringe a redes privadas**
- ✅ **Implementa autenticación básica al menos**
- ✅ **Considera alternativas con HTTPS siempre que sea posible**
- ✅ **Migra a registries seguros para producción**

Recuerda que la seguridad de tus contenedores es tan importante como la seguridad del código que ejecutan. En entornos de producción, siempre usa HTTPS con certificados válidos.

## Referencias

- [Docker Registry Documentation](https://docs.docker.com/registry/)
- [Docker Daemon Configuration](https://docs.docker.com/engine/reference/commandline/dockerd/)
- [Insecure Registries](https://docs.docker.com/registry/insecure/)
- [Harbor Project](https://goharbor.io/)
- [Docker Registry API](https://docs.docker.com/registry/spec/api/)
