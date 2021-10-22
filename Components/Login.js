import React,{useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View,Image,TextInput,Button,TouchableOpacity } from 'react-native';
import logo from '../assets/eye.jpg';
import firebase from 'firebase/app';
import "firebase/auth";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";




const login = props => {

    const [loading,setloading] = useState(false);
    const [email,setemail] = useState('');
    const [Password,setpassword] = useState('');

    

    const emailsetfunc = (emailtext) => {
        setemail(emailtext);
    }

    const Passwordsetfunc = (passwordtext) => {
        setpassword(passwordtext);
    }

    
    const SignIn = () => {

        if(email === '' && Password === '')
        {
            
                showMessage({
                    message: "Authentication Fail",
                    description: "Email and Password required",
                    type: "danger",
                });
            
        
            
        }
        else
        {
            setloading(true);
            firebase.auth().signInWithEmailAndPassword(email, Password)
            .then((userCredential) => {
                
                var user = userCredential.user;
                setloading(false);
                props.authcheck();
               
                
            })
            .catch((error) => {
            
                showMessage({
                    message: "Authentication Fail",
                    description: "Invalid Username or Password",
                    type: "danger",
                });
                setloading(false);
            });

        }

        
        

        
        
    }

    const signupsection = () => {
        props.signupcheck();
    }

   const forgetpass = () =>{
       props.forgetp();
   }
    

    return (
        <View style={styles.container}>
            
            
            <View style={styles.logincard}>
              <View style={styles.header}>
                  <Image source={logo} style={{ width: 70, height: 70, borderRadius:90,marginEnd:10 }} /> 
                  <Text style={styles.cosmatic}>Cosmetic</Text><Text>Finder</Text>
                  
              </View> 
              <View>
              <FlashMessage position="Top" /> 
              </View>
              <View style={styles.fill}>

              <ActivityIndicator animating={loading} size="small" style={{opacity:1}} color="#2980B9" />
                  
                  <TextInput placeholder='User Name' style={styles.input} onChangeText={emailsetfunc} value={email}/>
               
                  <TextInput placeholder='Password' secureTextEntry={true} style={styles.input} onChangeText={Passwordsetfunc} value={Password}/>
                  <Button title='Sign In' onPress={SignIn}/>
                  <TouchableOpacity style={styles.bottom} onPress={signupsection} >
                      <Text style={styles.signupfoget}>SignUp</Text>
                      
                  </TouchableOpacity >
                     
                  <TouchableOpacity onPress={forgetpass}>
                      <Text style={styles.signupfoget}>Forget Password?</Text>
                  </TouchableOpacity>


              </View>
              <View style={styles.footer}>
                  <Text style={styles.footertext}>Powered By Nishen00</Text>
              </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({

    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#2980B9'
    },

    logincard:{
        flex:1,
        backgroundColor:'white',
        // justifyContent:'center',
        margin:105,
        marginLeft:100,
        marginRight:100,
        width:'85%',
        shadowColor:'black',
        shadowOffset:{width:0,height:6},
        shadowOpacity:0.67,
        shadowRadius:6,
        elevation:100,
        borderRadius:10,
        
    },

    header:{
        width:'100%',
        height:'15%',
        backgroundColor:'#F8F9F9',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        padding:20,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#AEB6BF'
        
    },

    cosmatic:{
        fontSize: 28,
        fontWeight: "bold",
        color:'#2980B9',
        
    },

    signupfoget:{
        fontSize:16,
        
        color:'#2980B9'
    },

    footertext:{
        color:'#5D6D7E' 
    },

    fill:{
        flex:1,
        padding:30,
        justifyContent:'center',
        alignItems:'center'
        
    },

    input:{
        borderWidth:1,
        borderColor:'#AEB6BF',
        width:'100%',
        borderRadius:5,
       
        padding:10,
        marginVertical:10,
        
    },

    bottom:{
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5,
        padding:10
    },

    footer:{
      backgroundColor:'#F8F9F9',
      alignItems:'center',
      justifyContent:'center',
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
      borderTopColor:'#AEB6BF',
      borderTopWidth:0.5

    }



})

export default login