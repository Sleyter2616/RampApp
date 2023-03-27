// Child
import classNames from "classnames";
import React, { useRef, SyntheticEvent } from "react";
import { InputCheckboxComponent } from "./types";

export const InputCheckbox: InputCheckboxComponent = ({
  id,
  checked = false,
  disabled,
  onChange,
}) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`);

  console.log(`Rendering InputCheckbox component with id ${id}`);

  const handleInputChange = (event: SyntheticEvent<HTMLInputElement>) => {
    console.log(`Checkbox with id ${id} was clicked`);
    onChange(event.currentTarget.checked);
  };

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default React.memo(InputCheckbox);
