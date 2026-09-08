import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const ROWS_PER_PAGE = 10

function Table({ columns, data, renderActions }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE)
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const paginatedData = data.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 font-medium text-[var(--text-muted)]"
              >
                {column.label}
              </th>
            ))}

            {renderActions && (
              <th className="px-4 py-3 font-medium text-[var(--text-muted)]">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--border)] last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-[var(--text)]"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}

              {renderActions && (
                <td className="px-4 py-3">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-0.2">
          <p className="text-xs text-[var(--text-muted)]">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--text)] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft
                size={16}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--text)] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      )}
          </div>
  )
}

export default Table
