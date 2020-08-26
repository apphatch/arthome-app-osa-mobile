import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, HelperText } from 'react-native-paper';
import { defaultTheme } from '../../theme';

const TextInput = ({ errorText, ...props }) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={defaultTheme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      {...props}
    />
    <HelperText type="error" visible={errorText ? true : false}>
      {errorText}
    </HelperText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: defaultTheme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: defaultTheme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
