import React, { memo } from 'react';
import { Appbar, List, Divider, useTheme, Caption } from 'react-native-paper';
import { View, StyleSheet, Vibration } from 'react-native';
// import {useSafeArea} from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';
import {
  useBarcodeRead,
  BarcodeMaskWithOuterLayout,
} from '@nartc/react-native-barcode-mask';

// ###
import { defaultTheme } from '../../theme';

const ScanBarCode = ({ navigation }) => {
  // const safeArea = useSafeArea();
  // const {colors} = useTheme();
  const [isBarcodeRead, setIsBarcodeRead] = React.useState(false);

  const {
    // barcodeRead,
    onBarcodeRead,
    onBarcodeFinderLayoutChange,
  } = useBarcodeRead(
    true,
    (data) => data,
    (processed) => {
      scanProcessed(processed);
    },
  );

  const scanProcessed = React.useCallback(
    (barCode) => {
      if (!isBarcodeRead) {
        Vibration.vibrate();
        setIsBarcodeRead(true);
        navigation.navigate('StockScreen', { barCode });
      }
    },
    [isBarcodeRead, navigation],
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Quét mã vạch" subtitle="" />
      </Appbar.Header>
      <View style={[styles.container]}>
        <View style={styles.camContainer}>
          <RNCamera
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            style={styles.preview}
            captureAudio={false}
            onBarCodeRead={onBarcodeRead}>
            <BarcodeMaskWithOuterLayout
              maskOpacity={0.5}
              width={'90%'}
              height={'60%'}
              onLayoutChange={onBarcodeFinderLayoutChange}
              showAnimatedLine={false}
            />
          </RNCamera>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    margin: 4,
    flex: 1,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  camContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  barcodeLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'green',
    top: -150,
    justifyContent: 'center',
  },
});

export default memo(ScanBarCode);
