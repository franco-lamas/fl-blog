---
title: "Configuración de Claves SSH en Servidor Debian"
description: "Guía completa para configurar autenticación por claves SSH en servidores Debian."
pubDate: 2026-02-23
author: "Franco Lamas"
category: "linux"
tags: ["debian", "ssh", "seguridad"]
draft: true
---

Guía completa para configurar autenticación por claves SSH en servidores Debian, mejorando la seguridad y eliminando la necesidad de contraseñas.


## Introducción

SSH (Secure Shell) es el protocolo estándar para administrar servidores Linux de forma remota. La autenticación por clave pública es mucho más segura que las contraseñas tradicionales, ya que:

- Elimina el riesgo de ataques de fuerza bruta
- No requiere recordar contraseñas complejas
- Permite automatización segura de scripts
- Cada clave puede ser revocada individualmente

En este tutorial aprenderás a configurar claves SSH en un servidor Debian desde cero.

## Requisitos previos

- Acceso a un servidor Debian (con usuario y contraseña)
- Acceso SSH habilitado en el servidor
- Cliente SSH instalado en tu máquina local

## Paso 1: Generar el par de claves SSH (Cliente)

En tu máquina local (no en el servidor), genera un par de claves SSH:

```bash
ssh-keygen -t ed25519 -C "tu_email@example.com"
```

**Parámetros:**
- `-t ed25519`: Tipo de clave (Ed25519 es más moderno y seguro que RSA)
- `-C`: Comentario para identificar la clave (opcional)

### Alternativa con RSA

Si necesitas compatibilidad con sistemas antiguos, usa RSA con 4096 bits:

```bash
ssh-keygen -t rsa -b 4096 -C "tu_email@example.com"
```

### Proceso interactivo

El comando te pedirá:

```
Enter file in which to save the key (/home/usuario/.ssh/id_ed25519):
```

Presiona Enter para usar la ubicación predeterminada, o especifica una ruta personalizada.

```
Enter passphrase (empty for no passphrase):
```

**Recomendado:** Introduce una contraseña para proteger la clave privada. Esto añade una capa extra de seguridad.

### Verificar las claves generadas

```bash
ls -la ~/.ssh/
```

Deberías ver:
- `id_ed25519` o `id_rsa`: Clave privada (NUNCA compartir)
- `id_ed25519.pub` o `id_rsa.pub`: Clave pública (esta se copia al servidor)

## Paso 2: Copiar la clave pública al servidor

Existen varios métodos para transferir tu clave pública al servidor.

### Método 1: ssh-copy-id (Recomendado)

La forma más sencilla y segura:

```bash
ssh-copy-id usuario@ip_del_servidor
```

Ejemplo:

```bash
ssh-copy-id admin@192.168.1.100
```

Te pedirá la contraseña del usuario una vez. Después de esto, la clave quedará configurada.

### Método 2: Copia manual

Si `ssh-copy-id` no está disponible, puedes copiar manualmente:

```bash
cat ~/.ssh/id_ed25519.pub | ssh usuario@ip_del_servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Método 3: Copia completamente manual

Si tienes acceso físico o a través de consola web:

1. En tu máquina local, muestra la clave pública:

```bash
cat ~/.ssh/id_ed25519.pub
```

2. Copia todo el contenido (empezará con `ssh-ed25519` o `ssh-rsa`)

3. En el servidor, ejecuta:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

4. Pega la clave pública en el archivo y guarda (Ctrl+O, Enter, Ctrl+X)

5. Establece los permisos correctos:

```bash
chmod 600 ~/.ssh/authorized_keys
```

## Paso 3: Configurar permisos correctos (Servidor)

SSH es muy estricto con los permisos. En el servidor, asegúrate de que sean correctos:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Verifica la propiedad de los archivos:

```bash
ls -la ~/.ssh/
```

El propietario debe ser tu usuario, no root.

## Paso 4: Probar la conexión con clave SSH

Desde tu máquina local, intenta conectarte:

```bash
ssh usuario@ip_del_servidor
```

Si todo está configurado correctamente, deberías conectarte sin necesidad de contraseña (o solo introduciendo la passphrase de tu clave privada si la configuraste).

## Paso 5: Configurar el servidor SSH

### Editar la configuración de SSH

En el servidor, con privilegios de superusuario:

```bash
sudo nano /etc/ssh/sshd_config
```

### Configuraciones recomendadas de seguridad

Busca y modifica las siguientes líneas (quita el `#` si están comentadas):

```ini
# Permitir autenticación por clave pública
PubkeyAuthentication yes

# Ubicación del archivo de claves autorizadas
AuthorizedKeysFile .ssh/authorized_keys

# Deshabilitar autenticación por contraseña (¡IMPORTANTE!)
PasswordAuthentication no

# Deshabilitar autenticación de desafío-respuesta
ChallengeResponseAuthentication no

# Deshabilitar login de root
PermitRootLogin no

# Permitir solo usuarios específicos (opcional)
AllowUsers usuario1 usuario2

# Cambiar el puerto SSH (opcional, aumenta seguridad)
# Port 2222
```

**⚠️ ADVERTENCIA:** Antes de deshabilitar `PasswordAuthentication`, asegúrate de que puedes conectarte con tu clave SSH. De lo contrario, podrías quedar bloqueado.

### Verificar la configuración

Antes de reiniciar el servicio, verifica que no haya errores:

```bash
sudo sshd -t
```

