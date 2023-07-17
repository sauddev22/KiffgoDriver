// @flow
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {View, Image} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Text, ButtonView, SearchBar} from '../';
import styles from './styles';
import {Images, AppStyles, Colors, Fonts} from '../../theme';

export default class CustomNavbar extends React.Component {
  static propTypes = {
    hasBack: PropTypes.bool,
    title: PropTypes.string.isRequired,
    leftBtnImage: PropTypes.number,
    leftBtnPress: PropTypes.func,
    leftBtnText: PropTypes.string,
    rightBtnImage: PropTypes.number,
    rightBtnPress: PropTypes.func,
    rightBtnText: PropTypes.string,
    titleColor: PropTypes.string,
    hasBorder: PropTypes.bool,
    style: PropTypes.object,
    hasSearch: PropTypes.bool,
    onSearchText: PropTypes.func,
    isSearching: PropTypes.bool,
    whiteBack: PropTypes.bool,
  };

  static defaultProps = {
    hasBack: true,
    titleColor: '',
    leftBtnImage: undefined,
    leftBtnPress: () => {},
    leftBtnText: '',
    rightBtnImage: undefined,
    rightBtnPress: () => {},
    rightBtnText: '',
    hasBorder: true,
    style: {},
    hasSearch: false,
    onSearchText: () => {},
    isSearching: false,
    whiteBack: false,
  };

  renderLeft(leftBtnImage, leftBtnPress, leftBtnText, hasBack, whiteBack) {
    const renderBack =
      hasBack && _.isEmpty(leftBtnText) && _.isEmpty(leftBtnImage);
    const leftBtnClick = hasBack ? () => Actions.pop() : leftBtnPress;

    return (
      <ButtonView onPress={leftBtnClick} style={styles.btnWrapper}>
        {!_.isEmpty(leftBtnText) && <Text>{leftBtnText}</Text>}
        {!_.isUndefined(leftBtnImage) && (
          <Image source={leftBtnImage} size={styles.btnImage} />
        )}
        {renderBack && (
          <Image
            source={whiteBack ? Images.back_white : Images.back_dark}
            style={styles.btnImage}
          />
        )}
      </ButtonView>
    );
  }

  renderRight(rightBtnImage, rightBtnPress, rightBtnText) {
    return (
      <ButtonView
        onPress={rightBtnPress}
        style={[styles.btnWrapper, styles.rightBtn]}>
        {!_.isEmpty(rightBtnText) && (
          <Text
            style={AppStyles.textUnderline}
            color={Colors.accent}
            type="medium"
            numberOfLines={1}
            ellipsizeMode="tail"
            size="small">
            {rightBtnText}
          </Text>
        )}
        {!_.isUndefined(rightBtnImage) && (
          <Image source={rightBtnImage} size={styles.btnImage} />
        )}
      </ButtonView>
    );
  }

  renderTitle(title, titleColor) {
    return (
      <View style={[AppStyles.flex, AppStyles.centerInner]}>
        <Text
          color={titleColor || '#36363A'}
          type="medium"
          numberOfLines={1}
          ellipsizeMode="tail"
          size={Fonts.size.xvi}>
          {title || ''}
        </Text>
      </View>
    );
  }

  renderSearch(onSearchText, isSearching) {
    return <SearchBar onSearchText={onSearchText} isSearching={isSearching} />;
  }

  render() {
    const {
      hasBack,
      title,
      leftBtnImage,
      leftBtnPress,
      leftBtnText,
      rightBtnImage,
      rightBtnPress,
      rightBtnText,
      titleColor,
      hasBorder,
      style,
      hasSearch,
      onSearchText,
      isSearching,
      whiteBack,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          style,
          hasBorder ? styles.borderBottom : {},
          hasSearch ? styles.searchHeader : {},
        ]}>
        <View style={AppStyles.flexRow}>
          {this.renderLeft(
            leftBtnImage,
            leftBtnPress,
            leftBtnText,
            hasBack,
            whiteBack,
          )}
          {this.renderTitle(title, titleColor)}
          {this.renderRight(rightBtnImage, rightBtnPress, rightBtnText)}
        </View>

        {hasSearch && (
          <View style={AppStyles.centerInner}>
            {this.renderSearch(onSearchText, isSearching)}
          </View>
        )}
      </View>
    );
  }
}
