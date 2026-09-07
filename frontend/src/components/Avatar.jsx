import { useEffect, useState } from 'react'

const URL = import.meta.env.VITE_URL

function Avatar({
  name = '',
  src = '',
  size = 'md',
  className = '',
}) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])

  const initials = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : '?'

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-xl',
    xl: 'h-20 w-20 text-2xl',
  }

  const imageSrc = src
    ? src.startsWith('http')
      ? src
      : `${URL}${src}`
    : ''

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-subtle)] font-semibold text-[var(--primary-hover)] ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={`${name || 'User'} profile`}
          className="block h-full w-full min-h-0 min-w-0 object-cover object-center"
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </div>
  )
}

export default Avatar