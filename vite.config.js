import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// Custom Vite plugin to support saving uploaded high-quality videos to public/uploads
// and persisting site configuration on disk during development/preview, alongside IndexedDB/localStorage.
function naveenLocalStoragePlugin() {
  return {
    name: 'naveen-local-storage-plugin',
    configureServer(server) {
      const uploadsDir = path.resolve(process.cwd(), 'public/uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      server.middlewares.use('/api/upload-media', (req, res, next) => {
        if (req.method !== 'POST') return next()

        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks)
            const rawFilename = req.headers['x-file-name'] || `video-${Date.now()}.mp4`
            const safeFilename = `${Date.now()}-${String(rawFilename).replace(/[^a-zA-Z0-9._-]/g, '_')}`
            const filePath = path.join(uploadsDir, safeFilename)
            fs.writeFileSync(filePath, buffer)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              ok: true,
              url: `/uploads/${safeFilename}`,
              filename: safeFilename,
              size: buffer.length
            }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: err.message }))
          }
        })
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), naveenLocalStoragePlugin()],
})
