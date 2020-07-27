import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

// ### screens
import {
  LoginScreen,
  ShopNavigator,
  CheckInScreen,
  CheckOutScreen,
  ShopCaptureScreen,
} from './screens';

import { StockStack } from './screens/StockCheckListScreen/Stack';
import { selectors as loginSelectors } from './screens/LoginScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  const isLoggedIn = useSelector(loginSelectors.makeSelectIsLoggedIn());
  const authorization = useSelector(loginSelectors.makeSelectAuthorization());

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator headerMode="none">
        {authorization ? (
          <>
            <Stack.Screen
              name="ShopScreen"
              component={ShopNavigator}
              options={{ gestureEnabled: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="CheckInScreen"
              component={CheckInScreen}
              options={{ gestureEnabled: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="CheckOutScreen"
              component={CheckOutScreen}
              options={{ gestureEnabled: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="StockCheckListScreen"
              component={StockStack}
              options={{
                gestureEnabled: false,
                animationEnabled: false,
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="ShopCaptureScreen"
              component={ShopCaptureScreen}
              options={{ gestureEnabled: false, animationEnabled: false }}
            />
          </>
        ) : (
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              animationTypeForReplace: !isLoggedIn ? 'pop' : 'push',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
