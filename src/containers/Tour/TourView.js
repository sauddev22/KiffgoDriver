import React from 'react';
import {View, Image as RnImage, TouchableOpacity} from 'react-native';
import {Text, Image, Button} from '../../components';
import styles from './TourStyles';
import SwiperRN from 'react-native-swiper';
import {Fonts, Colors, AppStyles, Metrics} from '../../theme';
import {tours} from '../../constants';
export default function TourView(props) {
  return (
    <View style={styles.container}>
      {false && (
        <View style={styles.skipParent}>
          <TouchableOpacity onPress={props.skip}>
            <Text color={Colors.text.secondary} size={Fonts.size.xvi}>
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.skip}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      <SwiperRN
        loop={false}
        onMomentumScrollEnd={(e, {index, total}) => {
          props.scrollEnd(index, total - 1);
        }}
        paginationStyle={{position: 'absolute', bottom: 80}}
        activeDotColor={Colors.white}
        scrollEnabled={true}
        dot={
          <View
            style={{
              backgroundColor: Colors.dotColor,
              width: 12,
              height: 12,
              borderRadius: 6,
              marginRight: 8,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: Colors.accent,
              width: 12,
              height: 12,
              borderRadius: 6,
              marginRight: 8,
            }}
          />
        }
        ref={swiper => {
          props.swiperRef(swiper);
        }}>
        {tours.map((element, index) => {
          return (
            <View style={{flex: 1}}>
              <View style={{flex: 2}} />
              <View style={{flex: 8}}>
                <RnImage
                  source={element.image}
                  style={{
                    alignSelf: 'center',
                    height: 350,
                    width: 350,
                    resizeMode: 'contain',
                    flex: 1,
                  }}
                />
              </View>
              <View style={{flex: 1}} />
              <View
                style={{
                  marginBottom: 150,
                  marginHorizontal: 22.5,
                  paddingHorizontal: 16,
                  // flex: 3, //removed this due to text hiding on iphone 6-7
                }}>
                <Text
                  size={Fonts.size.xxii}
                  type="bold"
                  style={{textAlign: 'center'}}>
                  {element.title}
                </Text>
                <Text
                  size={Fonts.size.xv}
                  style={{textAlign: 'center', marginTop: 8}}>
                  {element.content}
                </Text>
              </View>
            </View>
          );
        })}
      </SwiperRN>
      <View style={{marginBottom: 30, paddingHorizontal: 116}}>
        <Button
          onPress={() => props.buttonClick()}
          size={Fonts.size.xvi}
          type="bold"
          color={'white'}
          style={{backgroundColor: Colors.accent}}>
          {props.currentPage < tours.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </View>
    </View>
  );
}
