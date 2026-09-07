import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const uploadDirectory = path.resolve(
  process.cwd(),
  'uploads/avatars'
)

fs.mkdirSync(uploadDirectory, {
  recursive: true,
})

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory)
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()

    const filename =
      `${crypto.randomUUID()}${extension}`

    cb(null, filename)
  },
})

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
])

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new multer.MulterError('LIMIT_UNEXPECTED_FILE')
    )
  }

  cb(null, true)
}

export const uploadAvatarM = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})