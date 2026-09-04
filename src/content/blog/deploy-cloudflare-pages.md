---
title: "Desplegar en Cloudflare Pages"
description: "Guía para desplegar un blog Astro en Cloudflare Pages de forma gratuita."
pubDate: 2026-08-30
author: "Tu Nombre"
tags: ["cloudflare", "deploy", "astro"]
---

Cloudflare Pages es la forma más sencilla de desplegar un proyecto Astro.

## Requisitos

- Una cuenta de GitHub o GitLab
- Cuenta de Cloudflare gratuita

## Opción A: Integración con Git (recomendada)

1. Sube tu proyecto Astro a GitHub.
2. En el dashboard de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona tu repositorio y rama `main`.
4. Configura:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Listo. Cada push a `main` despliega automáticamente.

## Opción B: Wrangler CLI

```bash
npx astro build
npx wrangler pages deploy dist --project-name=mi-blog
```

## El pipeline

```
git push → Cloudflare clona el repo
         → npm install
         → npm run build
         → sube dist/ al edge network
         → invalida caché del CDN
```

Tu sitio está live en **~45 segundos** después del push.

## Costo

**$0/mes.** Hosting ilimitado estático, CDN global, y HTTPS incluido en el plan gratuito.
