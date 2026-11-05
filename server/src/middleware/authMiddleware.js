export function requireAuth(_request, response) {
  response.status(501).json({ message: 'Authentication middleware is not implemented yet.' })
}
