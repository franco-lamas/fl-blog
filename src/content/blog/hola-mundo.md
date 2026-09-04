---
title: "Hola, mundo"
description: "Primer post del blog explicando cómo funciona este sitio construido con Astro."
pubDate: 2026-09-04
author: "Tu Nombre"
tags: ["astro", "introduccion"]
---

¡Bienvenido al blog! Este es el primer post.

## Por qué Astro

Astro genera HTML estático por defecto. Cada página se renderiza en build time y se sirve desde el CDN de Cloudflare sin necesidad de un servidor.

## Cómo publicar

Para crear un nuevo post, solo hay que añadir un archivo Markdown en `src/content/blog/`:

```markdown
---
title: "Mi nuevo post"
description: "Descripción breve para SEO."
pubDate: 2026-09-04
author: "Tu Nombre"
tags: ["astro"]
draft: false
---

Contenido del post...
```

El schema de Zod valida que todos los campos estén presentes y sean correctos antes de que el build llegue a producción.

## Código

Destacado de sintaxis incluido:

```js
const greeting = "Hello, world!";
console.log(greeting);
```

¡Eso es todo! Feliz escritura.
