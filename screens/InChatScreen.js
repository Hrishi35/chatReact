import React,{useState,useEffect} from 'react';
import {View , Text , StyleSheet, Image, PermissionsAndroid , Button} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GiftedChat,InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AudioRecord from 'react-native-audio-record';
import {PERMISSIONS , request , check} from 'react-native-permissions';
import TrackPlayer from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob';

export default class InChatScreen extends React.Component {
	constructor(props) {
        super(props);
        
        
        this.state = {
            messages: [],
        hasCameraPermission: null,
        photu:'',
        adio:'',
        document:'',
        modalVisible: true,
        username : props.route.params.username,
        forwardedMessage :props.route.params.forwardedMessage,
        filee:''

        }
    }
   

  

   
 async componentDidMount() {
  		 
          request(PERMISSIONS.ANDROID.INTERNET && PERMISSIONS.ANDROID.CAMERA && PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE && PERMISSIONS.ANDROID.RECORD_AUDIO && PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
          console.log(result);  
          });
		this.setState({
      		messages: [
        		{
          		_id: 1,
          		text: 'Hello',
          		createdAt: new Date(),
          		user: {
            		_id: 2
                      
            		},
          		image: '',
          		audio:''
  		
		        },
    		  ],
    		});
	
  	
		    this.setState({ hasCameraPermission: status === "granted" });
				
        
          
          
  			
  			if (this.state.forwardedMessage) {
			this.setState(previousState => ({
          		messages: GiftedChat.append(previousState.messages, forwardedMessage),
        		}));

  			}
  	
  		  Audio.setAudioModeAsync({
  		allowsRecordingIOS: true,
  		staysActiveInBackground: false,
 		interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  		playsInSilentModeIOS: true,
  		shouldDuckAndroid: true,
  		interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  		playThroughEarpieceAndroid: true,
		})
  }


_getPhotoLibrary = async () => {
  console.log('call');
   try{   
    const options ={
      title: 'Upload Photo',
      cancelButtonTitle: 'Cancel',
       takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      
      mediaType: 'photo',
  
    }
      ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      this.setState({ photu: response.uri });
      console.log('photu',this.state.photu);
      this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, {
            _id: 2,
            text: '',
            createdAt: new Date(),
            user: {
              _id: 1,
              
            },
            image: this.state.photu,
  
          }),
        }));
        });
    
    }catch(e){
      console.log(e);
    }
}

_uploadImage = async () => {
    
     try{
      
     await RNFetchBlob.fetch('POST' , 'https://chatapptask.000webhostapp.com/api/fileUploadApi.php',
        {
          'Content-Type': 'multipart/form-data',
        },[
            { 
              name : 'file_attachment',
              filename: this.state.document.name,
              type : this.state.document.type,
              data: RNFetchBlob.wrap(this.state.document.uri),
              
            },
        ]).then(res=>console.log('REsponse',res));
      
      console.log(this.state.document.name);
      const BASE_URL = `https://chatapptask.000webhostapp.com/api/uploads/`;
     const fname = this.state.document.name;
     this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, {
            _id: 2,
            text: BASE_URL+fname,
            createdAt: new Date(),
            user: {
              _id: 1,
              
            },
            image: '',
            audio:'',
  
          }),
        }));
    } catch(e) {
      console.log('err',e);
    }
     
    }


