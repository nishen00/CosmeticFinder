
import React,{useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Components/Login';
import Navigate from './Components/Navigation';
import firebase from 'firebase/app';
import firebaseConfig from './Database/config';
import Signuptwo from './Components/signup';
import Forgetpassws from './Components/forgetpassword'

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  
  const [auth,setauth] = useState(false);
  const [signup,setsignup] = useState(false);
  const [forget,setforget] = useState(false);

  const setauthfun = () => {
    setauth(true);
  }

  const setsignupme = () => {
    setsignup(true);
  }

  const setsignupme2 = () => {
    setsignup(false);
  }

  const setforget1 = () => {
    setforget(true);
  }

  const setforget2 = () => {
    setforget(false);
  }

  let viewset = <Navigate/>

  if (auth === false)
  {
    viewset = <Login authcheck = {setauthfun} signupcheck = {setsignupme} forgetp = {setforget1}/>

    if (signup === true)
    {
      viewset = <Signuptwo signupcheck2 = {setsignupme2} authcheck = {setauthfun}/>
    }

    if (forget === true)
    {
      viewset = <Forgetpassws signupcheck2 = {setforget2} authcheck = {setauthfun}/>
    }
  }

  return (
    <View style={styles.container}>
   {viewset}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
