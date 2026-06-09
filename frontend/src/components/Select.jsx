
import "./Select.css";

import {
  useTranslation,
} from "react-i18next";

export default function Select({

  label,

  id,

  className = "",

  children,

  optional = false,

  ...rest

}) {

  const { t } =
    useTranslation();

  const selectId =
    id ||
    rest.name;

  return (

    <div className="field">

      {label && (

        <label
          className="
            field__label
          "
          htmlFor={
            selectId
          }
        >

          {label}

          {optional ? (

            <span
              className="
                field__optional
              "
            >

              {" "}
              (
              {t(
                "common.optional"
              )}
              )

            </span>

          ) : (

            <span
              className="
                field__required
              "
            >
              *
            </span>

          )}

        </label>
      )}

      <select
        id={
          selectId
        }

        className={`select ${className}`}

        {...rest}
      >

        {children}

      </select>

    </div>
  );
}