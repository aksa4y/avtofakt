import { gzip } from 'node:zlib'
import { promisify } from 'node:util'

const compress = promisify(gzip)

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', async (event, response) => {
    // Compress public HTML after route caching, independently for each request.
    // API responses and already compressed/static content are left to their handlers.
    if (
      event.method === 'HEAD' ||
      typeof response.body !== 'string' ||
      response.body.length < 1024 ||
      !String(getResponseHeader(event, 'content-type')).startsWith(
        'text/html',
      ) ||
      getResponseHeader(event, 'content-encoding')
    )
      return
    const vary = String(getResponseHeader(event, 'vary') || '')
    if (
      !vary
        .toLowerCase()
        .split(/\s*,\s*/)
        .includes('accept-encoding')
    )
      setHeader(
        event,
        'Vary',
        [vary, 'Accept-Encoding'].filter(Boolean).join(', '),
      )
    const acceptsGzip = (getHeader(event, 'accept-encoding') || '')
      .split(',')
      .some((value) => {
        const [encoding, ...parameters] = value.trim().split(';')
        const quality = parameters.find((p) => p.trim().startsWith('q='))
        return (
          encoding === 'gzip' &&
          (!quality || Number(quality.trim().slice(2)) > 0)
        )
      })
    if (!acceptsGzip) return
    response.body = await compress(response.body)
    setHeader(event, 'Content-Encoding', 'gzip')
    removeResponseHeader(event, 'Content-Length')
  })
})
