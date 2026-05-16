import "./StatCard.css";

import Card from "./Card";

export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
  colorClass,
}) {

  return (

    <Card className="stats-card">

      <div className={`stats-card__icon ${colorClass}`}>
        {icon}
      </div>

      <div>

        <div className="stats-card__title">
          {title}
        </div>

        <div className="stats-card__value">
          {value}
        </div>

        <div className="stats-card__subtitle">
          {subtitle}
        </div>

      </div>

    </Card>
  );
}