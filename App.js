/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import { YellowBox, ActivityIndicator } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ###
import { setupInterceptors } from './src/utils/httpClient';
import configureStore from './src/store/configureStore';
import { Main } from './src/main';
const { store, persistor } = configureStore();

YellowBox.ignoreWarnings(['Require cycle:']);
enableScreens();

setupInterceptors(store);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <SafeAreaProvider>
          <AppearanceProvider>
            <Main />
          </AppearanceProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
