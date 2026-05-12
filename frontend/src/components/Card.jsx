import "./Card.css";

export default function Card({ children, variant = "default", className = "" }) {
  const cls = ["card", variant === "soft" ? "card--soft" : "", className].filter(Boolean).join(" ");
  return <div className={cls}>{children}</div>;
}
