import "./Select.css";

export default function Select({ label, id, className = "", children, ...rest }) {
  const selectId = id || rest.name;
  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={selectId}>{label}</label>}
      <select id={selectId} className={`select ${className}`} {...rest}>
        {children}
      </select>
    </div>
  );
}
