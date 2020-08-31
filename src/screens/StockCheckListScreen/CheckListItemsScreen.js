import React, { memo } from 'react';
import {
  Appbar,
  useTheme,
  List,
  Divider,
  Searchbar,
  IconButton,
  Dialog,
  Portal,
  RadioButton,
  Button,
} from 'react-native-paper';
import { StyleSheet, View, FlatList, Alert, ScrollView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, zipObjectDeep } from 'lodash';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { PenNote } from '../../assets/icons';

import { defaultTheme } from '../../theme';
import * as selectors from './selectors';
import { logger, useDebounce } from '../../utils';
import * as actions from './actions';

const CheckListItemsScreen = ({ navigation, route }) => {
  const safeArea = useSafeArea();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const {
    params: { clId, shopId, clType },
  } = route;

  const stocks = useSelector(selectors.makeSelectStocks());
  const categories = useSelector(selectors.makeSelectCategoriesOfStocks());
  logger('CheckListItemsScreen -> stocks', stocks);
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isSubmittedDoneAll = useSelector(selectors.makeSelectIsDoneAlled());
  const stocksHasDataNull = useSelector(
    selectors.makeSelectStocksHasDataNull(),
  );

  const [visibleFilter, setVisibleFilter] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [isFocusSearchInput, setIsFocusSearchInput] = React.useState(false);
  const debounceSearchTerm = useDebounce(searchText, 1000);
  const [toIndex, setToIndex] = React.useState(0);

  const searchRef = React.createRef();
  const isOOS = clType.toUpperCase() === 'OOS';
  let flatListRef = React.createRef();

  React.useEffect(() => {
    if (toIndex > 0) {
      scrollToPosition();
    }
  }, [scrollToPosition, toIndex]);

  React.useEffect(() => {
    dispatch(
      actions.fetchStocks({
        search: debounceSearchTerm,
        checkListId: clId,
        filter: filterValue,
      }),
    );
  }, [debounceSearchTerm, clId, dispatch, filterValue]);

  const getItemLayout = (data, index) => {
    return { length: stocks.length, offset: 56 * index, index };
  };

  const scrollToPosition = React.useCallback(() => {
    if (toIndex > 0 && toIndex <= stocks.length && flatListRef) {
      flatListRef.scrollToIndex({ animated: true, index: toIndex });
    }
  }, [flatListRef, toIndex, stocks]);

  const renderItem = ({ item, index }) => {
    return (
      <List.Item
        title={item.stock_name}
        titleNumberOfLines={3}
        onPress={() => {
          setToIndex(index);
          navigation.navigate('FormScreen', {
            itemId: item.id,
            clId,
            shopId,
            clType,
            stockName: item.stock_name,
            mechanic: item.mechanic,
            barcode: item.barcode,
            quantity: item.quantity,
            rental_type: item.rental_type || null,
            category: item.category || null,
          });
        }}
        right={(props) =>
          !isEmpty(item.data) ? (
            <List.Icon {...props} icon="check-circle" color="green" />
          ) : (
            <List.Icon
              {...props}
              icon={() => <PenNote width="100%" fill="black" />}
            />
          )
        }
      />
    );
  };

  const keyExtractor = (item) => item.id.toString();

  const _onSearchStockItem = (text) => {
    setSearchText(text);
  };

  const _onFocus = () => {
    setIsFocusSearchInput(true);
  };
  const _onBlur = () => {
    setIsFocusSearchInput(false);
  };
  const _onIconPress = () => {
    searchRef.current && searchRef.current.blur();
  };

  const onDoneAll = React.useCallback(() => {
    if (stocksHasDataNull.length <= 0) {
      Alert.alert(
        'Thông báo',
        'Báo cáo đã được gửi!',
        [{ text: 'OK', onPress: () => _onPressGoBack() }],
        { cancelable: false },
      );
    } else {
      dispatch(actions.markDoneAll({ clId, clType }));
    }
  }, [dispatch, clId, clType, stocksHasDataNull, _onPressGoBack]);

  const showAlert = React.useCallback(() => {
    Alert.alert(
      'Thông báo',
      'Gửi báo cáo thành công!',
      [{ text: 'OK', onPress: () => dispatch(actions.resetProps()) }],
      { cancelable: false },
    );
  }, [dispatch]);

  React.useEffect(() => {
    if (isSubmittedDoneAll) {
      showAlert();
    }
  }, [isSubmittedDoneAll, showAlert]);

  const _onPressGoBack = React.useCallback(() => {
    navigation.goBack();
    dispatch(actions.fetchCheckList({ shopId }));
  }, [navigation, dispatch, shopId]);

  const showDialog = () => setVisibleFilter(true);

  const hideDialog = () => {
    setVisibleFilter(false);
  };

  const submitFilter = () => {
    setSelectedOption(selectedOption);
    setFilterValue(selectedOption);
    setVisibleFilter(false);
  };

  const clearFilter = () => {
    setSelectedOption('');
    setFilterValue('');
    setVisibleFilter(false);
  };

  const changeOption = (value) => {
    setSelectedOption(value);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={_onPressGoBack} disabled={isLoading} />
        <Appbar.Content title={'Sản phẩm'} subtitle="" />
        {/* <Appbar.Action
          icon={'upload'}
          onPress={onDoneAll}
          disabled={stocksHasDataNull.length > 0 ? true : false}
        /> */}
      </Appbar.Header>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <View style={styles.row}>
            <Searchbar
              placeholder="Tìm kiếm..."
              onChangeText={_onSearchStockItem}
              value={searchText}
              style={styles.searchbar}
              icon={isFocusSearchInput ? 'keyboard-backspace' : 'magnify'}
              onFocus={_onFocus}
              onBlur={_onBlur}
              onIconPress={_onIconPress}
              ref={searchRef}
              autoCorrect={false}
              autoCompleteType="off"
              spellCheck={false}
            />
            <IconButton
              icon="filter"
              color="gray"
              size={20}
              onPress={showDialog}
            />
          </View>
          <View style={[styles.container]}>
            <FlatList
              data={stocks}
              ref={(ref) => {
                flatListRef = ref;
              }}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              ItemSeparatorComponent={Divider}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                backgroundColor: colors.background,
                paddingBottom: safeArea.bottom,
              }}
              initialNumToRender={toIndex || 15}
              initialScrollIndex={toIndex > stocks.length ? 0 : toIndex}
            />
          </View>
          <Portal>
            <Dialog visible={visibleFilter} onDismiss={hideDialog}>
              <Dialog.Title>Filter by</Dialog.Title>
              <Dialog.ScrollArea style={{ maxHeight: '90%' }}>
                <ScrollView>
                  <RadioButton.Group
                    onValueChange={(value) => changeOption(value)}
                    value={selectedOption}>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((item) => (
                        <RadioButton.Item
                          key={item}
                          label={item}
                          value={item}
                        />
                      ))}
                  </RadioButton.Group>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button color="red" onPress={clearFilter}>
                  Clear
                </Button>
                <Button onPress={submitFilter}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: defaultTheme.colors.background,
  },
  searchbar: {
    margin: 4,
    flex: 1,
    elevation: 0,
    backgroundColor: 'transparent',
  },
});

export default memo(CheckListItemsScreen);
