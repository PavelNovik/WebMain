// Нарезает видео на кадры WebP для фона, который «проигрывается» скроллом.
// Два набора: desktop (весь кадр, ширина до DESKTOP_MAX_WIDTH) и mobile (центральная
// вертикальная часть кадра — на вертикальном экране края всё равно не видны).
// Между кадрами сайт делает плавный переход, поэтому несколько десятков кадров достаточно.
// Кадры кладутся в public/frames/<хеш содержимого>/ — новый набор получает новый адрес,
// поэтому долгий кэш (vercel.json) не показывает старые кадры после перенарезки.
// Запуск: npm run frames  [-- путь/к/видео.mp4]
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import ffmpeg from 'ffmpeg-static'

const input = process.argv[2] || 'video-src/apple-tree.mp4'
const FRAMES = 32
const QUALITY = 50
const DESKTOP_MAX_WIDTH = 1440
const MOBILE_ASPECT = 0.9 // ширина/высота мобильного кадра
const MOBILE_HEIGHT = 720
const outRoot = 'public/frames'
const manifestPath = 'src/generated/frames.json'

const even = (n) => Math.round(n / 2) * 2

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
const fps = `fps=${FRAMES / duration}`

const dWidth = Math.min(width, DESKTOP_MAX_WIDTH)
const dHeight = even((height * dWidth) / width)
const cropW = Math.min(width, even(height * MOBILE_ASPECT))
const mHeight = Math.min(height, MOBILE_HEIGHT)
const mWidth = even((cropW * mHeight) / height)

const sets = {
  desktop: { vf: `${fps},scale=${dWidth}:${dHeight}:flags=lanczos`, width: dWidth, height: dHeight },
  mobile: {
    vf: `${fps},crop=${cropW}:ih:(iw-${cropW})/2:0,scale=${mWidth}:${mHeight}:flags=lanczos`,
    width: mWidth,
    height: mHeight,
  },
}

const tmpRoot = path.join(outRoot, '_tmp')
fs.rmSync(tmpRoot, { recursive: true, force: true })
const hash = createHash('sha256')

let count = Infinity
for (const [name, set] of Object.entries(sets)) {
  const dir = path.join(tmpRoot, name)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const r = spawnSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-i', input, '-an', '-vf', set.vf,
      '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
      path.join(dir, 'f%03d.webp')],
    { stdio: 'inherit' }
  )
  if (r.status !== 0) process.exit(r.status ?? 1)
  const files = fs.readdirSync(dir).sort()
  for (const f of files) hash.update(name + f).update(fs.readFileSync(path.join(dir, f)))
  const bytes = files.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0)
  count = Math.min(count, files.length)
  console.log(`${name}: ${files.length} кадров, ${set.width}×${set.height}, ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}

// Старые наборы удаляем, новый переносим в папку с хешем
const version = hash.digest('hex').slice(0, 10)
for (const entry of fs.readdirSync(outRoot)) {
  if (entry !== '_tmp') fs.rmSync(path.join(outRoot, entry), { recursive: true, force: true })
}
fs.renameSync(tmpRoot, path.join(outRoot, version))

fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      dir: `/frames/${version}`,
      count,
      ext: 'webp',
      desktop: { width: sets.desktop.width, height: sets.desktop.height },
      mobile: { width: sets.mobile.width, height: sets.mobile.height },
    },
    null,
    2
  ) + '\n'
)
console.log(`→ public/frames/${version}/, ${manifestPath}`)
