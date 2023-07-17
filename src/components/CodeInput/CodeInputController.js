import React from 'react';
import PropTypes from 'prop-types';
import CodeInputView from './CodeInputView';

export default class CodeInputController extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    resendText: PropTypes.string,
    hideResend: PropTypes.bool,
    onResend: PropTypes.func,
    codeSubmit: PropTypes.func,
    codeLength: PropTypes.number,
  };
  static defaultProps = {
    title: 'Enter code',
    hideResend: false,
    onResend: () => {},
    codeSubmit: code => {},
    codeLength: 5,
  };
  render() {
    return <CodeInputView {...this.props} />;
  }
}
