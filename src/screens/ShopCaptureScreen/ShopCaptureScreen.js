import React, { memo } from 'react';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

// ###
import TakePhoto from './components/TakePhoto';

import * as actions from './actions';
import * as selectors from './selectors';
import { selectors as appSelectors, actions as appActions } from '../App';

const ShopCaptureScreen = ({ navigation, route }) => {
  const {
    params: { shopName },
  } = route;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.makeSelectIsLoading());
  const errorMessage = useSelector(selectors.makeSelectErrorMessage());
  const serverTime = useSelector(appSelectors.makeSelectServerTime());

  React.useEffect(() => {
    dispatch(appActions.getServerTime());
  }, [dispatch]);

  const onDismiss = React.useCallback(() => {
    dispatch(actions.setError(''));
  }, [dispatch]);

  return (
    <>
      <TakePhoto
        navigation={navigation}
        shopName={shopName}
        serverTime={serverTime}
      />
      <Snackbar
        visible={!isLoading && !!errorMessage}
        onDismiss={onDismiss}
        duration={4000}>
        {errorMessage}
      </Snackbar>
    </>
  );
};

export default memo(ShopCaptureScreen);
