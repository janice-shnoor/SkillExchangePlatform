import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function DropdownMenu({ anchorRef, onClose, children }) {
  const menuRef = useRef(null)
  const [position, setPosition] = useState(null)

  useLayoutEffect(() => {
    if (!anchorRef.current || !menuRef.current) return

    const button = anchorRef.current.getBoundingClientRect()
    const menu = menuRef.current.getBoundingClientRect()

    let top = button.bottom + 4

    if (top + menu.height > window.innerHeight - 8) {
      top = button.top - menu.height - 4
    }

    let left = button.right - menu.width

    if (left < 8) left = 8

    setPosition({ top, left })
  }, [anchorRef])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current?.contains(event.target) ||
        anchorRef.current?.contains(event.target)
      ) {
        return
      }

      onClose()
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [anchorRef, onClose])

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
      style={
        position
          ? {
              top: position.top,
              left: position.left,
            }
          : {
              visibility: 'hidden',
            }
      }
    >
      {children}
    </div>,
    document.body
  )
}

export default DropdownMenu