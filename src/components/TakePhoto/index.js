import React from 'react';
import ImageResizer from 'react-native-image-resizer';
import Marker, { Position } from 'react-native-image-marker';
import moment from 'moment-timezone';

import {
  View,
  StyleSheet,
  Platform,
  NativeModules,
  Dimensions,
} from 'react-native';
import {
  IconButton,
  Colors,
  Card,
  Button,
  ActivityIndicator,
} from 'react-native-paper';

const ImagePicker = NativeModules.ImageCropPicker;

const TakePhoto = (props) => {
  const {
    setValue,
    isSubmitting,
    register,
    triggerValidation,
    serverTime,
    shopName,
  } = props;

  const [photo, setPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    register({ name: 'photo' }, { required: true });
  }, [register, onRemovePhoto]);

  const onTakePhoto = React.useCallback(() => {
    setIsLoading(true);
    ImagePicker.openCamera({
      cropping: false,
      includeExif: true,
      mediaType: 'photo',
    }).then((image) => {
      if (image) {
        const now = moment
          .tz(serverTime, 'Asia/Ho_Chi_Minh')
          .format('HH:mm:ss DD-MM-YYYY');
        const { width, height } = Dimensions.get('window');
        const { path, size } = image;
        let quality = 100;

        if (size >= 200000) {
          quality = Platform.OS === 'ios' ? 20 : 60;
        }

        ImageResizer.createResizedImage(path, width, height, 'JPEG', quality, 0)
          .then((res) => {
            Marker.markText({
              src: res.uri,
              color: '#FF0000',
              fontSize: 16,
              X: 30,
              Y: 30,
              scale: 1,
              quality: 100,
              text: `${shopName}\n${now}`,
              position: Position.topLeft,
            })
              .then((_path) => {
                const source = {
                  uri:
                    Platform.OS === 'android'
                      ? 'file://' + _path
                      : 'file:///' + _path,
                };
                console.log('source', source);
                setIsLoading(false);
                setPhoto(source);
                setValue('photo', source.uri);
                triggerValidation('photo');
              })
              .catch(() => {
                setIsLoading(false);
              });
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    });
  }, [setValue, triggerValidation, serverTime, shopName]);

  const onRemovePhoto = React.useCallback(() => {
    ImagePicker.clean().then(() => {
      setPhoto(null);
      setValue('photo', null);
      triggerValidation('photo');
    });
  }, [setValue, triggerValidation]);

  return (
    <>
      <View style={styles.row}>
        {isLoading ? (
          <ActivityIndicator animating={true} />
        ) : photo && photo.uri ? null : (
          <IconButton
            icon="camera"
            size={30}
            onPress={onTakePhoto}
            disabled={isLoading}
          />
        )}
      </View>
      <View styles={styles.content}>
        {photo && photo.uri ? (
          <Card>
            <Card.Cover
              source={{
                uri: photo.uri,
              }}
            />
            <Card.Actions>
              <Button onPress={onRemovePhoto} disabled={isSubmitting}>
                Xoá bỏ
              </Button>
            </Card.Actions>
          </Card>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    backgroundColor: Colors.indigo400,
    height: 200,
    width: '100%',
    flex: 1,
  },
  photo: {
    height: 400,
    width: 300,
    flex: 1,
    resizeMode: 'cover',
  },
});

export default React.memo(TakePhoto);
