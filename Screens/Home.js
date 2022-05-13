import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Searchbar from '../components/SearchBar';
import { openDatabase } from 'react-native-sqlite-storage';
import PopUp from './PopUp';

const db = openDatabase('test1.db');

export default function Home({ navigation }) {
  const [list, setList] = React.useState([]);
  const [text, setText] = React.useState('');
  const [temp, setTemp] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [indexCurrent, setIndexCurrent] = React.useState(null);
  useEffect(() => {
    createTable();
    getData();
  }, []);

  const createTable = () => {
    db.transaction(
      txn => {
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS Users (id integer primary key not null, name text, age integer)',
        );
      },
    );
  };
  const searchData = val => {
    var query = "SELECT * FROM Users WHERE name LIKE '%" + val + "%'";
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
              array.push({ id: item.id, name: item.name, age: item.age });
            }
            setList(array);
          } else {
            setList([]);
          }
        },
        function (txn, err) {
          ToastAndroid.show('Warning', ToastAndroid.SHORT);
          return;
        },
      );
    });
  };

  const delDB = id => {
    var query = 'delete from Users where id = ?';
    var params = [id];
    db.transaction(txn => {
      txn.executeSql(
        query,
        params,
        (txn, results) => {
          ToastAndroid.show('Delete successfully', ToastAndroid.SHORT);
        },
        function (txn, err) {
          return;
        },
      );
    });
  };

  const getData = () => {
    var query = 'SELECT id, name, age from Users';
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
              array.push({ id: item.id, name: item.name, age: item.age });
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
  let updateSearch = async value => {
    setText(value);
    await searchData(value);
  };
  const Load = async () => {
    await searchData(text);
  };
  let deleteColumn = async value => {
    await delDB(value);
    searchData(text);
  };
  const handleAdd = () => {
    navigation.replace('AddScreen', { list });
  };
  const handleDelete = async value => {
    await deleteColumn(value);
  };
  return <View style={styles.container}>
    <Searchbar updateSearch={updateSearch} style={{ marginTop: 20, flex: 1 }} />
    <Text style={styles.Text}>List</Text>
    <View style={{ flex: 7 }}>
      <ScrollView>
        {list.map((item, index) =>
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              setIndexCurrent(index === indexCurrent ? null : index)}
            style={styles.cardContainer}
          >
            <View style={styles.card}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 3
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "bold",
                      color: "#000000",
                      padding: 10
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "center",
                    alignItems: "flex-end",
                    flexDirection: "row",
                    flex: 1
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(true);
                      setTemp(item);
                    }}
                  >
                    <Image
                      style={{ height: 25, width: 25, marginRight: 10 }}
                      source={{
                        uri:
                          "https://img.icons8.com/external-sbts2018-outline-color-sbts2018/344/external-modify-basic-ui-elements-2.5-sbts2018-outline-color-sbts2018.png"
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(item.id);
                    }}
                  >
                    <Image
                      style={{
                        height: 30,
                        width: 30
                      }}
                      source={{
                        uri:
                          "https://img.icons8.com/fluency/344/filled-trash.png"
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {index === indexCurrent &&
                <View style={styles.item}>
                  <Text style={{ fontSize: 18, alignSelf: "center" }}>
                    Name: {item.name}
                  </Text>
                  <Text style={{ fontSize: 18, alignSelf: "center" }}>
                    Age: {item.age}
                  </Text>
                </View>}
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
    <TouchableOpacity activeOpacity={0.5} onPress={handleAdd} style={styles.TouchableOpacityStyle}>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png" }} style={styles.FloatingButtonStyle} />
    </TouchableOpacity>
    <PopUp visible={visible} item={temp !== null ? temp : { name: "" }} setVisible={setVisible} text={text} SearchData={Load} />
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    flex: 1,
  },
  card: {
    flex: 7,
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    marginBottom:40,
    marginRight:10
  },
  cardContainer: {
    borderColor: 'blue',
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
    marginHorizontal: 30,
    flex: 1,
  },
  item: {
    flexDirection:'row',
    justifyContent: 'space-evenly',
  }
});