Si no muestra errores, todo está bien.

### Reiniciar el servicio SSH

Aplica los cambios:

```bash
sudo systemctl restart sshd
```

O en sistemas más antiguos:

```bash
sudo systemctl restart ssh
```

## Paso 6: Verificación final

### Abrir una nueva terminal

**IMPORTANTE:** No cierres tu sesión SSH actual. Abre una nueva terminal y prueba:

```bash
ssh usuario@ip_del_servidor
```

Deberías poder conectarte con tu clave SSH sin problemas.

### Verificar que las contraseñas están deshabilitadas

Intenta conectarte especificando autenticación por contraseña:

```bash
ssh -o PreferredAuthentications=password usuario@ip_del_servidor
```

Debería rechazarte con un error de permiso denegado.

## Configuración de múltiples claves SSH (Cliente)

Si administras varios servidores, puedes configurar múltiples claves usando el archivo `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Ejemplo de configuración:

```ini
# Servidor de producción
Host servidor-prod
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/id_ed25519_prod

# Servidor de desarrollo
Host servidor-dev
    HostName 192.168.1.101
    User developer
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_dev

# Configuración comodín para GitHub
Host github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
```

Establece permisos:

```bash
chmod 600 ~/.ssh/config
```

Ahora puedes conectarte simplemente con:

```bash
ssh servidor-prod
ssh servidor-dev
```

## Solución de problemas comunes

### Error: Permission denied (publickey)

**Causas posibles:**

1. **Permisos incorrectos en el servidor:**

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

2. **La clave pública no está en authorized_keys:**

Verifica el contenido:

```bash
cat ~/.ssh/authorized_keys
```

3. **SELinux bloqueando (en sistemas con SELinux):**

```bash
restorecon -R ~/.ssh
```

### Error: Too many authentication failures

Ocurre cuando tienes muchas claves. Especifica la clave a usar:

```bash
ssh -i ~/.ssh/id_ed25519 usuario@servidor
```

O configúralo en `~/.ssh/config`.

### Debug de conexión SSH

Para ver información detallada del proceso de conexión:

```bash
ssh -vvv usuario@servidor
```

Esto mostrará cada paso del proceso de autenticación.

### Clave privada con permisos incorrectos

Si tu clave privada tiene permisos muy abiertos, SSH la rechazará:

```bash
chmod 600 ~/.ssh/id_ed25519
```

### El servidor no acepta claves Ed25519

Si el servidor es muy antiguo, usa RSA:

```bash
ssh-keygen -t rsa -b 4096 -C "tu_email@example.com"
```

## Mejores prácticas de seguridad

### 1. Usa passphrase en tus claves privadas

Siempre protege tus claves privadas con una contraseña fuerte.

### 2. Usa ssh-agent para no escribir la passphrase constantemente

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 3. Mantén claves separadas por propósito

No uses la misma clave para trabajo, proyectos personales y servicios como GitHub.

### 4. Rotar claves periódicamente

Genera nuevas claves cada 1-2 años y elimina las antiguas.

### 5. Backup de claves privadas

Guarda copias cifradas de tus claves privadas en un lugar seguro.

### 6. Cambiar el puerto SSH por defecto

Edita `/etc/ssh/sshd_config`:

```ini
Port 2222
```

Esto reduce los escaneos automáticos de bots.

### 7. Implementar fail2ban

Instala fail2ban para bloquear intentos de acceso repetidos:

```bash
sudo apt update
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 8. Limitar usuarios SSH

En `/etc/ssh/sshd_config`:

```ini
AllowUsers usuario1 usuario2
```

O por grupos:

```ini
AllowGroups ssh-users
```

### 9. Deshabilitar login de root

```ini
PermitRootLogin no
```

Siempre usa `sudo` en lugar de root directo.

### 10. Monitorear logs de SSH

Revisa regularmente los intentos de conexión:

```bash
sudo tail -f /var/log/auth.log | grep sshd
```

## Gestión de múltiples usuarios

### Agregar clave SSH para un nuevo usuario

1. Crear el usuario (si no existe):

```bash
sudo adduser nuevo_usuario
```

2. Cambiar a ese usuario:

```bash
sudo su - nuevo_usuario
```

3. Crear directorio SSH:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

4. Agregar la clave pública del usuario:

```bash
nano ~/.ssh/authorized_keys
```

Pega la clave pública y guarda.

5. Establecer permisos:

```bash
chmod 600 ~/.ssh/authorized_keys
exit
```

### Revocar acceso de un usuario

Simplemente elimina su entrada de `~/.ssh/authorized_keys` o elimina el usuario del sistema.

## Conclusión

Ahora tienes configurada la autenticación por claves SSH en tu servidor Debian, mejorando significativamente la seguridad. Recuerda:

- **Nunca compartas tu clave privada**
- **Haz backups cifrados de tus claves**
- **Usa passphrases fuertes**
- **Implementa fail2ban y otras medidas de seguridad**
- **Monitorea los logs regularmente**

La autenticación por clave SSH es uno de los fundamentos de la administración segura de servidores. Con esta configuración, has dado un paso importante hacia una infraestructura más segura.

## Referencias

- [OpenSSH Official Documentation](https://www.openssh.com/)
- [Debian SSH Wiki](https://wiki.debian.org/SSH)
- [SSH Key Best Practices](https://security.stackexchange.com/questions/5096/rsa-vs-dsa-for-ssh-authentication-keys)
