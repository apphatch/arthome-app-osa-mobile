import React from 'react';
import TextInput from '../TextInput';

const FormTextArea = (props) => {
  const {
    name,
    register,
    setValue,
    value,
    disabled,
    label,
    clearErrors,
    rules,
  } = props;

  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setValue(name, localValue);
    register({ name }, rules);
  }, [name, register, localValue, setValue, rules]);

  return (
    <TextInput
      label={label}
      ref={register({ name }, rules)}
      onChangeText={(text) => {
        setValue(name, text, true);
        setLocalValue(text);
        clearErrors(name);
      }}
      value={localValue}
      disabled={disabled}
      multiline={true}
      numberOfLines={4}
    />
  );
};

export default React.memo(FormTextArea);
