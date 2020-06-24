import React from 'react';
import {View , Text , StyleSheet , FlatList , ScrollView, TouchableOpacity} from 'react-native';
import {Header ,Card , Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default class ChatScreen extends React.Component {

constructor(props) {
        super(props);
        
        
        this.state = {
           chats : [ {name : 'Group #1', group : true},
		{name : 'Group #2', group:true},
		{name : 'Group #3', group:true},
		{name : 'Group #4', group:true},
		{name : 'Friend #1', group:false},
		{name : 'Friend #2', group:false},
		{name : 'Friend #3', group:false},
		{name : 'Friend #4', group:false},
		{name : 'Friend #5', group:false},
		{name : 'Friend #6', group:false},
		{name : 'Friend #7', group:false},
		{name : 'Friend #8', group:false} ],

        forwardedMessage : props.route.params.message,
        

        }
    }



render(){
	return(
		
		<View style={{backgroundColor:"#FFF"}}>
		<LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={{ padding: 15, alignItems: 'center' ,height:60,justifyContent:'center'}}>
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: 14,
              color: '#fff',
              marginTop:30,
              fontFamily:'monospace'
            }}>
            Forward To ->
          </Text>
          </LinearGradient>
  		
  		<ScrollView>
		<FlatList 
			data={this.state.chats}
			nestedScrollEnabled
			keyExtractor={name => this.state.chats.name}
			renderItem ={({item})=>{
				if (item.group) {
				return(
					<Card containerStyle ={{margin:0, height:50}}>
					{
						<TouchableOpacity onPress={()=>this.props.navigation.navigate('InChat',{username:item.name , forwardedMessage})}>
					<View style={{flexDirection:'row',padding:4 }}>
					
						
							
					
						
						<Text style={{fontFamily:'monospace',alignSelf:'center',marginLeft:20,color:"#444484",fontSize:16}}>{item.name}</Text>
						
						</View>
						</TouchableOpacity>
					}
					</Card>
			);
			} else {
				return(
					<Card containerStyle ={{margin:0, height:50}}>
					{
			<TouchableOpacity onPress={()=>this.props.navigation.navigate('InChat',{username:item.name , forwardedMessage: this.state.forwardedMessage})}>
					<View style={{flexDirection:'row',padding:4 }}>
						
											
						<Text style={{fontFamily:'monospace',alignSelf:'center',marginLeft:20,color:"#444484",fontSize:16}}>{item.name}</Text>
						</View>
				</TouchableOpacity>
					}
					</Card>
			);	
			}
			}}
		/>
		
		</ScrollView>
		</View>
		);
		}
	};

const styles = StyleSheet.create({
	
	  circle:{
    width : 60,
    height :60 ,
    borderRadius : 60 /2,
    backgroundColor :"red",
    position:"absolute",
    left:-120,
    top:-20
  },

});

