import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url
  const userAgent = req.get('User-Agent') || 'Unknown'
  const ip = req.ip || req.connection.remoteAddress || 'Unknown'

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`)

  // Log response time
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const statusCode = res.statusCode
    const statusColor = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m'
    const resetColor = '\x1b[0m'

    console.log(`[${timestamp}] ${method} ${url} - ${statusColor}${statusCode}${resetColor} - ${duration}ms`)
  })

  next()
}
