import React, { useState, useEffect } from 'react';
import MapView, { Polyline, Marker, ProviderPropType } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button,TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as getDistance from 'geolib';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/storage";


const productNearlocation = ({ props, route, navigation }) => {
    const { code } = route.params;
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [longitude, setlongitude] = useState(2552771);
    const [latitude, setlatitude] = useState(2121212);
    const [shops, setshops] = useState([]);
    const [shopsmarkers, setshopsmarkers] = useState([]);



    useEffect(() => {

        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            const location = await Location.getLastKnownPositionAsync({
                accuracy: 6,
              });
            setLocation(location);
            setlongitude(location.coords.longitude);
            setlatitude(location.coords.latitude);

            const proid = JSON.stringify(code.productid);
            let idpresate = proid.slice(1, -1);

            const dbh = firebase.firestore();
            const prosetall = [];

            await this.map.fitToSuppliedMarkers(['current'], true);

        
            await dbh.collection('BatchPut')
                .where('productid', '==', idpresate)
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


                    });

            setshops(prosetall);
            //   var dis = await getDistance.getPreciseDistance(
            //     {latitude: location.coords.latitude, longitude: location.coords.longitude},
            //     {latitude: location.coords.latitude, longitude: location.coords.longitude},  
            //   );

        })();

    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {

    }

    const getlocation = async () => {
        
        shoploc = [];
        for (let userObject of shops) {
            var dis = await getDistance.getPreciseDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: userObject.latitude, longitude: userObject.longitude },
            );

            if (dis <= 5000) {
                var sh = {
                    "Name": userObject.Name,
                    "latitude": userObject.latitude,
                    "longitude": userObject.longitude,
                }

                shoploc.push(sh);
            }

            else {
                console.log("far");
            }
        }

        setshopsmarkers(shoploc);

        


    }

    return (

        <View style={styles.container}>

            <MapView style={styles.map} provider='google'
                ref={ref => {
                    this.map = ref;
                }}
            >


                <Marker
                    identifier="current"
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude
                    }}
                    title="You"
                    description="Your current location"
                >
                    <Ionicons name="man" size={30} color="black" />
                </Marker>

                {shopsmarkers.map(shop => (
                    <Marker
                        identifier="shopmar"
                        coordinate={{
                            latitude: shop.latitude,
                            longitude: shop.longitude
                        }}
                        title={shop.Name}
                        description="Your can buy this product from here"
                        key = {shop.Name}
                    >
                        <Ionicons name="beer" size={30} color="red" />
                    </Marker>
                ))}

            </MapView>

            <TouchableOpacity
                style={{
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '90%', //for center align
                    alignSelf: 'flex-end',
                    paddingRight:5 //for align to right
                }}

                onPress={getlocation}
            >
            <Ionicons name="navigate" size={40} color="black"/>
            </TouchableOpacity>
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});



export default productNearlocation