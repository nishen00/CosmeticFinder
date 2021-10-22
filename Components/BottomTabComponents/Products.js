import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, Image, Button, View, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import logo from '../../assets/eye.jpg';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/storage";
import { LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['Setting a timer']);



const Products = ({ props, navigation }) => {

  const [category, setcategory] = useState([]);
  const [Products, setProducts] = useState([]);
  const [Productstem, setProductstem] = useState([]);
  const [loading, setloading] = useState(false);
  const [Searchtxt, getsearchtxt] = useState('');
  const [exp, setexp] = useState("");
  const [mfd, sedmfd] = useState("");
  const [statuscolor, setsatuscolor] = useState("#5D6D7E");

  React.useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      catefind();
      ProductAll();
    });



    return unsubscribe;

  }, []);


  const search = (text) => {
    getsearchtxt(text);

  }



  const catefind = () => {

    setloading(true);
    const proset = []
    const dbh = firebase.firestore();


    var collection = dbh.collection("productCategory")
    collection.get().then((querySnapshot) => {
      (async () => {
        querySnapshot.forEach((doc) => {

          var pro = {
            "Name": doc.data().Name,
            "id": doc.id,
            "URL": doc.data().url,

          }

          proset.push(pro);





        });

        setcategory(proset);
        setloading(false);


      })()


    });


  }


  const ProductAll = () => {

    setloading(true);
    const prosetall = []
    const dbh = firebase.firestore();


    var collection = dbh.collection("Products")
    collection.get().then((querySnapshot) => {
      (async () => {
        querySnapshot.forEach((doc) => {

          var pro = doc.data();
          var safe = "";
          var color = ""; 
            if (pro.safe == 1)
            {
              safe = "Safe for use";
              color = "#5D6D7E";
               
               
            }
            else
            {
              safe = "Unsafe Product";
              color = "red";
              
            }

          var profind = {
            "Name": doc.data().Name,
            "id": doc.id,
            "URL": doc.data().Url,
            "Price": doc.data().Price,
            "About": doc.data().ProductAbout,
            "safe": safe,
            "color":color,


          }

          prosetall.push(profind);


        });

        setProducts(prosetall);
        setloading(false);


      })()


    });


  }

  const categoryfilter = async (categoryfilter) => {
    if (categoryfilter != "allget") {
      setloading(true);
      const dbh = firebase.firestore();
      const prosetall = []
      await dbh.collection('Products')
        .where('categoryid', '==', categoryfilter)
        .get()
        .then(
          (v) => {



            v.forEach(doc => {

              var pro = doc.data();
          var safe = ""
          var color = ""; 
            if (pro.safe == 1)
            {
              safe = "Safe for use";
              color = "#5D6D7E";
               
            }
            else
            {
              safe = "Unsafe Product";
              color ="red";
              
            }

              var profind = {
                "Name": doc.data().Name,
                "id": doc.id,
                "URL": doc.data().Url,
                "Price": doc.data().Price,
                "About": doc.data().ProductAbout,
                "safe": safe,
                "color":color,


              }

              prosetall.push(profind);

            })


          });

      setProducts(prosetall);
      setloading(false);
    }

    else {
      ProductAll();
    }
  }

  const searchbtn = () => {

    setloading(true);
    if (Searchtxt != "") {

      const proset = [];
      let co = 0;

      for (const item of Products) {
        if (item.Name === Searchtxt) {
          
          var safe = "";
          var color = ""; 
            if (item.safe == 1)
            {
              safe = "Safe for use";
              color = "#5D6D7E";
               
            }
            else
            {
              safe = "Unsafe Product";
              color = "red";
              
            }
          var pro = {
            "Name": item.Name,
            "id": item.id,
            "URL": item.URL,
            "Price": item.Price,
            "About": item.About,
            "safe": safe,
            "color":color,

          }

          co = 1;
          proset.push(pro);
          setProducts(proset);
        }

      }
      if (co == 0) {
        alert("Product Not Found !!");
      }
    }
    else {
      ProductAll();
    }
    setloading(false);
  }

  const proviewmore = (docid) => {
    navigation.navigate('ProductDetails', {
      code: { docid },
      exp1: { exp },
      mfd2: { mfd }

    });
  }




  return (
    <View style={styles.container}>
      <View style={{ height: 90, paddingTop: 50, paddingHorizontal: 20, backgroundColor: 'white', paddingBottom: 5 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 5, padding: 5 }}>
          <TextInput placeholder="Add Product Name" style={{ width: '100%' }} onChangeText={search} value={Searchtxt} style={{ flex: 1 }} />
          <TouchableOpacity onPress={searchbtn}><Ionicons name="search" size={24} color="black" /></TouchableOpacity>
        </View>
      </View>
      <View style={styles.categorysec}>



        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

          <View onPress={() => categoryfilter("allget")} style={{
            backgroundColor: '#E5E7E9', marginRight: 5, marginLeft: 5, borderWidth: 1, borderColor: '#AEB6BF', shadowColor: 'black',

            elevation: 10, width: 80, borderRadius: 5
          }} >
            <View style={{ flex: 2 }}>
              <Image source={{ uri: "https://pbs.twimg.com/profile_images/950768161925816320/AO7Zwu-u_400x400.jpg" }} style={{ flex: 1, borderTopRightRadius: 5, borderTopLeftRadius: 5, height: 50 }} resizeMode='stretch' />
            </View>
            <View style={{ padding: 5 }}>
              <TouchableOpacity onPress={() => categoryfilter("allget")}><Text >All</Text></TouchableOpacity>
            </View>

          </View>

          {category.map(category => (
            <View key={category.id} style={{
              backgroundColor: '#E5E7E9', marginRight: 5, marginLeft: 5, borderWidth: 1, borderColor: '#AEB6BF', shadowColor: 'black',

              elevation: 10, width: 80, borderRadius: 5, justifyContent: "center"
            }} >
              <View style={{ flex: 2 }}>
                <Image source={{ uri: category.URL }} style={{ width: 78, height: 50, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='stretch' />
              </View>
              <View style={{ padding: 5, marginTop: 20, flex: 1, justifyContent: "center" }}>
                <TouchableOpacity onPress={() => categoryfilter(category.id)}><Text >{category.Name}</Text></TouchableOpacity>
              </View>

            </View>
          ))}
        </ScrollView>

      </View>


      <ScrollView showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>

        <ActivityIndicator animating={loading} size="small" style={{ opacity: 1 }} color="#2980B9" />
        {Products.map(Products => (
          <TouchableOpacity style={styles.productsection} key={Products.id} onPress={() => proviewmore(Products.id)}>
            <Image source={{
              uri: Products.URL,
            }} style={{ width: "100%", height: 150 }} resizeMode='stretch' />
            <View style={{ padding: 10, flexDirection: "column", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 18, color: '#5D6D7E', fontWeight: "bold", flex: 1 }} ellipsizeMode='tail' numberOfLines={5}>{Products.Name}</Text>
              <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              
              <Text style={{ fontSize: 15, color: '#2980B9', fontWeight: "bold" }}>Rs {Products.Price}</Text>
              <Text style={{ fontSize: 15, color: Products.color, fontWeight: "bold" }}>{Products.safe}</Text>
              </View>
              
            </View>
            <View style={{ padding: 10, }}>
              <Text style={{ fontSize: 11, color: '#5D6D7E', flex: 1, justifyContent: "center" }} ellipsizeMode='tail' numberOfLines={3}>{Products.About}</Text>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  categorysec: {
    width: '100%',
    height: 90,
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.67,
    shadowRadius: 6,
    elevation: 15,

  },

  productsection: {



    backgroundColor: 'white',
    margin: 10,
    padding: 0,
    borderRadius: 5,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.67,
    shadowRadius: 6,
    elevation: 15,

  },
})

export default Products