# Event Management System

A JavaScript full-stack starter with a Vite/React client and an Express/MongoDB API.

## Run locally

1. From this folder, install dependencies with `npm install`.
2. Review the values in `.env`; start MongoDB if you want database-backed event queries.
3. Run both applications with `npm run dev`.

The client runs on Vite's local development port and proxies `/api` requests to the server on port 5000. The server exposes `GET /api/health` and `GET /api/events`.

Auth, event creation, and registration handlers are starter placeholders; they return a not-implemented response until completed.
