import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// import ShopScreen from './ShopScreen';
import DrawerContent from './ShopDrawer';
import { ShopScreenStack } from './Stack';

const Drawer = createDrawerNavigator();

export default function ShopNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="ShopScreen" component={ShopScreenStack} />
    </Drawer.Navigator>
  );
}
