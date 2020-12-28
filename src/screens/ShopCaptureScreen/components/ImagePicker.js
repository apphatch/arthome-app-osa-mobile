import React from 'react';
import ImageResizer from 'react-native-image-resizer';
import {
  View,
  StyleSheet,
  NativeModules,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {
  IconButton,
  Button,
  Paragraph,
  Dialog,
  Portal,
} from 'react-native-paper';

import { savePicture } from '../../../utils';
import { objectId } from '../../../utils/uniqId';

const ImagePicker = NativeModules.ImageCropPicker;

const CustomImagePicker = ({
  setValue,
  isSubmitting,
  register,
  triggerValidation,
}) => {
  let [photos, setPhotos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    register({ name: 'photos' }, { required: true });
    setValue('photos', photos);
  }, [register, setValue, photos]);

  const onTakePhoto = () => {
    setIsLoading(true);
    ImagePicker.openCamera({
      cropping: false,
      includeExif: true,
      mediaType: 'photo',
    })
      .then((image) => {
        if (image) {
          const { path, size, width, height } = image;
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
              savePicture(res.uri);
              photos = [...photos, { ...res, localIdentifier: objectId() }];
              setPhotos(photos);
              if (photos.length < 10) {
                onTakePhoto();
                setIsLoading(false);
                setValue('photos', photos);
                triggerValidation('photos');
              } else {
                setVisible(true);
                setIsLoading(false);
              }
            })
            .catch(() => {
              setIsLoading(false);
            });
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onRemovePhoto = React.useCallback(
    (photo) => {
      setIsDeleting(true);
      ImagePicker.cleanSingle(photo.uri)
        .then(() => {
          setIsDeleting(false);
          const newPhotos = photos.filter(
            (item) => item.localIdentifier !== photo.localIdentifier,
          );
          setPhotos(newPhotos);
          setValue('photos', newPhotos);
          triggerValidation('photos');
        })
        .catch((e) => {
          setIsDeleting(false);
        });
    },
    [photos, setPhotos, setValue, triggerValidation],
  );

  const hideDialog = () => {
    setVisible(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.itemBox}>
        <IconButton
          icon="camera"
          size={30}
          onPress={onTakePhoto}
          disabled={isLoading || isDeleting}
        />
        {photos.length <= 0 ? (
          <Paragraph style={{ color: 'red', textAlign: 'center' }}>
            Cần chọn hình ảnh
          </Paragraph>
        ) : null}
      </View>
      <ScrollView containerStyle={styles.content} horizontal>
        {photos.map((photo) => {
          return (
            <View style={styles.itemBox} key={photo.localIdentifier}>
              <View style={[styles.item]}>
                <Image source={{ uri: photo.uri }} style={[styles.img]} />
              </View>
              <TouchableOpacity
                style={[styles.btnDelete]}
                onPress={() => onRemovePhoto(photo)}
                disabled={isSubmitting}>
                <Text>Xoá</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>
              {'If you want to choose more images, please do it once more time'}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  itemBox: {
    alignItems: 'center',
  },
  btnDelete: {
    height: 40,
    paddingTop: 20,
    marginBottom: 20,
    width: 150,
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

  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#38f',
  },
});

export default React.memo(CustomImagePicker);
