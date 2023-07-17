import React from 'react';
import styles from './CircularImageStyles';
import {Text, Image} from '../';
import {View} from 'react-native';
import {Images, Colors, AppStyles} from '../../theme';

export default function CircularImageView(props) {
  const img = {uri: `${props.image}`};
  const parentStyle = props.noShadow
    ? [
        {
          height: props.size,
          width: props.size,
          backgroundColor: 'white',
          borderRadius: props.size / 2,
          alignItems: 'center',
        },
        props.containerStyles,
      ]
    : [
        {
          height: props.size,
          width: props.size,
          backgroundColor: 'white',
          borderRadius: props.size / 2,
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 5,
          alignItems: 'center',
        },
        props.containerStyles,
      ];
  return (
    <View style={parentStyle}>
      <Image
        {...props}
        style={{
          width: props.size,
          height: props.size,
          position: 'absolute',
          zIndex: 10,
        }}
        borderRadius={props.size / 2}
        source={img}
        placeholderStyle={{
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
          zIndex: -10,
          position: 'absolute',
        }}
      />
    </View>
  );
}
