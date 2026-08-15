# Running with Docker

The repo ships a multi-stage `Dockerfile` (Next.js standalone output,
runs as a non-root user) and a `docker-compose.yml` with a single
`app` service. Supabase is external — point the app at your hosted
(or self-hosted) Supabase project via env vars; no database container
is included.

## Quick start

1. Copy the env template and fill it in:

   ```bash
   cp .env.local.example .env.local
   ```

2. Build and start (the `--env-file` flag is required — Compose only
   reads `.env` by default for `${VAR}` substitution, and this project
   keeps its config in `.env.local`):

   ```bash
   docker compose --env-file .env.local up --build -d
   ```

3. The app is served on [http://localhost:3000](http://localhost:3000)
   (publish it elsewhere with `HOST_PORT=8080` in `.env.local`).

> Use `HOST_PORT`, not `PORT`, to move the published port. `PORT` is
> what the server listens on _inside_ the container, and `env_file`
> would inject it there — leaving the app on a port the mapping and
> the healthcheck don't target. Compose pins it to 3000 for that
> reason.

## Build-time vs runtime variables

- `NEXT_PUBLIC_*` variables are **inlined into the client bundle at
  build time**. They are passed as Docker build args by
  `docker-compose.yml`. If you change any of them, rebuild:
  `docker compose --env-file .env.local up --build -d`.
- Everything else (`SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`,
  `META_APP_SECRET`, …) is read at **runtime** from `.env.local` via
  `env_file` and is never baked into the image — safe to change with
  just a container restart.

## Plain Docker (no Compose)

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -t wacrm .

docker run -d --env-file .env.local -e PORT=3000 -p 3000:3000 wacrm
```

## Deploying to a low-RAM server

`next build` (and `npm ci` before it) can easily need well over 1GB of
RAM — too much for a small VPS. Instead of building on the server,
build in CI and only pull the finished image there.

1. **CI builds and pushes the image.** `.github/workflows/docker-publish.yml`
   builds the `Dockerfile` on every push to `main` and pushes it to
   GitHub Container Registry as `ghcr.io/<owner>/<repo>:latest`. Add
   your `NEXT_PUBLIC_*` values as repo secrets/variables under
   **Settings > Secrets and variables > Actions** first (they're
   baked into the client bundle at build time, same as local Docker
   builds — see above).

2. **Make the package pullable from the server**, either:
   - Mark the package public (GitHub → your profile → Packages →
     the `zuron` package → Package settings → Change visibility), or
   - `docker login ghcr.io -u <github-username>` on the server with a
     [PAT](https://github.com/settings/tokens) that has `read:packages`.

3. **On the server**, copy only `docker-compose.prod.yml` and
   `.env.local` (no need to clone the repo):

   ```bash
   IMAGE=ghcr.io/<owner>/<repo>:latest \
     docker compose -f docker-compose.prod.yml --env-file .env.local pull

   IMAGE=ghcr.io/<owner>/<repo>:latest \
     docker compose -f docker-compose.prod.yml --env-file .env.local up -d
   ```

   Persist `IMAGE` (and `HOST_PORT` if you use it) by adding them to
   `.env.local` instead of exporting them each time.

4. **To deploy a new version**, re-run steps in 3 after CI finishes —
   no build step runs on the server at any point.

If RAM is still tight for *running* the app (not just building it),
add a small swap file as a safety margin:

```bash
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Notes

- Database migrations under `supabase/` are **not** run by the
  container — apply them with the Supabase CLI as described in the
  README.
- Received attachments are copied into the `chat-media` Supabase
  Storage bucket, because Meta deletes media roughly 30 days after it
  arrives and the copy is the only thing that outlives that. It grows
  with inbound volume, so it's worth watching your project's storage
  quota. Turn it off per account under Settings → WhatsApp →
  Attachment Storage; attachments received while it's off become
  unviewable once Meta drops them. Files over 16 MB (the bucket's
  limit) are never copied.
- Nothing inside the container is scheduled. If you use automation
  Wait steps or flows, point an external scheduler at
  `GET /api/automations/cron` and `GET /api/flows/cron` on this
  deployment, sending the shared secret in the `x-cron-secret` header
  (`AUTOMATION_CRON_SECRET`, see `.env.local.example`). Both return
  503 until that variable is set.
