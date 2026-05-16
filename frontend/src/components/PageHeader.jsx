import "./PageHeader.css";

export default function PageHeader({
  title,
  subtitle,
  action,
}) {

  return (
    <div className="page-header">

      <div>

        <h1 className="page-title">
          {title}
        </h1>

        <p className="page-subtitle">
          {subtitle}
        </p>

      </div>

      {action}

    </div>
  );
}