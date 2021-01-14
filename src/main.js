import React from 'react';
import RNLocation from 'react-native-location';
import { Provider as PaperProvider } from 'react-native-paper';
import { I18nManager, NativeModules } from 'react-native';
import { useColorScheme } from 'react-native-appearance';

import { PreferencesContext } from './context/preferencesContext';
import {
  defaultTheme,
  // darkTheme
} from './theme';

import { RootNavigator } from './rootNavigator';
import { useDispatch } from 'react-redux';
import * as actions from './screens/App/actions';

const ImagePicker = NativeModules.ImageCropPicker;

export const Main = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState(
    colorScheme === 'dark' ? 'dark' : 'light',
  );
  const [rtl] = React.useState(I18nManager.isRTL);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
  }, [rtl]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      toggleRTL,
      theme,
      rtl: rtl ? 'right' : 'left',
    }),
    [rtl, theme, toggleRTL, toggleTheme],
  );

  React.useEffect(() => {
    RNLocation.configure({
      distanceFilter: 5.0,
    });
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Location permission',
          message: 'We use your location to demo the library',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    }).then((granted) => {
      if (granted) {
        dispatch(actions.checkLocationPermission({ granted }));
      }
    });

    return () => {
      ImagePicker.clean();
    };
  }, [dispatch]);

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={defaultTheme}>
        <RootNavigator />
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};
