import React, { memo } from 'react';
import RNLocation from 'react-native-location';
import { Appbar, Caption, HelperText } from 'react-native-paper';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  NativeModules,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ###
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

import TakePhoto from '../../components/TakePhoto';

import { defaultTheme } from '../../theme';
import * as actions from './actions';
import * as selectors from './selectors';
import * as appSelectors from '../App/selectors';
import * as appActions from '../App/actions';

const ImageCropPicker = NativeModules.ImageCropPicker;

const CheckOutScreen = ({ navigation, route }) => {
  const {
    params: { shopId, shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isCheckIn = useSelector(selectors.makeSelectIsCheckIn());
  const location = useSelector(appSelectors.makeSelectLocation());
  const granted = useSelector(appSelectors.makeSelectGranted());
  const serverTime = useSelector(appSelectors.makeSelectServerTime());

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({ mode: 'onChange' });

  React.useEffect(() => {
    let locationSubscription = () => {
      return;
    };

    if (!isCheckIn) {
      navigation.navigate('ShopScreen');
    } else {
      dispatch(appActions.getServerTime());
      if (granted) {
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          (locations) => {
            dispatch(appActions.saveLocation({ location: locations[0] }));
          },
        );
      }
    }

    return () => {
      locationSubscription();
      ImageCropPicker.clean();
    };
  }, [isCheckIn, navigation, dispatch, granted]);

  const onSubmitCheckList = React.useCallback(
    (values) => {
      if (location) {
        dispatch(
          actions.requestCheckOut({
            ...values,
            shopId,
            latitude: location.latitude,
            longitude: location.longitude,
            incomplete: false,
          }),
        );
      }
    },
    [dispatch, shopId, location],
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        />
        <Appbar.Content title={'Check out'} subtitle="" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView>
          <Caption style={styles.caption}>Thông tin</Caption>
          <TextInput
            label="Ghi chú"
            ref={register('note')}
            onChangeText={(text) => setValue('note', text, true)}
            disabled={isLoading}
          />

          <TakePhoto
            setValue={setValue}
            isSubmitting={isLoading}
            register={register}
            triggerValidation={trigger}
            shopName={shopName}
            serverTime={serverTime}
          />
          {errors.photo ? (
            <HelperText
              type="error"
              style={{ width: '100%', textAlign: 'center' }}>
              Cần chụp hình
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmitCheckList)}
            loading={isLoading}
            disabled={isLoading || !isValid}>
            Check out
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
    paddingHorizontal: 10,
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
  },
});

export default memo(CheckOutScreen);
