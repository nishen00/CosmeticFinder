import React,{useState,useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text,View,TouchableOpacity,Image,ScrollView} from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';


const suggetionProduct = ({ props, route, navigation }) => {
    const {code} = route.params;
    const [Products, setProducts] = useState([]);
    const [exp, setexp] = useState("");
    const [mfd, sedmfd] = useState("");

    useEffect(() => {
        (async () => {
          
    

    
            const exp = JSON.stringify(code.predictions);
            const expre = exp.slice(1, -1);

            
           
           await getproducts(expre);
        
            
    
    
        })();
      }, []);

    const getproducts = async(type) => {
       
        const dbh = firebase.firestore();
        const prosetall = []
        await dbh.collection('Products')
          .where('suggestion', '==', type)
          .where('safe', '==', 1)
          .get()
          .then(
            (v) => {
  
  
  
              v.forEach(doc => {
  
                var profind = {
                  "Name": doc.data().Name,
                  "id": doc.id,
                  "URL": doc.data().Url,
                  "Price": doc.data().Price,
                  "About": doc.data().ProductAbout,
  
  
                }
  
                prosetall.push(profind);
  
              })
  
  
            });
  
        setProducts(prosetall);

    }

    const proviewmore = (docid) => {
        navigation.navigate('ProductDetails', {
          code: { docid },
          exp1: { exp },
          mfd2: { mfd }
    
        });
      }


    return(
       <ScrollView showsHorizontalScrollIndicator={false} style={{flex:1}}>
        {Products.map(Products => (
          <TouchableOpacity style={styles.productsection} key={Products.id} onPress={() => proviewmore(Products.id)}>
            <Image source={{
              uri: Products.URL,
            }} style={{ width: "100%", height: 150 }} resizeMode='stretch' />
            <View style={{ padding: 10, }}>
              <Text style={{ fontSize: 18, color: '#5D6D7E', fontWeight: "bold"}} ellipsizeMode='tail' numberOfLines={5}>{Products.Name}</Text>
              
              <Text style={{ fontSize: 15, color: '#2980B9', fontWeight: "bold" }}>Rs {Products.Price}</Text>
            </View>
            <View style={{ padding: 10, }}>
              <Text style={{ fontSize: 11, color: '#5D6D7E', justifyContent: "center" }} ellipsizeMode='tail' numberOfLines={3}>{Products.About}</Text>
            </View>

          </TouchableOpacity>
        ))}
       </ScrollView>
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

export default suggetionProduct