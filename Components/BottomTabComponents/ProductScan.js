import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, SafeAreaView, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { LogBox } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import * as Location from 'expo-location';
import * as getDistance from 'geolib';
import MapView, { Polyline, Marker, ProviderPropType } from 'react-native-maps';
import { Svg } from 'react-native-svg';
import * as Progress from 'react-native-progress';


const scan = ({ props, route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisiblesafe, setmodalVisiblesafe] = useState(false);
    const [companyid, setcompanyid] = useState("");
    const [productid, setproductid] = useState("");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showlable, showlableset] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [longitude, setlongitude] = useState(2552771);
    const [latitude, setlatitude] = useState(2121212);
    const [loading, setloading] = useState(false);
    const [shops, setshops] = useState([]);
    const [shopsmarkers, setshopsmarkers] = useState([]);
    const [loading2, setloading2] = useState(false);
    const [docid, setdocid] = useState("");
    const [mfd, setmfd] = useState("");
    const [exp, setexp] = useState("");
    LogBox.ignoreLogs(['Setting a timer']);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            batch();
        })();
    }, []);


    useEffect(() => {

        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            setLocation(location);
            setlongitude(location.coords.longitude);
            setlatitude(location.coords.latitude);





        })();

        return () => {

        }
    }, []);

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            // batch();
            setScanned(false);
        });

        return unsubscribe;

    }, [navigation]);

    const handleBarCodeScanned = async ({ type, data }) => {

        const dbh = firebase.firestore();
        const prosetall = [];
        const proid = await dbh.collection('ProductsBatch')
            .where('barcode', '==', data)
            .where('safe', '==', 1)
            .where('Status', '==', 2)
            .get()
            .then(
                (v) => {

                    if (v.docs.length > 0) {

                        setModalVisible(false);
                        setmodalVisiblesafe(true);
                        
                        v.forEach(doc => {
                            setdocid(doc.data().productdocid);
                            setmfd(doc.data().mfddate);
                            setexp(doc.data().expdate);
                            dbh.collection('BatchPut')
                                .where('productid', '==', doc.data().productdocid)
                                .get()
                                .then(
                                    (v) => {
                                        v.forEach(doc => {

                                            var profind = {
                                                "Name": doc.data().shopname,
                                                "latitude": doc.data().latitude,
                                                "longitude": doc.data().longitude,
                                            }

                                            prosetall.push(profind);

                                        })
                                        setshops(prosetall);


                                    });





                        })

                    }
                    else {

                        setModalVisible(true);

                    }


                });

        setScanned(true);

        // navigation.navigate('Details' ,{
        //     code: {data},

        //   });
    };

    const batch = async () => {
        //     let result = await SecureStore.getItemAsync("hdsggshhwiiwyehdbnndjjdjjd");
        //     setcompanyid(result);
        //     const proid = JSON.stringify(code.docid);
        //    const correct = proid.slice(1, -1);
        //     setproductid(correct);
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const addevedance = async () => {
        setloading(true);
        const dbh = firebase.firestore();

        await dbh.collection("NotificationGovenment").doc().set({
            Date: Date().toLocaleString(),
            latitude: latitude,
            longitude: longitude,
        });
        setloading(false);
        setModalVisible(false);
        setScanned(false);

    }

    const showloca = async () => {
        setloading2(true);
        shoploc = [];
        let con = 0;
        for (let userObject of shops) {
            var dis = await getDistance.getPreciseDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: userObject.latitude, longitude: userObject.longitude },
            );

            if (dis <= 100) {
                var sh = {
                    "Name": userObject.Name,
                    "latitude": userObject.latitude,
                    "longitude": userObject.longitude,
                }

                shoploc.push(sh);
                await showlableset(true);
                con = 1;
                break;
            }

            else {
                await showlableset(true);
            }
        }

        if(con == 0)
        {
            setModalVisible(true);
            setmodalVisiblesafe(false);
            showlableset(false);

        }
        else
        {
            await setshopsmarkers(shoploc);

            await this.map.fitToSuppliedMarkers(['current'], true);
        }
        
        setloading2(false);

        
    }

    const goview = () => {
        setScanned(false);
        setmodalVisiblesafe(false);
        navigation.navigate('ProductDetails',{
            code: {docid},
            exp1: {exp},
            mfd2: {mfd}
          });
    }

    return (
        <View style={{ flex: 1 }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, }}
            >
                <Text style={{
                    fontSize: 20,
                    flex: 1,
                    justifyContent: "center",
                    marginTop: '10%',
                    textAlign: 'center',
                    width: '100%',
                    color: 'white',
                }}>Scan Product QR code or Barcode</Text>
                <Image
                    style={{
                        width: "100%",
                        height: 300,
                        marginBottom: 200,
                        marginLeft: 10,
                        marginRight: 10,
                        justifyContent: "center",

                    }}
                    source={require('../../assets/qr.png')}
                />

                <Modal
                    animationType="slide"
                    coverScreen={true}
                    backdropColor="black"
                    deviceHeight={50}
                    visible={modalVisiblesafe}
                    onRequestClose={() => {
                        setmodalVisiblesafe(false);
                        setScanned(false);
                        showlableset(false);
                    }}
                >
                    <View style={{ width: "100%", borderRadius: 5, backgroundColor: "white" }}>
                        <View style={{ width: "100%", backgroundColor: "#1ABC9C", padding: 5, height: 32, flexDirection: "row", justifyContent: "flex-start", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <Ionicons name="checkmark-circle" size={24} color="white" /><Text style={{ fontSize: 18, color: 'white', fontWeight: "bold", flex: 1 }}>Safe product barcode found</Text>
                        </View>



                        <View style={{
                            margin: 5, shadowColor: 'black'
                        }}>
                            
                            <Text style={{ fontSize: 10, color: 'black', fontWeight: "bold" }}>System has found a Safe Product Barcode. Please click bellow button to 2nd step verification</Text>
                        </View>


                        <View>

                        <MapView style={styles.map} provider='google'
                                ref={ref => {
                                    this.map = ref;
                                }}
                            >
                                {shopsmarkers.map(shop => (
                                    <Marker
                                        identifier="current"
                                        coordinate={{
                                            latitude: shop.latitude,
                                            longitude: shop.longitude
                                        }}
                                        title={shop.Name}
                                        description="Your can buy this product from here"
                                        key={shop.Name}
                                    >
                                        <Ionicons name="home" size={30} color="green" />
                                    </Marker>
                                ))}

                            </MapView> 
                        </View>

                        <View style={{width:"100%" , padding : 5}}>
                        <ActivityIndicator animating={loading2} size="small" style={{ opacity: 1 }} color="#2980B9" />
                        </View>


                        { showlable &&  <View style={{
                            margin: 5, shadowColor: 'black',
                            shadowOffset: { width: 0, height: 6 },
                            borderRadius: 5,
                            shadowOpacity: 0.67,
                            shadowRadius: 6,
                            elevation: 5,
                            padding: 10,
                            backgroundColor: "white",
                            flexDirection:"row",
                        }}>
                            <Ionicons name="checkmark-circle" size={24} color="green" style={{flex:1}} /><Text style={{ fontSize: 10, color: 'black', fontWeight: "bold",flex:7}}>System identified that product is a safe product, Click view more to get all information about the product</Text>
                            </View> }

                        <View style={{ width: "100%", padding: 20 }}>
                            
                           {!showlable &&  <Button title={'Region Check'} onPress={showloca} /> }
                           {showlable &&  <Button title={'View More'} onPress={goview} /> }
                        </View>
                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    coverScreen={true}
                    backdropColor="black"
                    deviceHeight={50}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                        setScanned(false);
                    }}
                >
                    <View style={{ width: "100%", borderRadius: 5, backgroundColor: "white" }}>
                        <View style={{ width: "100%", backgroundColor: "#E74C3C", padding: 5, height: 30, flexDirection: "row", justifyContent: "flex-start", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <Ionicons name="warning" size={24} color="white" /><Text style={{ fontSize: 18, color: 'white', fontWeight: "bold", flex: 1 }}>Unsafe Product Found</Text>
                        </View>
                        <View>
                            <Image
                                style={{
                                    width: "100%",
                                    height: 300,

                                }}
                                source={require('../../assets/warningcosmo.jpg')}
                            />
                        </View>

                        <View style={{
                            margin: 5, shadowColor: 'black',
                            shadowOffset: { width: 0, height: 6 },
                            borderRadius: 5,
                            shadowOpacity: 0.67,
                            shadowRadius: 6,
                            elevation: 5,
                            padding: 10,
                            backgroundColor: "#E74C3C"
                        }}>
                            <Text style={{ fontSize: 10, color: 'white', fontWeight: "bold" }}>System has found a Unsafe Product. Please don't buy this product, this product may affect you a health problem</Text>
                        </View>

                        <View style={{ width: "100%", padding: 20 }}>
                            <ActivityIndicator animating={loading} size="small" style={{ opacity: 1 }} color="#2980B9" />
                            <Button title={'OK'} onPress={addevedance} />
                        </View>
                    </View>
                </Modal>


            </BarCodeScanner>
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}


        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: "100%",
        height: 150,
    },
});

export default scan