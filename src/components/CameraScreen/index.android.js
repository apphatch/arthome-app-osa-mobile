import React from 'react';
import { View } from 'react-native';
import CameraScreenBase from './CameraBase';

export default class CameraScreen extends CameraScreenBase {
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
