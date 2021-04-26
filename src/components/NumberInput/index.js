import React from 'react';
import TextInput from '../TextInput';

const NumberInput = (props) => {
  const {
    name,
    register,
    setValue,
    value,
    disabled,
    label,
    rules,
    error,
    clearErrors,
  } = props;

  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    register(name, rules);
    setValue(name, localValue);
  }, [name, register, rules, localValue, setValue]);

  const handleInputChange = React.useCallback(
    (val) => {
      if (val.match(/^\d{0,}(\.\d{0,2})?$/)) {
        setValue(name, val, true);
        setLocalValue(val);
        clearErrors(name);
      }
    },
    [name, setValue, clearErrors],
  );

  return (
    <TextInput
      label={label}
      ref={register(name, rules)}
      keyboardType="numeric"
      onChangeText={handleInputChange}
      value={localValue}
      disabled={disabled}
      errorText={error ? 'Require' : null}
    />
  );
};

export default React.memo(NumberInput);
