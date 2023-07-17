import React from 'react';
import PropTypes from 'prop-types';
import TourView from './TourView';
import {connect} from 'react-redux';
import {tours} from '../../constants';
import {setFirstTime} from '../../actions/GeneralActions';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import util from '../../util';
import {changeBase} from '../../config/WebService';
class TourController extends React.Component {
  constructor() {
    super();
    this.state = {currentPage: 0, lastPage: 0};
  }
  static propTypes = {};
  static defaultProps = {};
  scrollEnd = (currentPage, lastPage) => {
    this.setState({currentPage, lastPage});
  };
  buttonClick = async () => {
    if (this.state.currentPage < tours.length - 1) {
      this.swiper.scrollBy(1);
    } else {
      try {
        await AsyncStorage.setItem('firstTime', 'no');
      } catch (e) {
        // saving error
      }
      util.resetGenericPassword();
      this.props.setFirstTime();
      Actions.login();

      // this.props.setFirstTime();
      // Actions.reset('tabbar');
    }
  };
  render() {
    return (
      <TourView
        {...this.props}
        buttonClick={this.buttonClick}
        swiperRef={ref => (this.swiper = ref)}
        scrollEnd={this.scrollEnd}
        currentPage={this.state.currentPage}
      />
    );
  }
}
const mapStateToProps = ({}) => ({});
const actions = {setFirstTime};
export default connect(
  mapStateToProps,
  actions,
)(TourController);