_getCamera = async () => {
  
  try{
  const options ={
      title: 'Upload Photo',
      cancelButtonTitle: 'Cancel',
       takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      
      mediaType: 'photo',
  
    }
  ImagePicker.launchCamera(options, (response) => {
          console.log('Response = ', response);
 
    if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    const source = { uri: response.uri };
  this.setState({ photu: response.uri });
    
  this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, {
            _id: 2,
            text: '',
            createdAt: new Date(),
            user: {
              _id: 1,
              
            },
            image: this.state.photu,
  
          }),
        }));
    
  }
});
  }catch(e){
    console.log(e);
  }
}

 _getDocument = async () => {
  try{
  let res = await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
  });
  console.log('res : ' + JSON.stringify(res));
  console.log('URI : ' + res.uri);
  console.log('Type : ' + res.type);
  console.log('File Name : ' + res.name);
  console.log('File Size : ' + res.size);
  if (!res.cancelled) {
   
   this.setState({document: res});
   try{
    this._uploadImage();
   }catch(e){
    console.log(e);
   }
    }
  }catch(e){
    console.log(e);
  }
 }

 _getAudio = async () => {
	
  	const recording = new Audio.Recording();
	try {
		
		
	console.log('a');
  	await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  	await recording.startAsync();
  	setTimeout(() => {
  		try{
      recording.stopAndUnloadAsync();
      console.log(recording.getURI());
      
  		}catch(e){
  	console.log('err',e);
  	}
    }, 5000);
  	console.log('b');
		} catch (error) {
  console.log(error);
	}

 	}
 _getAudioRecording = async () => {
  
  try{
    
    const options = {
    sampleRate: 16000,  // default 44100
    channels: 1,        // 1 or 2, default 1
    bitsPerSample: 16,  // 8 or 16, default 16
    audioSource: 6,     // android only (see below)
    wavFile: 'test.wav' // default 'audio.wav'
    };
 
    AudioRecord.init(options);
 
    AudioRecord.start();   
    setTimeout(async () => {
      console.log('here');
      try{  

        const audioFile = await AudioRecord.stop();
        console.log('adio',audioFile);
        this.setState({
        adio : audioFile
        
      })
      this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, {
            _id: 2,
            text: '',
            createdAt: new Date(),
            user: {
              _id: 1,
              
            },
            image: '',
            audio:this.state.adio,
  
          }),
        }));

        }catch(e){
        console.log(e);
        }

    }, 5000);
    
    } catch (error) {
       console.log(error);
      }

  }


 _playAudio = async () => {
	
  	
		try {
	
 		 TrackPlayer.setupPlayer().then(async () => {
 
    // Adds a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        url: this.state.adio,
        title: 'Track Title',
        artist: 'Track Artist',
        
    });
 
    // Starts playing it
    TrackPlayer.play();
 
    });
  
			} catch (error) {
  				console.log(error);
			}

 	}

  onSend(messages = []) {
    this.setState(previousState => ({

      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

	forwardMessage = (message) => {
		try{
					this.props.navigation.navigate('Forward',message);
		}catch(e){
			console.log(e);
		}
	}

  onLongPress(context, message) {
    console.log( message);
    const options = ['Copy','Reply','Forward','Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
    }, (buttonIndex) => {
        switch (buttonIndex) {
            case 0:
                Clipboard.setString(message.text);
                break;
            case 1:
               //code to reply
                break;
             case 2 :
             console.log('hi');
             	
              	this.forwardMessage(message);
                break;
        }
    });
}


   renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#FFF',
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);
   renderMessageAudio = (props) => (
  		<View style={{padding:20}}>
  		<Text style={{margin:4}}>Voice</Text>
  		<Button title="play" onPress={this._playAudio}  />
  		</View>
	 );

    renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32 }}
        source={require('../assets/attach.png')}
      />
    )}
    options={{
      'Choose From Gallery': () => {
       
       	this._getPhotoLibrary();
       
      },
      Camera: () => {
        this._getCamera();
      },
      Document: () => {
        this._getDocument();
      },
      Voice: () => {

      	this._getAudioRecording();
      },
      
    }}
    optionTintColor="#222B45"
  />
);

  renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

 renderSend = (props) => (
  <Send
 
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={require('../assets/send.png')}
    />
  </Send>
);

render() {
 
  
          	
	const { photu, hasCameraPermission } = this.state;	
    return (
    	<View style={{flex:1}}>
    	<LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={{ padding: 15, alignItems: 'center' ,height:50,justifyContent:'center'}}>
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: 18,
              color: '#fff',
            
              fontFamily:'monospace'
            }}>
    		{this.state.username}
          </Text>
          </LinearGradient>
  		
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
        renderSend ={this.renderSend}
        renderComposer={this.renderComposer}
        renderActions={this.renderActions}
        renderInputToolbar={this.renderInputToolbar}
        renderMessageAudio={this.renderMessageAudio}
        onLongPress={(context,message)=>this.onLongPress(context,message)}
      />
      </View>

    )
  }

   
};

const styles = StyleSheet.create({
	container:{
		flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
	}
});

