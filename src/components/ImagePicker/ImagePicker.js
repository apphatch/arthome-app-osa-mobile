import React from 'react';

import {
  View,
  StyleSheet,
  NativeModules,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  IconButton,
  Button,
  Paragraph,
  Dialog,
  Portal,
} from 'react-native-paper';

import { objectId } from '../../utils/uniqId';

const ImagePicker = NativeModules.ImageCropPicker;

const CustomImagePicker = ({ photos, setPhotos, isLoading }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const onTakePhoto = () => {
    ImagePicker.openCamera({
      cropping: false,
      includeExif: true,
      mediaType: 'photo',
    }).then((image) => {
      if (image) {
        photos = [...photos, { ...image, localIdentifier: objectId() }];
        if (photos.length <= 10) {
          onTakePhoto();
          setPhotos(photos);
        } else {
          setVisible(true);
        }
      }
    });
  };

  const onRemovePhoto = React.useCallback(
    (photo) => {
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
          alert(e);
        });
    },
    [photos, setPhotos],
  );

  const hideDialog = () => {
    setVisible(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <IconButton
          icon="camera"
          size={30}
          onPress={() => onTakePhoto()}
          disabled={isLoading || isDeleting}
        />
      </View>
      <ScrollView containerStyle={styles.content} horizontal>
        {photos.map((photo) => {
          return (
            <View style={styles.itemBox} key={photo.localIdentifier}>
              <View style={[styles.item]}>
                <Image source={{ uri: photo.path }} style={[styles.img]} />
              </View>
              <TouchableOpacity
                style={[styles.btnDelete]}
                onPress={() => onRemovePhoto(photo)}
                disabled={isLoading || isDeleting}>
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
  content: {
    // flexDirection: 'row',
    // flexGrow: 1,
    // flexWrap: 'wrap',
    // padding: 4,
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
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'transparent',
    marginRight: 12,

    // height: Dimensions.get('window').width / 2,
    height: 150,
    width: 150,
  },
  img: {
    // width: 88,
    // height: 88,
    borderRadius: 5,
    resizeMode: 'cover',
    flex: 1,
  },
});

export default React.memo(CustomImagePicker);
