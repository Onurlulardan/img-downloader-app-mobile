/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState,useEffect } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  Image,
  PermissionsAndroid, Platform
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // const IMAGE_PATH = 'https://cdn.pixabay.com/photo/2022/04/07/15/13/farming-7117714_960_720.jpg';
  const [textInputValue, setTextInputValue] = React.useState('');

  const checkPermission = async () => {
    if(Platform.OS === 'ios'){
      downloadImage();
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Depolama Kullanım İzni Gerekli',
            message: 'İndirilen Resmi Kayıt Edebilmek İçin İzin Gerekli...'
          }
        )
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          console.log('Depolama İzni Verildi');
          downloadImage();
        } 
        else {
          alert('Depolama İzni Verilmedi');
        }
      } 
      catch (error) {
        console.warn(error);
      }
    }
  }

  const downloadImage = () => {
    let date = new Date();
    let image_URL =textInputValue;
    // let image_URL = image;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];

    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache : true,
      addAndroidDownloads: {
        useDownloadManager: true,
        Notification: true,
        path: PictureDir + '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
        description : 'Image'
      }
    }
    config(options).fetch('GET', image_URL).then(response => {
      console.log('res -> ', JSON.stringify(response));
      alert('Resim İndirme İşlemi Başarılı...');
    });
  }

  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined
  }

//   useEffect(() => {
//     const imgs = document.querySelectorAll('.KL4Bh img');
//     imgs.forEach(img => console.log(img.src));
// }, []);

  function sendValues(textInputValue) {
    console.log(textInputValue);
    setTextInputValue(textInputValue);
    checkPermission();
};

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white,}, styles.MainDiv}>
          <TextInput style={{ 
          height: 40, 
          borderColor: 'gray', 
          borderWidth: 1,
          placeholderTextColor: 'gray',
        }}
        onChangeText={text => setTextInputValue(text)}
        value={textInputValue}
        placeholder="Bağlantı Adresini Giriniz!"
        ></TextInput>

        <Button title='İndir' onPress={()=> sendValues(textInputValue)}></Button>

        </View>
      </ScrollView>

      <Image
        source={{uri: textInputValue}}
        style={styles.image}
      ></Image>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  MainDiv: {
    height: "100%",
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    margin: 5
  }
});

export default App;
