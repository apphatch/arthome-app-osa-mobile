import React, { memo } from 'react';
import { Appbar, Caption } from 'react-native-paper';
import { StyleSheet, KeyboardAvoidingView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ###
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Paragraph from '../../components/Paragraph';
import FormTextInput from '../../components/FormTextInput';

import TakePhoto from './components/TakePhoto';

import { defaultTheme } from '../../theme';
import * as actions from './actions';
import * as selectors from './selectors';
import * as shopSelectors from '../ShopScreen/selectors';

const CheckInScreen = ({ navigation, route }) => {
  const {
    params: { shopId, shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isCheckIn = useSelector(selectors.makeSelectIsCheckIn());
  const isReport = useSelector(selectors.makeSelectIsReport());
  const currentShopChecked = useSelector(
    shopSelectors.makeSelectShopById(shopId),
  );

  const {
    register,
    setValue,
    handleSubmit,
    errors,
    formState,
    trigger,
    clearErrors,
  } = useForm({
    mode: 'onChange',
  });

  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    if (isCheckIn) {
      navigation.navigate('StockCheckListScreen', {
        screen: 'StockCheckListScreen',
        params: { shopId, shopName },
      });
    }
    if (isReport) {
      navigation.goBack();
      dispatch(actions.resetReport());
    }
  }, [isCheckIn, navigation, shopId, shopName, isReport, dispatch]);

  const onSubmitCheckList = React.useCallback(
    (values) => {
      dispatch(actions.requestCheckIn({ ...values, shopId }));
    },
    [dispatch, shopId],
  );

  const report = React.useCallback(
    (values) => {
      console.log(values);
      if (!values.note) {
        setErr(true);
      } else {
        setErr(false);
        dispatch(
          actions.requestCheckOut({ ...values, shopId, incomplete: true }),
        );
      }
    },
    [dispatch, shopId],
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={shopName} subtitle="" />
        <Appbar.Action
          size={50}
          icon={() => (
            <Text
              style={{ color: 'white', lineHeight: 50, textAlign: 'center' }}>
              Report
            </Text>
          )}
          onPress={handleSubmit(report)}
          style={{
            height: '100%',
          }}
          disabled={isLoading || !formState.isValid}
        />
      </Appbar.Header>

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Caption style={styles.caption}>Thông tin</Caption>
        <FormTextInput
          name="note"
          label="Ghi chú"
          register={register}
          setValue={setValue}
          disabled={isLoading}
          clearErrors={clearErrors}
          error={err}
          errorText="Cần nhập ghi chú"
        />

        <TakePhoto
          setValue={setValue}
          isSubmitting={isLoading}
          register={register}
          triggerValidation={trigger}
          shop={currentShopChecked}
        />
        {errors.photo ? <Paragraph>Cần chụp hình</Paragraph> : null}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmitCheckList)}
          loading={isLoading}
          disabled={isLoading || !formState.isValid}>
          Check in
        </Button>
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

export default memo(CheckInScreen);
