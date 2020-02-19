import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import styled, { createGlobalStyle } from 'styled-components'
import InputBox from '/components/input-box/index';
import DropDown from '/components/drop-down/index';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default class ReactSearchBox extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        data: PropTypes.array.isRequired,
        fuseConfigs: PropTypes.object,
        autoFocus: PropTypes.bool,
        onSelect: PropTypes.func,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        inputBoxFontColor: PropTypes.string,
        inputBoxBorderColor: PropTypes.string,
        inputBoxFontSize: PropTypes.string,
        inputBoxHeight: PropTypes.string,
        dropDownHoverColor: PropTypes.string,
        dropDownBorderColor: PropTypes.string,
    };

    static defaultProps = {
        data: [],
        autoFocus: false,
        placeholder: '',
        inputBoxFontColor: '#000',
        inputBoxBorderColor: '#cacaca96',
        inputBoxFontSize: '14px',
        inputBoxHeight: '40px',
        dropDownHoverColor: '#ccc',
        dropDownBorderColor: '#cacaca96',
    };

    state = {
        value: this.props.value ? this.props.value : '',
        matchedRecords: [],
        cursor: 0,
        keyEnterClick: false,
    };

    constructor(props) {
        super(props);

        const { data, fuseConfigs } = props;

        this.defaultFuseConfigs = {
            threshold: 0.05,
            location: 0,
            distance: 100,
            minMatchCharLength: 1,
            keys: ['value'],
        };
        const configs = Object.assign({}, this.defaultFuseConfigs, fuseConfigs);

        this.fuse = new Fuse(data, configs);
    }

    componentDidUpdate(prevProps) {
        const { data, fuseConfigs } = this.props;

        if (prevProps.data !== data) {
            const configs = Object.assign({}, this.defaultFuseConfigs, fuseConfigs);
            this.fuse = new Fuse(data, configs)
        }
    }

    handleInputChange = e => {
        const { onChange } = this.props;
        const { value } = e.target;
        const matchedRecords = this.fuse.search(value);
        this.setState({
            value,
            matchedRecords,
            showDropdown: true,
            cursor: 0
        });
        !!onChange && onChange(value)
    };

    handleKeyDown = (e) => {
        const { cursor, matchedRecords, keyEnterClick } = this.state;
        // arrow up/down button should select next/previous list element
        if (e.key === 'Enter') {
            this.setState({keyEnterClick: true});
        }
        if (e.keyCode === 38 && cursor > 0) {
            this.setState( prevState => ({
                cursor: prevState.cursor - 1
            }))
        } else if (e.keyCode === 40 && cursor < matchedRecords.length - 1) {
            this.setState( prevState => ({
                cursor: prevState.cursor + 1
            }))
        }
    }

    handleClear = () => {
        this.setState({value: ''});
        this.props.resetClear();
    };

    inputNode = () => {
        const {
            placeholder,
            onFocus,
            autoFocus,
            inputBoxFontColor,
            inputBoxBorderColor,
            inputBoxFontSize,
            inputBoxHeight,
            clear,
        } = this.props;
        const { value } = this.state;
        if (clear === true)
            this.handleClear();
        return (
            <InputBox
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={this.handleInputChange}
                autoFocus={autoFocus ? autoFocus : undefined}
                onFocus={onFocus ? onFocus : undefined}
                inputBoxFontColor={inputBoxFontColor}
                inputBoxBorderColor={inputBoxBorderColor}
                inputBoxFontSize={inputBoxFontSize}
                inputBoxHeight={inputBoxHeight}
                onKeyDown={ this.handleKeyDown }
            />
        )
    }

    handleDropdownItemClick = record => {
        const { value } = record;
        const { onSelect, onChange, addData } = this.props;

        this.setState({
            keyEnterClick: false,
            value,
            // Hide the dropdown once any dropdown item is clicked.
            showDropdown: false,
        });
        // Trigger the 'onSelect' prop once everything is done if it's passed.
        !!onSelect && onSelect(record);
        // Trigger the 'onChange' prop since the value of the input box also changes.
        !!onChange && onChange(value);
        addData(record);

    };

    dropdownNode = () => {
        const { matchedRecords, showDropdown } = this.state;
        const { dropDownHoverColor, dropDownBorderColor } = this.props;

        if (!showDropdown) return false;

        return (
            <DropDown
                matchedRecords={matchedRecords}
                onClick={this.handleDropdownItemClick}
                keyEnterClick={this.state.keyEnterClick}
                EnterPress={this.handleDropdownItemClick}
                dropDownHoverColor={dropDownHoverColor}
                dropDownBorderColor={dropDownBorderColor}
                cursor={this.state.cursor}
            />
        )
    };

    render() {
        return (
            <StyledContainer>
                <GlobalStyle />
                {this.inputNode()}
                {this.dropdownNode()}
            </StyledContainer>
        )
    }
}