import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as theme from '../theme';

export default class CameraModule extends React.Component {
  state = {
    hasCameraPermission: true,    //원래 null인데 현재 임시로 true 로 해 두었다.
    type: Camera.Constants.Type.back,
    checkingOk: false,    //유저 GPS위치가 목표 GPS와의 거리 10m 이내로 들어 왔을때 ture 로 활성        
    cameraOn: true,    // cameraOn 은 checkingOk 에 의존

  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} 
                  type={this.state.type} 
                  ref={ref => {this.camera = ref;}}
                  onFacesDetected={this.handleFacesDetected}
                  faceDetectorSettings={{
                    mode: FaceDetector.Constants.Mode.fast,
                    detectLandmarks: FaceDetector.Constants.Landmarks.none,
                    runClassifications: FaceDetector.Constants.Classifications.none,
                  }}
          >
            <View
              style={{
                flex: 2,
                backgroundColor: 'transparent',
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                
                <Text style={{ padding: 5, backgroundColor: 'white', fontSize: 18, marginTop: 10, color: 'black',  opacity: 0.7 }}> 
                  {this.state.cameraOn ? '화면전환' : 'Camera deny'} 
                </Text>
                
              </TouchableOpacity>
              {this.props.cameraOn === true ?
                <TouchableOpacity style={{ flex: 1, marginBottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                  <Ionicons name="ios-camera" size={theme.SIZES.icon * 6} color="red" onPress = {() => this.snap()} />
               </TouchableOpacity> : 
              null }
            </View>
          </Camera>
        </View>
      );
    }
  }
}