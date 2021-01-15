import React, { memo } from 'react';
import RNLocation from 'react-native-location';
import { Appbar, Caption, HelperText } from 'react-native-paper';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ###
import Button from '../../components/Button';
import FormTextInput from '../../components/FormTextInput';

import TakePhoto from '../../components/TakePhoto';

import { defaultTheme } from '../../theme';
import * as actions from '../CheckInScreen/actions';
import * as selectors from '../CheckInScreen/selectors';
import * as appSelectors from '../App/selectors';
import * as appAction from '../App/actions';

const ReportScreen = ({ navigation, route }) => {
  const {
    params: { shopId, shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isCheckIn = useSelector(selectors.makeSelectIsCheckIn());
  const location = useSelector(appSelectors.makeSelectLocation());
  const granted = useSelector(appSelectors.makeSelectGranted());

  const {
    register,
    setValue,
    handleSubmit,
    errors,
    trigger,
    clearErrors,
  } = useForm({ mode: 'onChange' });

  React.useEffect(() => {
    let locationSubscription = () => {
      return;
    };

    if (!isCheckIn) {
      navigation.navigate('ShopScreen');
    } else {
      if (granted) {
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          (locations) => {
            dispatch(appAction.saveLocation({ location: locations[0] }));
          },
        );
      }
    }

    return () => {
      locationSubscription();
    };
  }, [isCheckIn, navigation, shopId, dispatch, granted]);

  const onSubmit = React.useCallback(
    (values) => {
      if (location) {
        dispatch(
          actions.requestCheckOut({
            ...values,
            shopId,
            latitude: location.latitude,
            longitude: location.longitude,
            incomplete: true,
          }),
        );
      }
    },
    [dispatch, shopId, location],
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Report'} subtitle="" />
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
            error={errors.note}
            clearErrors={clearErrors}
            rules={{ required: true }}
          />

          <TakePhoto
            setValue={setValue}
            isSubmitting={isLoading}
            register={register}
            triggerValidation={trigger}
            shopName={shopName}
          />
          {errors.photo ? (
            <HelperText style={{ color: 'red', textAlign: 'center' }}>
              Cần chụp hình
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}>
            Send Report
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

export default memo(ReportScreen);
