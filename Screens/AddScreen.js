import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { Component, useEffect } from 'react';
import { openDatabase } from 'react-native-sqlite-storage';
let SQLite = require('react-native-sqlite-storage');

const db = openDatabase('test1.db');
export default function AddScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [list, setList] = React.useState([]);
  const image = {
    uri: 'https://i.pinimg.com/564x/9f/34/be/9f34be92efeafbd260d2beed21a8acb1.jpg',
  };

  useEffect(() => {
    findName();
  }, []);

  const HandleSave = async () => {
    if (!name) {
      ToastAndroid.show('Please enter name', ToastAndroid.SHORT);
      return;
    }
    await findName();
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (name === list[i].name) {
          ToastAndroid.show('Name is vaild', ToastAndroid.SHORT);
          return;
        }
      }
    }
    if (!age) {
      ToastAndroid.show('Please enter age', ToastAndroid.SHORT);
      return;
    }
    if (isNaN(age)) {
      ToastAndroid.show('Age must be a numer', ToastAndroid.SHORT);
      return;
    }
    ToastAndroid.show('Save', ToastAndroid.SHORT);
    insert(name, age);
    await findName();
    navigation.navigate('Home');
  };
  const delDB = () => {
    var query = 'delete from Users';
    var params = [];
    db.transaction(txn => {
      txn.executeSql(
        query,
        params,
        (txn, results) => { },
        function (txn, err) {
          ToastAndroid.show('Warning', ToastAndroid.SHORT);
          return;
        },
      );
    });
  };
  const insert = (_name, _age) => {
    var query = 'INSERT INTO Users (id,name,age) VALUES (null,?,?)';
    var params = [_name, _age];
    db.transaction(txn => {
      txn.executeSql(
        query,
        params,
        (txn, results) => {
        },
        function (txn, err) {
          ToastAndroid.show('Warning', ToastAndroid.SHORT);
          return;
        },
      );
    });
  };
  const findName = async () => {
    var query = 'SELECT name from Users';
    var params = [];
    db.transaction(txn => {
      txn.executeSql(
        query,
        params,
        (txn, results) => {
          if (results.rows.length > 0) {
            let array = [];
            for (let i = 0; i < results.rows.length; i++) {
              let item = results.rows.item(i);
              array.push({ name: item.name });
            }
            setList(array);
          }
        },
        function (txn, err) {
          ToastAndroid.show('Warning', ToastAndroid.SHORT);
          return;
        },
      );
    });
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>ADD INFORMATION</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Your Name"
          onChangeText={text => setName(text)}
          defaultValue={name}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Your Age"
          onChangeText={text => setAge(text)}
          defaultValue={age}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity onPress={HandleSave} style={styles.button}>
            <Text style={styles.buttontext}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
            style={styles.button}>
            <Text style={styles.buttontext}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    margin: 20,
    height: 40,
    borderRadius: 150,
    backgroundColor: 'white',
  },
  button: {
    height: 40,
    width: 100,
    backgroundColor: '#C6E2FF',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttontext: {
    color: '#000000',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: '700',
  },
});
