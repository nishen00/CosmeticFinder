import 'react-native-gesture-handler';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Product from './BottomTabComponents/Products';
import Scan from './BottomTabComponents/ProductScan';
import Account from './BottomTabComponents/Accounts';
import Questions from './BottomTabComponents/questions';
import ProductDetails from './BottomTabComponents/ProductDetails';
import productNearlocation from './BottomTabComponents/productNearlocation';
import suggetionProducts from './BottomTabComponents/suggetionProduct';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function productstack() {
  return (
    <Stack.Navigator
      initialRouteName="product"
      screenOptions={{
        headerStyle: { backgroundColor: '#F8F9F9' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', color: '#2980B9' },
        headerShown: false

      }}>
      <Stack.Screen
        name="product"
        component={Product}
        options={{ title: 'Products' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ title: "Product Finds", header: () => null }}
      />

      <Stack.Screen
        name="productlocation"
        component={productNearlocation}
        options={{ title: "Product location", header: () => null }}
      />

    </Stack.Navigator>
  );
}

function productscan() {
  return (
    <Stack.Navigator
      initialRouteName="productscan"
      screenOptions={{
        headerStyle: { backgroundColor: '#F8F9F9' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', color: '#2980B9' },

      }}>
      <Stack.Screen
        name="productscan"
        component={Scan}
        options={{ title: 'Products Scan' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ title: "Product Finds", header: () => null }}
      />

      <Stack.Screen
        name="productlocation"
        component={productNearlocation}
        options={{ title: "Product location", header: () => null }}
      />

    </Stack.Navigator>
  );
}

// function account() {
//   return (
//     <Stack.Navigator
//       initialRouteName="account"
//       screenOptions={{
//         headerStyle: { backgroundColor: '#F8F9F9' },
//         headerTintColor: '#fff',
//         headerTitleStyle: { fontWeight: 'bold', color: '#2980B9' },

//       }}>
//       <Stack.Screen
//         name="account"
//         component={Account}
//         options={{ title: 'Profile' }}
//       />


//     </Stack.Navigator>
//   );
// }

function questions() {
  return (
    <Stack.Navigator
      initialRouteName="map"
      screenOptions={{
        headerStyle: { backgroundColor: '#F8F9F9' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', color: '#2980B9' },

      }}>
      <Stack.Screen
        name="map"
        component={Questions}
        options={{ title: 'Skin Scan' }}
      />
      <Stack.Screen
        name="suggetionproduct"
        component={suggetionProducts}
        options={{ title: 'Products' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ title: "Product Finds", header: () => null }}
      />


    </Stack.Navigator>
  );
}



const Navigate = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Product"
        tabBarOptions={{
          activeTintColor: '#2980B9',
          style: {

            width: '100%',
            backgroundColor: '#F8F9F9',
          }
        }}>
        <Tab.Screen
          name="Pro"
          component={productstack}
          options={{
            tabBarLabel: 'Products',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={productscan}
          options={{
            tabBarLabel: 'Scan',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="questions"
          component={questions}
          options={{
            tabBarLabel: 'Skin Scan',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="face-profile" size={size} color={color} />
            ),
          }}
        />

        {/* <Tab.Screen
          name="account"
          component={account}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" size={size} color={color} />
            ),
          }}
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigate