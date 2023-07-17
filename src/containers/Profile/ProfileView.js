import React from 'react';
import {
  View,
  Image as RnImage,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Text, Image, CircularImage, CustomNavbar} from '../../components';
import styles from './ProfileStyles';
import {Colors, Fonts, Images, AppStyles} from '../../theme';
import {USER_FIELDS_NAME, USER_TRANSPORT_FIELDS_NAME} from '../../constants';
import DeviceInfo from 'react-native-device-info';
import util from '../../util';
import _ from 'lodash';
export default function ProfileView(props) {
  const {imagePath, onCamPress, user, loading, vehicles} = props;
  const TRANSPORT = user[USER_FIELDS_NAME.TRANSPORT];
  let readableVersion = DeviceInfo.getVersion();
  if (user[USER_FIELDS_NAME.ACCESS_TOKEN] === 'wewr') {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={AppStyles.paddingHorizontalBase}>
        <View style={styles.profilePicParent}>
          {user[USER_FIELDS_NAME.IMAGE].url === '' && (
            <RnImage
              source={Images.user_ph}
              style={{height: 110, width: 110}}
            />
          )}
          {user[USER_FIELDS_NAME.IMAGE].url != '' && (
            <CircularImage
              placeholderStyle={styles.circularPlaceHolder}
              placeholderSource={Images.user_ph}
              noShadow
              size={110}
              image={user[USER_FIELDS_NAME.IMAGE].url}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              if (!loading) onCamPress();
            }}
            style={styles.camIconParent}>
            {!loading && <RnImage source={Images.pen} style={styles.camIcon} />}
            {loading && <ActivityIndicator size="small" color={Colors.white} />}
          </TouchableOpacity>
        </View>
        <View style={AppStyles.mTop15}>
          <Text size={Fonts.size.xii} color={Colors.accent}>
            PERSONAL INFORMATION
          </Text>
          <View>
            <View style={styles.contentRow}>
              <Text style={{flex: 2}} size={Fonts.size.xiii}>
                Full name:
              </Text>
              <Text style={{flex: 3}} size={Fonts.size.xiii}>
                {user[USER_FIELDS_NAME.NAME]}
              </Text>
              {__DEV__ && (
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {user[USER_FIELDS_NAME.USER].email}
                </Text>
              )}
            </View>
            <View style={styles.contentRow}>
              <Text style={{flex: 2}} size={Fonts.size.xiii}>
                Phone number:
              </Text>
              <Text style={{flex: 3}} size={Fonts.size.xiii}>
                {user[USER_FIELDS_NAME.PHONE]}
              </Text>
            </View>
            <View style={styles.contentRow}>
              <Text style={{flex: 2}} size={Fonts.size.xiii}>
                Email:
              </Text>
              <Text style={{flex: 3}} size={Fonts.size.xiii}>
                {user[USER_FIELDS_NAME.EMAIL]}
              </Text>
            </View>
            <View style={styles.contentRow}>
              <Text style={{flex: 2}} size={Fonts.size.xiii}>
                Address:
              </Text>
              <Text style={{flex: 3}} size={Fonts.size.xiii}>
                {user[USER_FIELDS_NAME.ADDRESS]}
              </Text>
            </View>
            <View style={styles.contentRow}>
              <Text style={{flex: 2}} size={Fonts.size.xiii}>
                Postcode/City:
              </Text>
              <Text style={{flex: 3}} size={Fonts.size.xiii}>
                {`${user[USER_FIELDS_NAME.POST_CODE]} , ${
                  user[USER_FIELDS_NAME.CITY]
                }`}
              </Text>
            </View>
          </View>
        </View>
        {
          <View style={AppStyles.mTop15}>
            <Text size={Fonts.size.xii} color={Colors.accent}>
              TRANSPORTATION
            </Text>
            <View style={styles.vehicleRapper}>
              {vehicles.map(item => {
                console.log({item});
                let selected =
                  item.id ===
                  TRANSPORT[USER_TRANSPORT_FIELDS_NAME.TRANSPORT_ID];
                return (
                  <View key={util.generateGuid()} style={styles.iconContainer}>
                    <RnImage
                      source={
                        selected ? {uri: item.iconSelected} : {uri: item.icon}
                      }
                      style={styles.vehicleIcon}
                    />
                    {selected && <View style={styles.lineGreen} />}
                  </View>
                );
              })}
            </View>
            <View>
              <View style={styles.contentRow}>
                <Text style={{flex: 2}} size={Fonts.size.xiii}>
                  Make, Model:
                </Text>
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {TRANSPORT[USER_TRANSPORT_FIELDS_NAME.MAKE_MODEL]}
                </Text>
              </View>
              <View style={styles.contentRow}>
                <Text style={{flex: 2}} size={Fonts.size.xiii}>
                  Year:
                </Text>
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {TRANSPORT[USER_TRANSPORT_FIELDS_NAME.YEAR]}
                </Text>
              </View>
              <View style={styles.contentRow}>
                <Text style={{flex: 2}} size={Fonts.size.xiii}>
                  Number plate:
                </Text>
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {TRANSPORT[USER_TRANSPORT_FIELDS_NAME.NUMBER_PLATE]}
                </Text>
              </View>
              <View style={styles.contentRow}>
                <Text style={{flex: 2}} size={Fonts.size.xiii}>
                  Color:
                </Text>
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {TRANSPORT[USER_TRANSPORT_FIELDS_NAME.COLOR]}
                </Text>
              </View>
              <View style={styles.contentRow}>
                <Text style={{flex: 2}} size={Fonts.size.xiii}>
                  Capacity:
                </Text>
                <Text style={{flex: 3}} size={Fonts.size.xiii}>
                  {` ${user[USER_FIELDS_NAME.CAPACITY]}`}
                </Text>
              </View>
            </View>
          </View>
        }
        <Text style={styles.appVersion} size={Fonts.size.xv} type="italic">
          {`App version v${readableVersion}`}
        </Text>
        <Text
          style={styles.logout}
          onPress={() => props.onLogoutPress()}
          size={Fonts.size.xviii}
          type="bold"
          color={Colors.red}>
          Log out
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
