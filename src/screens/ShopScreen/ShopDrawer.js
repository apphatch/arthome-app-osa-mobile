import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar, Caption, Drawer, Title, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import { AppInfoService } from '../../services/app-info';
import { actions as loginActions } from '../LoginScreen';

export default function DrawerContent(props) {
  const paperTheme = useTheme();
  const dispatch = useDispatch();

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}>
            <Avatar.Image source={require('../../assets/logo.png')} size={70} />
          </TouchableOpacity>
          <Title style={styles.title}>An Hoà OSA</Title>
        </View>

        <Drawer.Section style={styles.drawerSection}>
          {/* <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-check-outline"
                color={color}
                size={size}
              />
            )}
            label="Check in"
            // onPress={() => dispatch(loginActions.logout(props.navigation))}
          /> */}
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="lock-open-outline"
                color={color}
                size={size}
              />
            )}
            label="Đăng xuất"
            onPress={() => dispatch(loginActions.logout(props.navigation))}
          />
        </Drawer.Section>

        <Drawer.Section>
          <View style={styles.preference}>
            <Caption style={styles.caption}>
              Phiên bản: {AppInfoService.getVersion()}
            </Caption>
          </View>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
