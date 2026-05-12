import "./Table.css";

export default function Table({ columns, rows, emptyMessage, rowKey }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={c.width ? { width: c.width } : undefined}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="table-empty">{emptyMessage}</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>{columns.map((c) => <td key={c.key}>{c.render(row)}</td>)}</tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
