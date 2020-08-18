import React, { memo } from 'react';
import { Appbar, Caption, Snackbar } from 'react-native-paper';
import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ###
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';

import { defaultTheme } from '../../theme';
import * as actions from './actions';
import * as selectors from './selectors';

const ShopCaptureScreen = ({ navigation, route }) => {
  const {
    params: { shopId, shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const errorMessage = useSelector(selectors.makeSelectErrorMessage());

  const { register, setValue, handleSubmit, triggerValidation } = useForm({
    mode: 'onChange',
  });

  const onSubmitCheckList = React.useCallback(
    (values) => {
      dispatch(actions.requestShopPicture({ ...values, shopId, navigation }));
    },
    [dispatch, shopId, navigation],
  );

  const onDismiss = React.useCallback(() => {
    dispatch(actions.setError(''));
  }, [dispatch]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={shopName} subtitle="" />
      </Appbar.Header>

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <Caption style={styles.caption}>Thông tin</Caption>
          <TextInput
            label="Ghi chú"
            ref={register({ name: 'note' })}
            onChangeText={(text) => setValue('note', text, true)}
            disabled={isLoading}
          />

          <ImagePicker
            isLoading={isLoading}
            setValue={setValue}
            isSubmitting={isLoading}
            register={register}
            triggerValidation={triggerValidation}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmitCheckList)}
            loading={isLoading}
            disabled={isLoading}>
            Gửi
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={!isLoading && !!errorMessage}
        onDismiss={onDismiss}
        duration={4000}>
        {errorMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
    paddingHorizontal: 10,
    flexDirection: 'row',
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
    // justifyContent: 'center',
    // paddingVertical: 8,
    // paddingHorizontal: 16,

    flexWrap: 'wrap',
  },
  textInput: {
    flex: 1,
  },
});

export default memo(ShopCaptureScreen);
