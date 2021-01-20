import React from 'react';
import { View, PermissionsAndroid } from 'react-native';
import CameraScreenBase from './CameraBase';

export default class CameraScreen extends CameraScreenBase {
  componentDidMount() {
    this.hasAndroidPermission();
  }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  renderGap() {
    return <View style={{ flex: 10, flexDirection: 'column' }} />;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }} {...this.props}>
        {this.renderCamera()}
        {this.renderTopButtons()}
        {this.renderGap()}
        {this.renderBottomButtons()}
      </View>
    );
  }
}
