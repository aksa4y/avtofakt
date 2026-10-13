import type { H3Event } from 'h3'
/** Bound the actual streamed body, including requests without Content-Length. */
export async function readLimitedJson(
  event: H3Event,
  limit: number,
): Promise<unknown> {
  const length = Number(getHeader(event, 'content-length') || 0)
  if (length > limit)
    throw createError({ statusCode: 413, statusMessage: 'Body too large' })
  if (!getHeader(event, 'content-type')?.startsWith('application/json'))
    throw createError({ statusCode: 415, statusMessage: 'JSON required' })
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > limit)
      throw createError({ statusCode: 413, statusMessage: 'Body too large' })
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' })
  }
}
