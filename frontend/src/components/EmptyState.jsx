import "./EmptyState.css";

export default function EmptyState({ icon, message }) {
  return (
    <div className="empty">
      {icon && <div className="empty__icon">{icon}</div>}
      <p>{message}</p>
    </div>
  );
}
