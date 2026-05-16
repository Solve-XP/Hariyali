import "./SearchInput.css";

import { IconSearch } from "./Icons";

export default function SearchInput({
  value,
  onChange,
  placeholder,
}) {

  return (
    <div className="search-input">

      <IconSearch />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

    </div>
  );
}