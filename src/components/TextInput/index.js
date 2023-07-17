// @flow
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput as RNTextInput,
  ViewPropTypes,
  View,
  Image,
} from 'react-native';
import {Text, ButtonView} from '../';
import {Colors, AppStyles, Images, Fonts} from '../../theme';
import styles from './styles';

export default class TextInput extends React.Component {
  constructor() {
    super();
    this.state = {
      showPass: true,
    };
  }
  static propTypes = {
    label: ViewPropTypes.style,
    error: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    multiline: PropTypes.bool,
    inputStyles: PropTypes.object,
  };

  static defaultProps = {
    error: '',
    label: '',
    containerStyle: {},
    onPress: null,
    multiline: false,
    inputStyles: {},
  };

  focus() {
    this.myRef.focus();
  }

  blur() {
    this.myRef.blur();
  }
  toggleShowPass() {
    const {showPass} = this.state;

    this.setState({showPass: !showPass});
  }
  render() {
    const {
      label,
      error,
      containerStyle,
      onPress,
      multiline,
      inputStyles,
      ...rest
    } = this.props;
    return (
      <View style={containerStyle}>
        {!_.isEmpty(label) && (
          <Text size={Fonts.size.xv} style={AppStyles.mTop10}>
            {label}
          </Text>
        )}

        <View>
          <RNTextInput
            ref={ref => {
              this.myRef = ref;
            }}
            style={[
              styles.input,
              inputStyles,
              multiline ? styles.multilineInput : {},
            ]}
            blurOnSubmit={false}
            selectionColor={Colors.grey}
            multiline={multiline}
            secureTextEntry={
              this.state.showPass && _.isEqual(this.props.type, 'password')
            }
            placeholderTextColor="#c9c9c9"
            {...rest}
          />
          {_.isEqual(this.props.type, 'password') &&
            this.props.value.length > 0 && (
              <View style={styles.showPass}>
                <Text
                  size={Fonts.size.xiv}
                  onPress={() => this.toggleShowPass()}
                  color={Colors.accent}>
                  {`${this.state.showPass ? 'Show' : 'Hide'}`}
                </Text>
              </View>
            )}
          {!_.isNull(onPress) && (
            <ButtonView onPress={onPress} style={styles.buttonOverlay}>
              <Image
                source={Images.arrow_right_grey}
                style={styles.arrowIcon}
              />
            </ButtonView>
          )}
        </View>

        {!_.isEmpty(error) && !_.isUndefined(error) && !_.isNull(error) && (
          <Text
            type="medium"
            size="small"
            color={Colors.red}
            style={[AppStyles.mTop5, AppStyles.mBottom5]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
}
