import React from 'react';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Marker, { Position } from 'react-native-image-marker';
import moment from 'moment-timezone';

import { View, StyleSheet, Platform } from 'react-native';
import {
  IconButton,
  Colors,
  Card,
  Button,
  ActivityIndicator,
} from 'react-native-paper';

import { logger } from '../../../../utils';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const TakePhoto = (props) => {
  const { setValue, isSubmitting, register, triggerValidation } = props;

  const [photo, setPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    register({ name: 'photo' }, { required: true });
  }, [register]);

  const onTakePhoto = React.useCallback(() => {
    setIsLoading(true);
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        setIsLoading(false);
      } else if (response.error) {
        setIsLoading(false);
      } else if (response.customButton) {
      } else {
        const now = moment()
          .tz('Asia/Ho_Chi_Minh')
          .format('HH:mm:ss DD-MM-YYYY');
        const { uri, error, originalRotation } = response;
        let rotation = 0;
        if (uri && !error) {
          if (originalRotation === 90) {
            rotation = 90;
          } else if (originalRotation === 270) {
            rotation = -90;
          }
        }

        ImageResizer.createResizedImage(uri, 960, 720, 'JPEG', 60, rotation)
          .then((res) => {
            Marker.markText({
              src: res.uri,
              color: '#FF0000',
              fontSize: 14,
              X: 30,
              Y: 30,
              scale: 1,
              quality: 100,
              text: `${now}`,
              position: Position.topLeft,
            })
              .then((path) => {
                const source = {
                  uri:
                    Platform.OS === 'android'
                      ? 'file://' + path
                      : 'file:///' + path,
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
  }, [setValue, triggerValidation]);

  const onRemovePhoto = React.useCallback(() => {
    setPhoto(null);
    setValue('photo', null);
    triggerValidation('photo');
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
