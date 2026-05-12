import { useState } from "react";
import "./Input.css";
import { IconEye, IconEyeOff } from "./Icons";

export default function Input({ label, id, className = "", type = "text", ...rest }) {
  const inputId = id || rest.name;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <div className={isPassword ? "field__password-wrap" : undefined}>
        <input id={inputId} type={resolvedType} className={`input ${className}`} {...rest} />
        {isPassword && (
          <button
            type="button"
            className="field__eye-btn"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
          >
            {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
