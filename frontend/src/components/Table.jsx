function Table({ columns, data, renderActions }) {
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
          {data.map((row) => (
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
    </div>
  )
}

export default Table
