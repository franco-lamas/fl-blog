---
title: "Migrando mi blog de Hugo a Astro"
description: "Por qué decidí migrar mi blog personal de Hugo a Astro y cómo fue el proceso de transición."
pubDate: 2024-08-03
author: "Franco Lamas"
category: "web"
tags: ["hugo", "astro", "estaticos"]
---

Después de casi un año usando Hugo para mi blog personal, decidí migrar a Astro. En este post cuento por qué y cómo fue el proceso.

# ¿Por qué cambiar de Hugo?

Hugo es un excelente generador de sitios estáticos: rápido, con una comunidad activa y miles de themes disponibles. Sin embargo, con el tiempo encontré algunas limitaciones:

- **Templating complejo:** Las plantillas de Hugo usan una sintaxis propia que se vuelve difícil de mantener a medida que el sitio crece.
- **Dependencia de shortcodes:** Funciones como el `{{< toc >}}` o shortcodes personalizados son útiles, pero acoplan mucho el contenido al motor de Hugo.
- **Docker como necesidad:** Para desarrollo local necesitaba Docker, lo que añadía complejidad al flujo de trabajo.

Astro ofrecía una alternativa más moderna y flexible.

# ¿Qué es Astro?

Astro es un framework web estático que permite usar componentes de React, Vue, Svelte o simplemente Astro components. Algunas ventajas clave:

- **Islands Architecture:** Carga solo el JavaScript que necesita, optimizando el rendimiento.
- **Componentes .astro:** Sintaxis similar a HTML con frontmatter de JavaScript/TypeScript.
- **Output estático por defecto:** Genera HTML puro sin JavaScript innecesario.
- **Integraciones oficiales:** Sitemap, RSS, imágenes optimizadas y más.

# El proceso de migración

## 1. Estructura del proyecto

```bash
npm create astro@latest -- --template minimal
```

La estructura es similar a Hugo pero más explícita:

```
src/
  content/
    blog/          # Posts en Markdown
  components/      # Componentes .astro
  layouts/         # Plantillas base
  pages/           # Rutas del sitio
public/            # Assets estáticos
```

## 2. Schema de contenido

Definí un schema con Zod para validar el frontmatter de los posts:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(5).max(120),
    description: z.string().min(20).max(200),
    pubDate: z.coerce.date(),
    author: z.string().default('Franco Lamas'),
    category: z.string().default('general'),
    tags: z.array(z.string()).min(1),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

## 3. Migración de posts

El proceso fue semi-automático:
- Adaptar el frontmatter de Hugo al formato de Astro.
- Eliminar shortcodes como `{{< toc >}}` y `<!--more-->`.
- Las rutas de imágenes (`/images/...`) se mantienen igual en `public/`.

## 4. Componentes y layouts

Creé componentes reutilizables inspirados en el theme Tranquilpeak de Hugo:

```astro
---
// components/PostCard.astro
const { post } = Astro.props;
---
<article class="post-card">
  <a href={`/blog/${post.id}`}>
    <h2>{post.data.title}</h2>
    <p>{post.data.description}</p>
    <time>{post.data.pubDate.toLocaleDateString('es-AR')}</time>
  </a>
</article>
```

## 5. Deploy a Cloudflare Pages

La integración con Cloudflare Pages es directa:

```bash
npm run build
# Output: dist/
```

Configuré el proyecto en Cloudflare Pages apuntando al directorio `dist/`.

# Resultado

- **Build time:** ~1.2 segundos para 14 páginas.
- **JavaScript innecesario:** Casi cero (solo el toggle de tema).
- **Mantenibilidad:** Mucho mejor con componentes .astro y TypeScript.
- **DX:** Hot reload instantáneo sin Docker.

# Conclusión

Migrar de Hugo a Astro fue una decisión acertada. Si tenés un blog estático y buscás algo más moderno y mantenible, Astro es una excelente opción. La迁移 fue relativamente sencilla y los beneficios en experiencia de desarrollo y rendimiento valen la pena.
