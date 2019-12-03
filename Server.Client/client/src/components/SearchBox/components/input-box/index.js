import React, { Component } from 'react'
import PropTypes from 'prop-types'

import StyledInput from './styled-component'

class InputBox extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        inputBoxFontColor: PropTypes.string,
        inputBoxBorderColor: PropTypes.string,
        inputBoxFontSize: PropTypes.string,
        inputBoxHeight: PropTypes.string,
    };

    componentDidMount() {
        const { autoFocus } = this.props;
        !!autoFocus && this.input.focus()
    }

    render() {
        const {
            placeholder,
            value,
            onChange,
            onFocus,
            inputBoxFontColor,
            inputBoxBorderColor,
            inputBoxFontSize,
            inputBoxHeight,
        } = this.props;

        return (
            <StyledInput
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                ref={input => {
                    this.input = input
                }}
                onKeyDown={this.props.onKeyDown}
                inputBoxFontColor={inputBoxFontColor}
                inputBoxBorderColor={inputBoxBorderColor}
                inputBoxFontSize={inputBoxFontSize}
                inputBoxHeight={inputBoxHeight}
            />
        )
    }
}

export default InputBox