---
title: "Content Collections con Astro y Zod"
description: "Cómo usar content collections para validar tus posts en build time con Zod."
pubDate: 2026-09-03
author: "Tu Nombre"
tags: ["astro", "zod", "contenido"]
---

Las **content collections** son la forma moderna de manejar contenido en Astro.

## ¿Qué son?

Son carpetas de Markdown (o JSON/YAML) con un esquema definido. El esquema se valida con Zod en build time, así cualquier post con frontmatter inválido detiene el build con un error claro.

## Esquema de ejemplo

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

## Beneficios

- **Type safety**: TypeScript autocompleta los campos del frontmatter.
- **Detección temprana**: errores se detectan en dev, no en producción.
- **Rendering tipado**: `getCollection()` te devuelve entradas completamente tipadas.

## Consultar posts

```ts
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => +b.data.pubDate - +a.data.pubDate);
```

Esto excluye drafts y ordena por fecha. Así de simple.
