import "./Button.css";

export default function Button({
  variant = "primary", size = "md", block, className = "", children, ...rest
}) {
  const cls = ["btn", `btn--${variant}`, size === "sm" ? "btn--sm" : "", block ? "btn--block" : "", className]
    .filter(Boolean).join(" ");
  return <button className={cls} {...rest}>{children}</button>;
}
