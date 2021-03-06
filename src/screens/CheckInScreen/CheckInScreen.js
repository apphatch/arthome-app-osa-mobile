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
import Button from '../../components/Button';
import FormTextInput from '../../components/FormTextInput';

import TakePhoto from '../../components/TakePhoto';

import { defaultTheme } from '../../theme';
import * as actions from './actions';
import * as selectors from './selectors';
// import * as shopSelectors from '../ShopScreen/selectors';
import * as appSelectors from '../App/selectors';
import * as appActions from '../App/actions';

const ImageCropPicker = NativeModules.ImageCropPicker;

const CheckInScreen = ({ navigation, route }) => {
  const {
    params: { shopId, shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isCheckIn = useSelector(selectors.makeSelectIsCheckIn());
  // const currentShopChecked = useSelector(
  //   shopSelectors.makeSelectShopById(shopId),
  // );
  const location = useSelector(appSelectors.makeSelectLocation());
  const granted = useSelector(appSelectors.makeSelectGranted());
  const serverTime = useSelector(appSelectors.makeSelectServerTime());

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    clearErrors,
  } = useForm({
    mode: 'onChange',
  });

  React.useEffect(() => {
    let locationSubscription = () => {
      return;
    };

    if (isCheckIn) {
      navigation.navigate('StockCheckListScreen', {
        screen: 'StockCheckListScreen',
        params: { shopId, shopName },
      });
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
  }, [isCheckIn, navigation, shopId, shopName, dispatch, granted]);

  const onSubmitCheckList = React.useCallback(
    (values) => {
      if (location) {
        dispatch(
          actions.requestCheckIn({
            ...values,
            shopId,
            latitude: location.latitude,
            longitude: location.longitude,
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
        <Appbar.Content title={shopName} subtitle="" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView>
          <Caption style={styles.caption}>Thông tin</Caption>
          <FormTextInput
            name="note"
            label="Ghi chú"
            register={register}
            setValue={setValue}
            disabled={isLoading}
            clearErrors={clearErrors}
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
            Check in
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
    flexDirection: 'column',
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

export default memo(CheckInScreen);
