// Готовит видео для «перемотки скроллом»: каждый кадр — ключевой (all-intra) + faststart.
// Обычное видео содержит ключевые кадры редко, и при перемотке браузер тормозит.
// Запуск: npm run video  (исходник: video-src/webAppletree.mp4)
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import ffmpeg from 'ffmpeg-static'

const input = process.argv[2] || 'video-src/webAppletree.mp4'
const output = process.argv[3] || 'public/video/webAppletree-scrub.mp4'

const args = [
  '-hide_banner', '-y',
  '-i', input,
  '-an',
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '22',
  '-g', '1', '-keyint_min', '1', '-sc_threshold', '0',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  output,
]

const r = spawnSync(ffmpeg, args, { stdio: 'inherit' })
if (r.status !== 0) process.exit(r.status ?? 1)
console.log(`\n${output}: ${(fs.statSync(output).size / 1024 / 1024).toFixed(2)} MB`)
