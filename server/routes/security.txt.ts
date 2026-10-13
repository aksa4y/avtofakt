export default defineEventHandler((event) =>
  sendRedirect(event, '/.well-known/security.txt', 301),
)
