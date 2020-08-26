import React from 'react';
import TextInput from '../TextInput';

const FormTextInput = (props) => {
  const {
    name,
    register,
    setValue,
    value,
    disabled,
    label,
    clearErrors,
    error,
    errorText,
    rules,
  } = props;

  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setValue(name, localValue);
  }, [name, localValue, setValue]);

  return (
    <TextInput
      label={label}
      ref={register({ name: name }, rules)}
      onChangeText={(text) => {
        setValue(name, text, true);
        setLocalValue(text);
        clearErrors(name);
      }}
      value={localValue}
      disabled={disabled}
      errorText={error ? errorText : null}
    />
  );
};

export default React.memo(FormTextInput);
