import React, { memo } from 'react';

import ImageResizer from 'react-native-image-resizer';
import Marker, { Position } from 'react-native-image-marker';
import moment from 'moment-timezone';

import {
  StyleSheet,
  View,
  NativeModules,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { Button, Appbar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { defaultTheme } from '../../theme';

import { savePicture } from '../../utils';
import { objectId } from '../../utils/uniqId';

// ###
import { selectors as appSelectors, actions as appActions } from '../App';

const ImagePicker = NativeModules.ImageCropPicker;

const ShopCaptureScreen = ({ navigation, route }) => {
  const {
    params: { shopName },
  } = route;

  const dispatch = useDispatch();
  const serverTime = useSelector(appSelectors.makeSelectServerTime());

  let [photos, setPhotos] = React.useState([]);
  const [cachePhotos, setCachePhotos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    dispatch(appActions.getServerTime());

    return () => {
      ImagePicker.clean().then(() => {
        setCachePhotos([]);
      });
    };
  }, [dispatch]);

  const onTakePhoto = () => {
    setIsLoading(true);
    ImagePicker.openCamera({
      cropping: false,
      includeExif: true,
      mediaType: 'photo',
    })
      .then((image) => {
        if (image) {
          photos = [...photos, { ...image, localIdentifier: objectId() }];

          setPhotos(photos);
          setCachePhotos(photos);
          setIsLoading(false);
          onTakePhoto();
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onRemovePhoto = (photo) => {
    setIsDeleting(true);
    ImagePicker.cleanSingle(photo.path)
      .then(() => {
        setIsDeleting(false);
        const newPhotos = photos.filter(
          (item) => item.localIdentifier !== photo.localIdentifier,
        );
        setPhotos(newPhotos);
      })
      .catch((e) => {
        setIsDeleting(false);
      });
  };

  const saveImage = () => {
    setIsLoading(true);
    const now = moment
      .tz(serverTime, 'Asia/Ho_Chi_Minh')
      .format('DD/MM/YYYY HH:mm:ss');

    if (cachePhotos.length > 0) {
      cachePhotos.forEach((photo) => {
        const { width, height, size, path } = photo;
        let reWidth = width;
        let reHeight = height;
        let quality = 100;

        if (size >= 200000) {
          reWidth = (width * 2) / 3;
          reHeight = (height * 2) / 3;
          quality = Platform.OS === 'ios' ? 15 : 60;
        }

        ImageResizer.createResizedImage(
          path,
          reWidth,
          reHeight,
          'JPEG',
          quality,
          0,
        )
          .then((res) => {
            Marker.markText({
              src: res.uri,
              color: '#FF0000',
              fontSize: Platform.OS === 'ios' ? 130 : 50,
              X: 30,
              Y: 30,
              scale: 1,
              quality: 100,
              text: `${shopName}\n${now}`,
              position: Position.topLeft,
              filename: now,
            })
              .then((_path) => {
                const uri =
                  Platform.OS === 'android'
                    ? 'file://' + _path
                    : 'file:///' + _path;
                savePicture(uri);
                setIsLoading(false);
              })
              .catch(() => {
                setIsLoading(false);
              });
          })
          .catch(() => {
            setIsLoading(false);
          });
      });
      setPhotos([]);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        />
        <Appbar.Content title={shopName} subtitle="" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.root}>
          <View style={styles.itemBox}>
            <IconButton
              icon="camera"
              size={30}
              onPress={onTakePhoto}
              disabled={isLoading || isDeleting}
            />
          </View>
          <ScrollView horizontal>
            {photos.map((photo) => {
              return (
                <View style={styles.itemBox} key={photo.localIdentifier}>
                  <View style={[styles.item]}>
                    <Image source={{ uri: photo.path }} style={[styles.img]} />
                  </View>
                  <TouchableOpacity
                    style={[styles.btnDelete]}
                    onPress={() => onRemovePhoto(photo)}
                    disabled={isLoading}>
                    <Text>Xoá</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Button mode="contained" onPress={saveImage} disabled={isLoading}>
          Save
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
    padding: 10,
    flexDirection: 'column',
  },
  root: {
    flexDirection: 'column',
  },
  itemBox: {
    alignItems: 'center',
  },
  item: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    marginRight: 12,
    height: 150,
    width: 150,
  },
  img: {
    borderRadius: 5,
    resizeMode: 'cover',
    flex: 1,
  },
  btnDelete: {
    height: 40,
    paddingTop: 20,
    marginBottom: 20,
    width: 150,
    alignItems: 'center',
  },
});

export default memo(ShopCaptureScreen);
