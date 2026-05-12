import "./StatCard.css";

export default function StatCard({ label, value, hint, trend, icon, iconVariant = "primary" }) {
  const cardCls = iconVariant === "accent" ? "card stat-card stat-card--accent"
                : iconVariant === "info"   ? "card stat-card stat-card--info"
                : "card stat-card";
  const iconCls = iconVariant === "accent" ? "stat-card__icon stat-card__icon--accent"
                : iconVariant === "info"   ? "stat-card__icon stat-card__icon--info"
                : "stat-card__icon";
  return (
    <div className={cardCls}>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {trend && <span className="stat-card__trend">{trend.direction === "down" ? "↓" : "↑"} {trend.value}</span>}
        {hint && !trend && <span className="stat-card__hint">{hint}</span>}
      </div>
      <div className={iconCls}>{icon}</div>
    </div>
  );
}
