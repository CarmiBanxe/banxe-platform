---
description: Build and run banxe-platform web in Docker
---

Build and start the web container:

```bash
cd /home/mmber/banxe-platform
make docker-build
make docker-up
```

Access web UI at: http://localhost:3001

Stop:
```bash
make docker-down
```

View logs:
```bash
make docker-logs
```
