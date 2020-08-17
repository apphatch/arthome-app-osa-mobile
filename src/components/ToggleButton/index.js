import React from 'react';
import { ToggleButton, Text, Caption } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const CustomToggleButton = (props) => {
  const {
    options,
    register,
    name,
    value = '',
    setValue,
    label = 'Switch',
    rules,
    error,
    disabled = false,
    clearErrors,
  } = props;

  const [checked, setChecked] = React.useState(value);

  React.useEffect(() => {
    register({ name }, rules);
    setValue(name, checked, true);
  }, [name, register, rules, checked, setValue]);

  return (
    <View style={[styles.container]}>
      <View style={styles.row}>
        <Caption>{label}</Caption>
        <ToggleButton.Row
          onValueChange={(v) => {
            setChecked(v);
            setValue(name, v, true);
            clearErrors(name);
          }}
          value={checked}
          disabled={disabled}>
          {options.map((o) => (
            <ToggleButton key={o} icon={() => <Text>{o}</Text>} value={o} />
          ))}
        </ToggleButton.Row>
      </View>
      {error ? (
        <Text accessibilityRole="text" style={styles.textRed}>
          Required
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textRed: {
    color: 'red',
  },
});

export default React.memo(CustomToggleButton);
