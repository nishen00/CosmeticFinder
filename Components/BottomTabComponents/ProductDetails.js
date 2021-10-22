import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, Image, Button, View, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
const Productscan = ({ props, route, navigation }) => {
    const { code,exp1,mfd2 } = route.params;
    const [safe, getsafe] = useState('');
    const [productid, getproductid] = useState('');
    const [company, getcompany] = useState('');
    const [aboutproduct, getaboutprodut] = useState('');
    const [category, getcategory] = useState('');
    const [direction, getdirection] = useState('');
    const [caution, getcaution] = useState('');
    const [ingredient, getingredient] = useState('');
    const [productname, getproductname] = useState('');
    const [price, getprice] = useState('');
    const [url, geturl] = useState('image/');
    const [loading, setloading] = useState(false);
    const [exp, setexp] = useState("");
    const [mfd, sedmfd] = useState("");
    const [statuscolor, setsatuscolor] = useState("#5D6D7E");

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            const proid = JSON.stringify(code.docid);
            let idpresate = proid.slice(1,-1);

            const exp = JSON.stringify(exp1.exp);
            const expre = exp.slice(1, -1);
            setexp(expre);

            const mfd = JSON.stringify(mfd2.mfd);
            const mfdpre = mfd.slice(1, -1);
            sedmfd(mfdpre);

            getproductid(idpresate);
            prodetails(proid);

        });

        return unsubscribe;

    }, [navigation]);

    const prodetails = async (id) => {
        setloading(true);
        const dbh = firebase.firestore();
        let idpre = id.slice(1,-1);
        dbh.collection("Products").doc(idpre)
        .get().then((doc) => {
          if (doc.exists){
            // Convert to City object
            var pro = doc.data();
            if (pro.safe == 1)
            {
                getsafe("Safe for use");
                setsatuscolor("#5D6D7E");
            }
            else
            {
                getsafe("Unsafe Product");
                setsatuscolor("red");
            }
            getcompany(pro.Company);
            getaboutprodut(pro.ProductAbout);
            getcategory(pro.categoryName);
            getdirection(pro.Direction);
            getcaution(pro.Coution);
            getingredient(pro.Ingredients);
            getproductname(pro.Name);
            getprice(pro.Price);
            geturl(pro.Url);

            setloading(false);
          } else {
            console.log("No such document!");
          }}).catch((error) => {
            console.log("Error getting document:", error);
          });

          
    }



    const proviewmore = () => {
        navigation.navigate('productlocation',{
          code: {productid},
          
        });
      }

    return (
        <View style={styles.container}>
            <View style={{ height: 200, paddingTop: 20, backgroundColor: 'white', paddingBottom: 5, borderColor: "#AEB6BF", borderBottomWidth: 2 }}>
                <Image source={{ uri: url }} style={{ flex: 1, borderBottomWidth: 1, borderColor: "#AEB6BF", height: 100 }} resizeMode='stretch' />

                <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 18, color: '#5D6D7E', fontWeight: "bold", flex: 1 }} ellipsizeMode='tail' numberOfLines={5}>{productname}</Text>
                    <Text style={{ fontSize: 15, color: '#2980B9', fontWeight: "bold" }}>Rs {price}</Text>
                </View>
            </View>

            

            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{
                        flex: 1, margin: 10, shadowColor: 'black',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.67,
                        shadowRadius: 6,
                        elevation: 15,
                        backgroundColor: "white"
                    }}>
                        
                        <View style={{ height: 35, backgroundColor: "#2980B9", padding: 5,flexDirection:"row", justifyContent: "center" }}>
                            <Text style={{ fontSize: 15, color: 'white', flex: 1, justifyContent: "center", fontWeight: "bold" }}>Information</Text>
                            <TouchableOpacity  onPress={proviewmore}><Ionicons name="location" size={24} color="white" /></TouchableOpacity>
                        </View>
                        <View style={{ height: 15, backgroundColor: "white", padding: 5,flexDirection:"row", justifyContent: "center" }}>
                        <ActivityIndicator animating={loading} size="small" style={{ opacity: 1 }} color="#2980B9" />
                        </View>
                        <View style={{ padding: 5 }}>

                            <Ionicons name="checkmark-done-circle-outline" size={24} color="black" /><Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>MFD date</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center", }}>{mfd}</Text>
                        </View>
                        <View style={{ padding: 5 }}>

                            <Ionicons name="checkmark-done-circle-outline" size={24} color="black" /><Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>EXP date</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center", }}>{exp}</Text>
                        </View>
                        <View style={{ padding: 5 }}>

                            <Ionicons name="checkmark-done-circle-outline" size={24} color={statuscolor} /><Text style={{ fontSize: 14, color: statuscolor, justifyContent: "center", fontWeight: "bold" }}>Safe Status</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: statuscolor, justifyContent: "center", }}>{safe}</Text>
                        </View>
                        <View style={{ padding: 5 }}>

                            <Ionicons name="settings-outline" size={24} color="black" /><Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>Company</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center",  }}>{company}</Text>
                        </View>

                        <View style={{ padding: 5 }}>
                            <Ionicons name="browsers-outline" size={24} color="black" />
                            <Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>About Product</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center", }}>{aboutproduct}</Text>
                        </View>

                        <View style={{ padding: 5 }}>

                            <Ionicons name="copy-outline" size={24} color="black" /><Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>Category</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center" }}>{category}</Text>
                        </View>

                        <View style={{ padding: 5 }}>
                            <Ionicons name="compass-outline" size={24} color="black" />
                            <Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>Direction</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center", }}>{direction}</Text>
                        </View>

                        <View style={{ padding: 5 }}>
                            <Ionicons name="warning-outline" size={24} color="black" />
                            <Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>Caution</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center" }}>{caution}</Text>
                        </View>

                        <View style={{ padding: 5 }}>
                            <Ionicons name="glasses-outline" size={24} color="black" />
                            <Text style={{ fontSize: 14, color: '#5D6D7E', justifyContent: "center", fontWeight: "bold" }}>Ingredients</Text>
                            <View style={{ height: 1, backgroundColor: "black" }}></View>
                            <Text style={{ fontSize: 12, color: '#5D6D7E', justifyContent: "center" }}>{ingredient}</Text>
                        </View>
                    </View>

                </ScrollView>
            </View>


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

export default Productscan