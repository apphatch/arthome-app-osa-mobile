import React, { memo } from 'react';
import { Platform, Dimensions } from 'react-native';
import Marker, { Position } from 'react-native-image-marker';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment-timezone';

import { savePicture } from '../../../utils';

// ###
import CameraScreen from '../../../components/CameraScreen';

const TakePhoto = ({ navigation, shopName, serverTime }) => {
  const { width, height } = Dimensions.get('window');

  const onBottomButtonPressed = (event) => {
    switch (event.type) {
      case 'left':
        navigation.goBack();
        break;
      case 'capture':
        const formatTime = moment
          .tz(serverTime, 'Asia/Ho_Chi_Minh')
          .format('HH:mm:ss DD-MM-YYYY');
        let quality = 100;
        if (event.image.size >= 200000) {
          quality = Platform.OS === 'ios' ? 15 : 60;
        }
        ImageResizer.createResizedImage(
          event.image.uri,
          width,
          height,
          'JPEG',
          quality,
          0,
        ).then((res) => {
          Marker.markText({
            src: res.uri,
            color: '#FF0000',
            fontSize: 20,
            X: 30,
            Y: 30,
            scale: 1,
            quality: 100,
            text: `${shopName} ${formatTime}`,
            position: Position.topLeft,
          }).then((path) => {
            const uri =
              Platform.OS === 'android' ? 'file://' + path : 'file:///' + path;

            savePicture(uri);
          });
        });
        break;
      default:
        break;
    }
  };

  return (
    <CameraScreen
      actions={{
        rightButtonText: '',
        leftButtonText: 'Cancel',
      }}
      onBottomButtonPressed={onBottomButtonPressed}
      flashImages={{
        on: require('../../../assets/cameraImages/flashOn.png'),
        off: require('../../../assets/cameraImages/flashOff.png'),
        auto: require('../../../assets/cameraImages/flashAuto.png'),
      }}
      cameraFlipImage={require('../../../assets/cameraImages/cameraFlipIcon.png')}
      captureButtonImage={require('../../../assets/cameraImages/cameraButton.png')}
      showCapturedImageCount={false}
      saveToCameraRoll={false}
    />
  );
};

export default memo(TakePhoto);
