import React, { memo } from 'react';
import {
  Appbar,
  FAB,
  Snackbar,
  Title,
  Text,
  Caption,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import ImagePicker from '../..//components/ImagePicker';
import CustomToggleButton from '../../components/ToggleButton';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ###
import CustomSwitch from '../../components/Switch';
import CustomSelect from '../../components/Select';
import FormTextInput from '../../components/FormTextInput';
import FormTextArea from '../../components/FormTextArea';
import NumberInput from '../../components/NumberInput';

import { defaultTheme } from '../../theme';
import * as actions from './actions';
import * as selectors from './selectors';

const StockCheckListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const {
    params: {
      clId,
      itemId,
      shopId,
      clType,
      stockName,
      mechanic,
      quantity,
      barcode,
      category,
      rental_type,
    },
  } = route;

  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isSubmitted = useSelector(selectors.makeSelectIsSubmitted());
  const errorMessage = useSelector(selectors.makeSelectErrorMessage());
  const template = useSelector(selectors.makeSelectTemplate(clId));

  // const item = useSelector(selectors.makeSelectCheckListItemById(clId, itemId));
  const item = useSelector(selectors.makeSelectStockById(itemId));

  const [showSnack, setShowSnack] = React.useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    errors,
    clearErrors,
    trigger,
  } = useForm({});

  React.useEffect(() => {
    if (!isLoading) {
      if (isSubmitted) {
        dispatch(actions.resetProps());
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        if (errorMessage && errorMessage.length) {
          setShowSnack(true);
        }
      }
    }
  }, [isLoading, isSubmitted, navigation, errorMessage, dispatch]);

  const onSubmitCheckList = React.useCallback(
    (values) => {
      dispatch(actions.submit({ itemId, data: values, shopId }));
    },
    [dispatch, itemId, shopId],
  );

  const isSOS = clType.toLowerCase() === 'sos';
  const isOOS = clType.toLowerCase() === 'oos';
  const isRental = clType.toLowerCase() === 'rental';
  const isPromotion = clType.toLowerCase() === 'promotion';
  const isNpd = clType.toLowerCase() === 'npd';
  const isOsa = clType.toLowerCase() === 'osa weekend';
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Kiểm tra lỗi'} subtitle="" />
      </Appbar.Header>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.form}>
            <Title style={styles.caption}>{stockName}</Title>
            {isPromotion && (
              <View style={[styles.row, styles.textValue]}>
                <Caption style={styles.caption}>Mechanic</Caption>
                <Text>{mechanic}</Text>
              </View>
            )}
            {isOOS && (
              <View style={[styles.row, styles.textValue]}>
                <Caption style={styles.caption}>Stock</Caption>
                <Text>{quantity}</Text>
              </View>
            )}
            {(isOOS || isNpd || isPromotion || isOsa) && (
              <View style={[styles.row, styles.textValue]}>
                <Caption style={styles.caption}>Barcode</Caption>
                <Text>{barcode}</Text>
              </View>
            )}
            {isRental && (
              <>
                <View style={[styles.row, styles.textValue]}>
                  <Caption style={styles.caption}>Category</Caption>
                  <Text>{category}</Text>
                </View>
                <View style={[styles.row, styles.textValue]}>
                  <Caption style={styles.caption}>Rental type</Caption>
                  <Text>{rental_type}</Text>
                </View>
              </>
            )}
            {Object.keys(template).map((fieldName) => {
              const type = template[fieldName].type;
              const default_value_use =
                template[fieldName].default_value_use || '';

              if (type === 'input') {
                if (isSOS) {
                  return (
                    <NumberInput
                      key={fieldName}
                      name={fieldName}
                      label={fieldName}
                      register={register}
                      setValue={setValue}
                      value={item.data ? item.data[fieldName] : ''}
                      disabled={isLoading}
                      rules={{ required: true }}
                      error={errors[fieldName]}
                      clearErrors={clearErrors}
                    />
                  );
                } else {
                  return (
                    <FormTextInput
                      key={fieldName}
                      name={fieldName}
                      label={fieldName}
                      register={register}
                      setValue={setValue}
                      value={
                        item.data
                          ? item.data[fieldName]
                          : route.params[default_value_use].toString()
                      }
                      disabled={isLoading}
                      clearErrors={clearErrors}
                    />
                  );
                }
              }
              if (type === 'checkbox') {
                return (
                  <CustomSwitch
                    register={register}
                    setValue={setValue}
                    name={fieldName}
                    label={fieldName}
                    key={fieldName}
                    rules={{ required: true }}
                    error={errors[fieldName]}
                    value={item.data ? item.data[fieldName] : false}
                    disabled={isLoading}
                    clearErrors={clearErrors}
                  />
                );
              }
              if (type === 'select') {
                return (
                  <CustomSelect
                    key={fieldName}
                    options={template[fieldName].values.map((val) => {
                      return {
                        value: val,
                        label: val,
                        color:
                          item.data != null && item.data[fieldName] === val
                            ? 'purple'
                            : 'black',
                      };
                    })}
                    register={register}
                    setValue={setValue}
                    name={fieldName}
                    label={fieldName}
                    rules={{ required: true }}
                    error={errors[fieldName]}
                    value={item.data ? item.data[fieldName] : null}
                    disabled={isLoading}
                    clearErrors={clearErrors}
                  />
                );
              }
              if (type === 'radio') {
                return (
                  <CustomToggleButton
                    options={template[fieldName].values}
                    register={register}
                    setValue={setValue}
                    name={fieldName}
                    label={fieldName}
                    key={fieldName}
                    rules={{ required: true }}
                    error={errors[fieldName]}
                    value={item.data ? item.data[fieldName] : ''}
                    disabled={isLoading}
                    clearErrors={clearErrors}
                  />
                );
              }
              if (type === 'textarea') {
                return (
                  <FormTextArea
                    key={fieldName}
                    name={fieldName}
                    label={fieldName}
                    register={register}
                    setValue={setValue}
                    value={item.data ? item.data[fieldName] : ''}
                    disabled={isLoading}
                    clearErrors={clearErrors}
                  />
                );
              }
            })}

            {isRental && (
              <ImagePicker
                setValue={setValue}
                isSubmitting={isLoading}
                register={register}
                triggerValidation={trigger}
              />
            )}
          </View>
          {
            <FAB
              visible={true}
              style={[styles.fab]}
              icon="check-all"
              label="Gửi"
              onPress={handleSubmit(onSubmitCheckList)}
            />
          }
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Snackbar
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}
        duration={4000}>
        Gửi lỗi không thành công
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  caption: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 16,
  },
  form: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textValue: {
    paddingRight: 10,
  },
});

export default memo(StockCheckListScreen);
