---
'vue-styleguidist': patch
---

force app.close() when using Ctrl-C so that the socket is freed and stops listening on the port
