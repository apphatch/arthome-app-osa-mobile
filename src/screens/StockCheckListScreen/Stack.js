import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StockCheckListScreen from './StockCheckListScreen';
import CheckListItemsScreen from './CheckListItemsScreen';
import FormScreen from './Form';
import ReportScreen from './ReportScreen';

const Stack = createStackNavigator();

export const StockStack = (props) => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="StockCheckListScreen"
        component={StockCheckListScreen}
        options={{ gestureEnabled: false, animationEnabled: false }}
      />
      <Stack.Screen
        name="CheckListItemsScreen"
        component={CheckListItemsScreen}
        options={{ gestureEnabled: false, animationEnabled: false }}
      />
      <Stack.Screen
        name="FormScreen"
        component={FormScreen}
        options={{ gestureEnabled: false, animationEnabled: false }}
      />
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ gestureEnabled: false, animationEnabled: false }}
      />
    </Stack.Navigator>
  );
};
