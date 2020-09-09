import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import TextInput from '../TextInput';

const FormTextInput = (props) => {
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
    setValue(name, localValue);
  }, [name, register, rules, localValue, setValue]);

  const handleInputChange = React.useCallback(
    (val) => {
      setValue(name, val, true);
      setLocalValue(val);
      clearErrors(name);
    },
    [name, setValue, clearErrors],
  );

  return (
    <>
      <TextInput
        label={label}
        ref={register({ name }, rules)}
        onChangeText={handleInputChange}
        value={localValue}
        disabled={disabled}
      />
      {error ? (
        <Text accessibilityRole="text" style={styles.textRed}>
          Required
        </Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textRed: {
    color: 'red',
  },
});

export default React.memo(FormTextInput);
