# web-platform

## Steps to fresh deploy

### Frontend

- Pull latest code
- `npm i`
- `npm run build`
- `npm run serve &`

Creates a `pm2` process that watches for filesystem changes

## Steps to redeploy

### Frontend

- Pull latest code
- `npm i`
- `npm run build`

The `pm2` daemon watches the `build/` directory, so new compiled code will automatically be served.

### Backend

WIP
