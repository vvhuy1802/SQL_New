import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Home from './Screens/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddScreen from './Screens/AddScreen';
const AppStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={({route}) => ({
          headerTitle: () => (
            <View style={styles.header}>
              <Image
                style={styles.image}
                source={{uri: 'https://img.icons8.com/ios-filled/344/home.png'}}
              />
              <Text style={styles.text}>HOME</Text>
            </View>
          ),
        })}>
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen
          name="AddScreen"
          component={AddScreen}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  image: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
});
