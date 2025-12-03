# LostAndFound Backend

Simple Express + MongoDB backend for a lost-and-found app.

Getting started

1. Copy `.env.example` to `.env` and update values.
2. Install deps:

```powershell
npm install
```

3. Start server (development):

```powershell
npm run dev
```

API endpoints (examples)

-   `POST /auth/register` { name, email, password }
-   `POST /auth/login` { email, password }
-   `GET /auth/status` (requires cookie)
-   `POST /item/add` (requires auth) create item
-   `GET /item/found` list found items
-   `GET /item/lost` list lost items
