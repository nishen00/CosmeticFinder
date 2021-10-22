import React, { useState, useEffect } from 'react';
import MapView, { Polyline, Marker, ProviderPropType } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, Image, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as tf from "@tensorflow/tfjs";
import firebase from 'firebase/app';
import 'firebase/storage';
import { fetch, bundleResourceIO } from "@tensorflow/tfjs-react-native";
// import * as ImagePicker from "expo-image-picker";
import * as jpeg from "jpeg-js";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Modal from "react-native-modal";


const result_mapping = ['Black Brown', 'Brown', 'Fair', 'Light Brown', 'Olive', 'Pimple'];
const questions = ({ navigation }) => {
  const [modalVisiblesafe, setmodalVisiblesafe] = useState(false);
  const [imgurl, setimgurl] = useState(false);
  const [loading, setloading] = useState(false);
  const [isTfReady, setTfReady] = useState(false); // gets and sets the Tensorflow.js module loading status
  const [model, setModel] = useState(null); // gets and sets the locally saved Tensorflow.js model
  const [image, setImage] = useState(null); // gets and sets the image selected from the user
  const [predictions, setPredictions] = useState(null); // gets and sets the predicted value from the model
  const [error, setError] = useState(false);
  const [base64img, base64imgset] = useState(false);// gets and sets any errors
  const [skinimage, setskinimage] = useState("https://slema.lk/wp-content/themes/consultix/images/no-image-found-360x260.png");

  useEffect(() => {
    (async () => {
      await tf.ready(); // wait for Tensorflow.js to get ready
      setTfReady(true); // set the state 
      //    var data = await ImgToBase64.getBase64String('https://us.123rf.com/450wm/claudiodivizia/claudiodivizia1604/claudiodivizia160401668/56021813-red-colour-paper-useful-as-a-background-texture.jpg')
      //     .then(base64String => {return base64String})
      //     .catch(err => {return err});
      //     // var data = await RNFS.readFile("https://us.123rf.com/450wm/claudiodivizia/claudiodivizia1604/claudiodivizia160401668/56021813-red-colour-paper-useful-as-a-background-texture.jpg", 'base64').then(res => { return res });
      //     proimgpredi(data);
      // load the model to the state
      // get the permission for camera roll access for iOS users

      //const model = await mobilenet.load();
      const modelJson = require('../../assets/model.json');
      const modelWeights = require('../../assets/weights.bin');
      const mod = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      setModel(mod);
      const ref = firebase.storage().ref().child(`SkinTypes/skin1`);
      const remoteURL = await ref.getDownloadURL();


      if (remoteURL != "") {
        setskinimage(remoteURL);
      }


    })();
  }, []);


  const proimgpredi = async () => {

    // let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsEditing: true,
    //     quality: 1,
    //     aspect: [4, 3],

    //   });

    // if (!result.cancelled) {
    setmodalVisiblesafe(true);
    setloading(true);
    const source = { uri: "https://firebasestorage.googleapis.com/v0/b/cosmeticfinder-712ae.appspot.com/o/SkinTypes%2Fskin1?alt=media&token=c4d371eb-4300-4ceb-896f-efe1627b1147" };
    setImage(source); // put image path to the state
    const imageTensor = await imageToTensor(source); // prepare the image
    setloading(false);


    // }

    //const cropdata = await cropPicture(result, 3);

  }

  async function imageToTensor(source) {
    const response = await fetch(source.uri, {}, { isBinary: true });
    const rawImageData = await response.arrayBuffer();
    const { width, height, data } = jpeg.decode(rawImageData, {
      useTArray: true, // Uint8Array = true
    });
    // remove the alpha channel:
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }

    // transform image data into a tensor
    const img = tf.tensor3d(buffer, [width, height, 3]);

    // calculate square center crop area
    const shorterSide = Math.min(width, height);
    const startingHeight = (height - shorterSide) / 2;
    const startingWidth = (width - shorterSide) / 2;
    const endingHeight = startingHeight + shorterSide;
    const endingWidth = startingWidth + shorterSide;

    // slice and resize the image
    const sliced_img = img.slice(
      [startingWidth, startingHeight, 0],
      [endingWidth, endingHeight, 3]
    );
    const resized_img = tf.image.resizeBilinear(sliced_img, [224, 224]);

    // add a fourth batch dimension to the tensor
    const expanded_img = resized_img.expandDims(0);

    // normalise the rgb values to -1-+1
    const getpre = await model.predict(expanded_img.toFloat().div(tf.scalar(127)).sub(tf.scalar(1)));
    const highpre = getpre.dataSync().indexOf(
      Math.max.apply(null, getpre.dataSync()),
    );
    setPredictions(result_mapping[highpre]);
    setimgurl("../../assets/" + result_mapping[highpre] + ".jpg");


  }

  const uploadimage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],

    });

    if (!pickerResult.cancelled) {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", pickerResult.uri, true);
        xhr.send(null);
      });

      const ref = firebase.storage().ref().child(`SkinTypes/skin1`);
      const snapshot = await ref.put(blob, { contentType: "image/jpg" });
      const remoteURL = await snapshot.ref.getDownloadURL();
      setskinimage(remoteURL);
    }
  }

  const productsection = () => {
    setmodalVisiblesafe(false);
    navigation.navigate('suggetionproduct', {
      code: { predictions },
    });
  }


  return (
    <View style={styles.container}>
      <View style={styles.img}>
        <View style={{ padding: 5, backgroundColor: "#2980B9" }}>
          <Text style={{ fontSize: 12, color: 'white', justifyContent: "center", fontWeight: "bold" }}>Your Skin</Text>
        </View>
        <Image source={{ uri: skinimage }} style={{ flex: 1, borderColor: "#AEB6BF" }} resizeMode='stretch' />
        <View style={{ padding: 5, flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Upload" onPress={uploadimage} />
          <Button title="Scan" onPress={proimgpredi} />
        </View>
      </View>

      <View>


      </View>

      <Modal
        animationType="slide"
        coverScreen={true}
        backdropColor="black"
        deviceHeight={50}
        visible={modalVisiblesafe}
        onRequestClose={() => {
          setmodalVisiblesafe(false);
        }}
      >
        <View style={{ width: "100%", height: 200, borderRadius: 5 }}>
          {loading && <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignContent: "center" }}>
            <ActivityIndicator animating={loading} size="small" style={{ opacity: 1 }} color="#2980B9" />
          </View>}
          {!loading &&
            <View style={{ flex: 1, backgroundColor: "white", borderRadius: 5 }}>
              <View style={{ width: "100%", backgroundColor: "#1ABC9C", padding: 5, height: 32, flexDirection: "row", justifyContent: "flex-start", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                <Ionicons name="checkmark-circle" size={24} color="white" /><Text style={{ fontSize: 18, color: 'white', fontWeight: "bold", flex: 1 }}>Your Skin Type: -{predictions}</Text>
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
                <Text style={{ fontSize: 10, color: 'white', fontWeight: "bold" }}>System has Identified your skin type as a {predictions}, Please click suggestion button to view suggested products </Text>
              </View>
              <View>
                <Button title="Suggestion Products" onPress={productsection} />
                <Button title="close" onPress={() => {
                  setmodalVisiblesafe(false);
                }} />
              </View>
            </View>}
        </View>

      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white"
  },
  img: {

    height: 400,
    margin: 5,
    borderWidth: 1,
    backgroundColor: "#D7DBDD"


  },
});



export default questions