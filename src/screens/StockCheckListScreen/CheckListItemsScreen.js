import React, { memo } from 'react';
import { Appbar, useTheme, List, Divider, Searchbar } from 'react-native-paper';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import { LoadingIndicator } from '../../components/LoadingIndicator';

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
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const isSubmittedDoneAll = useSelector(selectors.makeSelectIsDoneAlled());
  const stocksHasDataNull = useSelector(
    selectors.makeSelectStocksHasDataNull(),
  );

  const [searchText, setSearchText] = React.useState('');
  const [toIndex, setToIndex] = React.useState(0);
  const [isFocusSearchInput, setIsFocusSearchInput] = React.useState(false);
  const debounceSearchTerm = useDebounce(searchText, 1000);
  const searchRef = React.createRef();
  const isOOS = clType.toUpperCase() === 'OOS';
  let flatListRef = React.createRef();

  React.useEffect(() => {
    dispatch(
      actions.fetchStocks({ search: debounceSearchTerm, checkListId: clId }),
    );
  }, [debounceSearchTerm, clId, dispatch]);

  const renderItem = ({ item, index }) => (
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
        });
      }}
      right={props =>
        !isEmpty(item.data) ? (
          <List.Icon {...props} icon="check-circle" color="green" />
        ) : (
          <List.Icon {...props} icon="square-edit-outline" />
        )
      }
    />
  );

  const keyExtractor = item => item.id.toString();

  const _onSearchStockItem = text => {
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
    dispatch(actions.markDoneAll({ clId, clType }));
  }, [dispatch, clId, clType]);

  const showAlert = React.useCallback(() => {
    Alert.alert(
      'Thông báo',
      'Gửi báo cáo thành công',
      [{ text: 'OK', onPress: () => dispatch(actions.resetProps()) }],
      { cancelable: false },
    );
  }, [dispatch]);

  React.useEffect(() => {
    if (isSubmittedDoneAll) {
      showAlert();
    }
  }, [isSubmittedDoneAll, showAlert]);

  const _onPressGoBack = () => {
    navigation.goBack();
    dispatch(actions.fetchCheckList({ shopId }));
  };

  React.useEffect(() => {
    if(toIndex > 0) {
      scrollToOffset();
    }
  }, [stocks]);

  const getItemLayout = (data, index) => {
    return { length: stocks.length, offset: (56 * index), index };
  }

  const scrollToOffset = () => {
    if(toIndex > 0 && flatListRef) {
      let offset = 56 * toIndex;
      flatListRef.scrollToOffset({animated: true, offset: offset});
    }
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={_onPressGoBack} disabled={isLoading} />
        <Appbar.Content title={'Sản phẩm'} subtitle="" />
        {/* With clType is OOS then alway allow send report */}
        {isOOS ? (
          <Appbar.Action
            icon={'upload'}
            onPress={onDoneAll}
          />
          ) : (
          <Appbar.Action
            icon={'upload'}
            disabled={
              stocksHasDataNull ? stocksHasDataNull.length : isLoading || true
            }
            onPress={onDoneAll}
          />
        )}

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
          </View>
          <View style={[styles.container]}>
            <FlatList
              data={stocks}
              ref={(ref) => {flatListRef = ref; }}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              ItemSeparatorComponent={Divider}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                backgroundColor: colors.background,
                paddingBottom: safeArea.bottom,
              }}
              initialNumToRender={toIndex || 15}
            />
          </View>
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
