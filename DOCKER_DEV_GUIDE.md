# Docker Development Guide

This project has two Docker configurations:

## Development Mode (with Hot Reload) 🔥

For active development with instant code changes:

```bash
# Start development server
docker-compose -f docker-compose.dev.yml up

# Or rebuild and start (only needed if you change dependencies)
docker-compose -f docker-compose.dev.yml up --build

# Stop
docker-compose -f docker-compose.dev.yml down
```

**Features:**
- ✅ Hot reload - changes appear instantly
- ✅ No need to rebuild after code changes
- ✅ Faster startup
- ✅ Source code mounted as volumes

**When to rebuild:**
- When you change `package.json` (add/remove dependencies)
- When you change Dockerfile.dev

## Production Mode (Optimized Build)

For testing production builds or deployment:

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down
```

**Features:**
- ✅ Optimized build
- ✅ Smaller image size
- ✅ Production-ready
- ❌ No hot reload - requires rebuild for every change

## Recommended Workflow

**During Development:**
```bash
# Use dev mode
docker-compose -f docker-compose.dev.yml up
```

**Before Deploying:**
```bash
# Test production build
docker-compose up --build
```

## Troubleshooting

**Changes not appearing?**
- Make sure you're using `docker-compose.dev.yml`
- Check the logs: `docker-compose -f docker-compose.dev.yml logs -f`

**Port already in use?**
- Stop the production container: `docker-compose down`
- Or change the port in docker-compose.dev.yml

**Need to reset everything?**
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```
