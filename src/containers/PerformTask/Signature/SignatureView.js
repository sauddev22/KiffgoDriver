import React from 'react';
import {
  View,
  Image as RnImage,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import {Text, Image} from '../../../components';
import SignatureCapture from 'react-native-signature-capture';
import styles from './SignatureStyles';
import {Colors, Metrics} from '../../../theme';
import {Actions} from 'react-native-router-flux';
import {activeOpacity} from '../../../constants';
import {DotIndicator} from 'react-native-indicators';

export default function SignatureView(props) {
  const {startDrawing, loading} = props;
  const style = `.m-signature-pad--footer {
    display: none;
  }
 .m-signature-pad {
                  box-shadow: none; border: none;
                  margin-left: 0px;
                  margin-top: 0px;
                } 
                 .m-signature-pad--body
                  canvas {
                    background-color: #E5E5F1;
                  }
                .m-signature-pad--body {border: none}
                .m-signature-pad--footer {display: none; margin: 0px;}
                body,html {
                   width: 100%; 
                   height: 100%;
                }
                .html {height: 300px; width: 300px;}
 
  `;
  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          {/* <Text style={{alignItems: 'center', justifyContent: 'center'}}>
            Signature Capture Extended{' '}
          </Text> */}
          {/* <SignatureCapture
            style={[styles.signature, {flex: 1}]}
            ref={ref => {
              props.signRef(ref);
            }}
            onSaveEvent={props._onSaveEvent}
            onDragEvent={props._onDragEvent}
            saveImageFileInExtStorage={Platform.OS === 'android'}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'potrait'}
          /> */}
          <Signature
            ref={ref => {
              props.signRef(ref);
            }}
            onOK={props._onSaveEvent}
            onBegin={props._onDragEvent}
            // onEmpty={this.handleEmpty}
            descriptionText="Sign"
            clearText="Clear"
            confirmText="Save"
            webStyle={style}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableHighlight
            style={[styles.buttonStyle, styles.greyButtons]}
            onPress={() => {
              Actions.pop();
            }}>
            <Text style={styles.buttons}>Cancel</Text>
          </TouchableHighlight>
          <View>
            <TouchableHighlight
              style={[styles.buttonStyle, styles.greyButtons]}
              onPress={() => {
                props.resetSign();
              }}>
              <Text>Reset</Text>
            </TouchableHighlight>
            <TouchableOpacity
              activeOpacity={
                startDrawing ? activeOpacity.high : activeOpacity.off
              }
              style={
                startDrawing
                  ? [styles.buttonStyle, styles.whiteButtons]
                  : [styles.buttonStyle, {backgroundColor: Colors.grey}]
              }
              onPress={() => {
                startDrawing ? props.saveSign() : () => console.log('no sig');
              }}>
              {!loading && <Text style={{color: Colors.darkGrey}}>Save</Text>}
              {loading && (
                <DotIndicator
                  animationDuration={1000}
                  color={Colors.darkGrey}
                  size={6}
                  count={3}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
