import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Modal,
  Dimensions,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, { useEffect } from 'react';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase('test1.db');
const devieceHeight = Dimensions.get('window').height;
export default function PopUp({ visible, item, setVisible, SearchData, text }) {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  useEffect(() => {
    setName('');
    setAge('');
  }, []);
  const handleBack = () => {
    setName('');
    setAge('');
    setVisible(false);
    SearchData();
  };
  const handleSave = () => {
    if (!name) {
      ToastAndroid.show('Please enter new name', ToastAndroid.SHORT);
    }
    else if (!age) {
      ToastAndroid.show('Please enter new age', ToastAndroid.SHORT);
    }
    else if (isNaN(age)) {
      ToastAndroid.show('Age must be a numer', ToastAndroid.SHORT);
    }
    else {
      update();
      ToastAndroid.show('Update successfully', ToastAndroid.SHORT);
      handleBack();
    }
  };
  const update = () => {
    var query = 'UPDATE Users SET name = ?, age = ? WHERE id = ?';
    var params = [name, age, item.id];
    db.transaction(txn => {
      txn.executeSql(query, params, (txn, results) => {
        if (results.rows.length > 0) {
          ToastAndroid.show('Update successfully', ToastAndroid.SHORT);
        }
      }, function (txn, err) {
        ToastAndroid.show('Update failed', ToastAndroid.SHORT);
        return;
      });
    });
  };
  return <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={setVisible}>
    <View style={styles.centeredView}>
      <View style={styles.viewModal}>
        <Text style={styles.textModal}>EDIT</Text>
        <Text style={[styles.textModal, { fontWeight: '400' }]}>
          ABOUT: {item.name}
        </Text>
        <TextInput value={name} style={styles.textInput} placeholder="New Name!" onChangeText={newText => setName(newText)} defaultValue={name} />
        <TextInput value={age} style={styles.textInput} placeholder="New Age!" onChangeText={newText => setAge(newText)} defaultValue={age} />
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <TouchableOpacity onPress={() => {
            handleSave();
          }} style={styles.button}>
            <Text style={{ fontWeight: 'bold' }}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            handleBack();
          }} style={styles.button}>
            <Text style={{ fontWeight: 'bold' }}>BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000AA',
  },
  viewModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: devieceHeight * 0.6,
  },
  textModal: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
  },
  button: {
    height: 50,
    width: 100,
    backgroundColor: 'violet',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

