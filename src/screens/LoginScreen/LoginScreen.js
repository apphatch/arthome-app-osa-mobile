import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { ScrollView, StyleSheet } from 'react-native';

// ### components
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

// ### validations
import { emailValidator, passwordValidator } from './validations';

import * as actions from './actions';
import * as selectors from './selectors';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());

  const [username, setUsername] = useState({ value: 'test01', error: '' });
  const [password, setPassword] = useState({ value: 'password', error: '' });
  const [error, setError] = useState('');

  const _onLoginPressed = React.useCallback(() => {
    const usernameError = emailValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    dispatch(actions.requestLogin(username.value, password.value, setError));
  }, [dispatch, password, username]);

  const _onSubmitEditing = () => {
    _onLoginPressed();
  };

  return (
    <Background>
      <ScrollView style={styles.container} contentContainerStyle={styles.form}>
        <Logo />

        <Header>Xin chào.</Header>

        <TextInput
          label="Tài khoản"
          returnKeyType="next"
          value={username.value}
          onChangeText={(text) => setUsername({ value: text, error: '' })}
          error={!!username.error}
          errorText={username.error}
          autoCapitalize="none"
          textContentType="none"
          disabled={isLoading}
        />

        <TextInput
          label="Mật khẩu"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          disabled={isLoading}
          onSubmitEditing={_onSubmitEditing}
        />

        <Button
          mode="contained"
          onPress={_onLoginPressed}
          loading={isLoading}
          disabled={isLoading}>
          Đăng nhập
        </Button>
      </ScrollView>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}>
        {error}
      </Snackbar>
    </Background>
  );
};

const styles = StyleSheet.create({
  form: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: 340,
  },
  container: {
    flex: 1,
    width: '100%',
  },
});

export default memo(LoginScreen);
