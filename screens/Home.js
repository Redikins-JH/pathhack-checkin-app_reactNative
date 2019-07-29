import React, { Component } from 'react'
import { 
  Button,
  Text, 
  StyleSheet, 
  View, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
//import {  Location, Permissions } from 'expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import CameraModule from '../components/CameraModule';
import * as theme from '../theme';

const databaseURL ="https://chenkin-app.firebaseio.com";

const { Marker } = MapView;
//const { height, width } = Dimensions.get('screen');
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

  

class Home extends Component {
  state = {
    region: {
      latitude: 331,
      longitude: 111,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    },
    locationResult: null,
    neww: null,
    cameraOn : false
  }
  
   componentDidMount() {
    this._getLocationAsync();
   };
     
  
  _onPressLocationButton = () => {
    this._getLocationAsync();
    this.setState({neww: JSON.parse(this.state.locationResult).coords})
    this.setState({cameraOn : true})
  }
 // expo library 활용한 gps 가져오기
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    }
    
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
  };

//파이어 베이스 데이터 베잇로 현 로케이션 경위도 값 전송
  _post(location) {
    return fetch(`${databaseURL}/location.json`, {
        method: 'POST',
        body: JSON.stringify(location)
    }).then(res => {
        if(res.status != 200) {
            throw new Error(res.statusText);
        }
        return res.json();
    })
  }
  
  handleSubmit = () => {
    const location = {
        latitude: this.state.neww.latitude,
        longitude: this.state.neww.longitude
    }
    
    this._post(location);
  }


  renderHeader() {
    return (
      <View style={styles.header}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Detected location</Text>
          <Text style={styles.headerLocation}>{this.state.neww !== null ? "User 현재 위치" : "초기 값 : Apple Store, San francisco, USA" }</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
          
          <TouchableOpacity style={styles.button} onPress = {(e) => this.handleSubmit()}>
            <Text>
              Check in 하기
            </Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback>
              <Ionicons name="ios-navigate" size={theme.SIZES.icon * 2.7} onPress = {(e) => this._onPressLocationButton()} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }  
  
  render() {
    const { currentPosition } = this.props;
 
    // if (this.state.neww === null) {
    //   var { latLon } = {
    //     latitude: 35.231400,
    //     longitude: 129.084160,
    //   }
    // } else {
    //   var { latLon } = {
    //     latitude: this.state.neww.coords.latitude,
    //     longitude: this.state.neww.coords.longitude,
    //   }
    // }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        
        <MapView
          region={this.state.neww}
          initialRegion={currentPosition}
          style={styles.map}
        >
        
          <Marker
            coordinate= {this.state.neww === null ? {
              latitude: 37.785834,
              longitude: -122.406417} : {
                latitude: this.state.neww.latitude,
                longitude: this.state.neww.longitude} 
            }
            title= "현 위치"
            description= "설명은 없다 좀 되라"
          />
        </MapView>  
        <View style={styles.cameraWrap}>
          <Text>
            - 현 위치 탐색: {this.state.neww !== null ? "On" : "Off" }
          </Text>
          <Text> 
            - user location data: {this.state.neww !== null ? `latitude: ${this.state.neww.latitude}, longitude: ${this.state.neww.longitude}` : "Initial Location" }
          </Text>
          <View style={styles.camera}>
            <CameraModule cameraOn={this.state.cameraOn}/>
          </View> 
        </View>
      </View>
    )
  }
}

//초기 지도 값 설정

//this.state.locationResult
Home.defaultProps = {
  currentPosition: {
    latitude: 37.785834,
    longitude: -122.406417,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0021,
  }, 
}

export default Home;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 2.5,
    paddingBottom: theme.SIZES.base * 1.5,
  },
  headerTitle: {
    color: theme.COLORS.gray,
  },
  headerLocation: {
    fontSize: theme.SIZES.font,
    fontWeight: '500',
    marginTop: 10
  },
  map: {
    flex: 1.5,
    flexDirection: 'column'
  },
  cameraWrap:{
    flex: 2,
    alignContent: 'center',
    justifyContent: 'center'
  },
  camera: {
    flex:1,
    backgroundColor: 'black'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#f77225',
    marginRight: 10,
    marginBottom: 9,
    padding: 8,
    opacity: 0.8
  }
});

