---
title: IVI Django API
emoji: 🧠
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# IVI Django API

This Space runs the IVI Django API with PostgreSQL (Neon).

Configure these values under **Settings > Variables and secrets** before
starting the Space:

- `DATABASE_URL`
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=<your-space>.hf.space`
- `CORS_ALLOWED_ORIGINS=https://<github-user>.github.io`
- `CSRF_TRUSTED_ORIGINS=https://<github-user>.github.io`
- `SECURE_SSL_REDIRECT=True`
