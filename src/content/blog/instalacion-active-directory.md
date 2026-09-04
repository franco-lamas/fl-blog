---
title: "Instalación de Windows Active Directory"
description: "Tutorial paso a paso para instalar y configurar Active Directory en Windows Server."
pubDate: 2024-10-01
author: "Franco Lamas"
category: "sistemas"
tags: ["windows-server", "active-directory", "sysadmin"]
---

Instalación de Windows Active Directory en Windows Server.


## Configuración de IP estatica

### Paso 1: Abrir Redes e internet
Hacemos click en el icono de Red y apretamos 'Configuracion de REd e internet'

![](/images/2024/AD/AD-1.png)

### Paso 2: Opciones del Adaptador
Hacemos click en el icono 'Cambiar pciones del Adaptador'
![](/images/2024/AD/AD-2.png)

### Paso 3: Puerto
Elegimos nuestro puerto y vamos a propiedades

![](/images/2024/AD/AD-3.png)

### Paso 4: Protocolo IPv4
Hacemos click doble click sobre 'Protocolo de Internet versión 4' 

![](/images/2024/AD/AD-4.png)

### Paso 5: Configuración de IP
Asignamos la IP para el equipo, incluyendo la mascara de subred, puerto de enlace y de ser necesario los servidore sDNS

![](/images/2024/AD/AD-5.png)

Podemos verificar si los cambios fueron realizados abriendo la terminal y escribeindo 'ipconfig'


![](/images/2024/AD/AD-6.png)

## Instalación de Active Directory

### Paso 1: 

Inicia sesión en tu máquina con Windows Server 2019 y abre el Administrador del servidor. Puedes hacer esto haciendo clic en el ícono de Windows y seleccionando "Administrador del servidor" en el menú de inicio.

En el Administrador del servidor, haz clic en "Administrar" y selecciona "Agregar roles y características". Esto abrirá el asistente de Agregar roles y características.

![](/images/2024/AD/AD-7.png)

### Paso 2:
Lee la información proporcionada y haz clic en "Siguiente".

![](/images/2024/AD/AD-8.png)

Tipo de instalación: Selecciona "Instalación basada en roles o basada en características" y haz clic en "Siguiente".

![](/images/2024/AD/AD-9.png)

Seleccionar un servidor: Asegúrate de que tu servidor esté seleccionado y haz clic en "Siguiente".

![](/images/2024/AD/AD-10.png)

### Paso 3:

Roles de servidor: Desplázate hacia abajo y marca "Servicios de dominio de Active Directory".

![](/images/2024/AD/AD-11.png)

Aparecerá una ventana pidiéndote que agregues características requeridas. Haz clic en "Agregar características" y luego en "Siguiente".

![](/images/2024/AD/AD-12.png)

Características: Haz clic en "Siguiente" sin realizar cambios.
![](/images/2024/AD/AD-13.png)

### Paso 5:

AD DS: Aparecerá una breve descripción de los Servicios de dominio de Active Directory. Haz clic en "Siguiente".
![](/images/2024/AD/AD-14.png)

Revisa tu selección y haz clic en "Instalar".
![](/images/2024/AD/AD-15.png)

Espera a que se complete la instalación. Una vez terminada, haz clic en "Cerrar".
![](/images/2024/AD/AD-16.png)

### Paso 6:

Después de que la instalación de AD DS esté completa, aparecerá una notificación en el Administrador del servidor. Haz clic en "Promocionar este servidor a un controlador de dominio".
![](/images/2024/AD/AD-17.png)

### Paso 7:

En la ventana de configuración de implementación, selecciona "Agregar un nuevo bosque" ya que estamos creando un nuevo dominio. Ingresa el nombre del dominio raíz que deseas usar (por ejemplo, tuempresa.com).

![](/images/2024/AD/AD-18.png)

### Paso 8:

Opciones del controlador de dominio: Elige una contraseña para el modo de restauración de servicios de directorio (DSRM) y guárdala de manera segura. Esta contraseña se utiliza para recuperar el controlador de dominio en caso de emergencias. Haz clic en "Siguiente".

![](/images/2024/AD/AD-19.png)

Opciones de DNS: Deja la configuración predeterminada y haz clic en "Siguiente".

![](/images/2024/AD/AD-20.png)

### Paso 6:

Opciones adicionales: Revisa el nombre de dominio NetBIOS, o puedes aceptar el valor predeterminado y hacer clic en "Siguiente".

![](/images/2024/AD/AD-21.png)

Rutas: Especifica las rutas para la base de datos de AD DS, los archivos de registro y SYSVOL. Se recomienda mantener los valores predeterminados y hacer clic en "Siguiente".

![](/images/2024/AD/AD-22.png)

### Paso 7:

Revisa tus selecciones y, cuando estés satisfecho, haz clic en "Siguiente".

![](/images/2024/AD/AD-23.png)

El asistente realizará una verificación de requisitos previos. 

![](/images/2024/AD/AD-24.png)

Espera a que se complete la instalación.

### Paso 8:

Una vez que la instalación haya terminado, tu servidor se reiniciará automáticamente. Después del reinicio, tendrás un controlador de dominio en funcionamiento.
![](/images/2024/AD/AD-25.png)
