// Нарезает видео на кадры WebP для фона, который «проигрывается» скроллом.
// Два набора: desktop (полный кадр) и mobile (центральная половина кадра — на
// вертикальном экране края всё равно не видны). Между кадрами сайт делает плавный переход,
// поэтому 40 кадров достаточно.
// Запуск: npm run frames  [-- путь/к/видео.mp4]
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ffmpeg from 'ffmpeg-static'

const input = process.argv[2] || 'video-src/webAppletree.mp4'
const FRAMES = 40
const QUALITY = 55
const outRoot = 'public/frames'
const manifestPath = 'src/generated/frames.json'

// Длительность и размер кадра из вывода ffmpeg
const probe = spawnSync(ffmpeg, ['-hide_banner', '-i', input], { encoding: 'utf8' }).stderr
const dur = probe.match(/Duration: (\d+):(\d+):([\d.]+)/)
const size = probe.match(/Video:.*?(\d{2,5})x(\d{2,5})/)
if (!dur || !size) {
  console.error(`Не удалось прочитать видео: ${input}`)
  process.exit(1)
}
const duration = +dur[1] * 3600 + +dur[2] * 60 + +dur[3]
const width = +size[1]
const height = +size[2]
const mobileWidth = Math.floor(width / 4) * 2 // половина ширины, чётное число

const sets = {
  desktop: { vf: `fps=${FRAMES / duration}`, width, height },
  mobile: { vf: `fps=${FRAMES / duration},crop=${mobileWidth}:ih:(iw-${mobileWidth})/2:0`, width: mobileWidth, height },
}

let count = Infinity
for (const [name, set] of Object.entries(sets)) {
  const dir = path.join(outRoot, name)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const r = spawnSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-i', input, '-vf', set.vf,
      '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
      path.join(dir, 'f%03d.webp')],
    { stdio: 'inherit' }
  )
  if (r.status !== 0) process.exit(r.status ?? 1)
  const files = fs.readdirSync(dir)
  const bytes = files.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0)
  count = Math.min(count, files.length)
  console.log(`${name}: ${files.length} кадров, ${set.width}×${set.height}, ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}

fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      count,
      ext: 'webp',
      desktop: { width: sets.desktop.width, height: sets.desktop.height },
      mobile: { width: sets.mobile.width, height: sets.mobile.height },
    },
    null,
    2
  ) + '\n'
)
console.log(`→ ${manifestPath}`)
