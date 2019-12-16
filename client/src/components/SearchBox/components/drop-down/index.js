import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from "classnames"

import StyledDropDown from './styled-component'

class DropDown extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        matchedRecords: PropTypes.array,
        dropDownHoverColor: PropTypes.string,
        dropDownBorderColor: PropTypes.string,
    }

    static defaultProps = {
        matchedRecords: [],
    }
    render() {
        const {
            matchedRecords,
            dropDownHoverColor,
            dropDownBorderColor,
            onClick,
            EnterPress
        } = this.props

        return (
            <StyledDropDown
                className="react-search-box-dropdown"
                dropDownHoverColor={dropDownHoverColor}
                dropDownBorderColor={dropDownBorderColor}>
                <ul>
                    {matchedRecords.map((record, i) => {
                        return (
                            <li
                                key={record.key}
                                className={classnames("react-search-box-dropdown-list-item", this.props.cursor == i ? "dropdown-active" : null)}
                                onClick={() => onClick(record)}
                                EnterPress={this.props.cursor === i && this.props.keyEnterClick === true ?  EnterPress(record) : null}
                            >
                                {record.value}
                            </li>
                        )
                    })}
                </ul>
            </StyledDropDown>
        )
    }
}

export default DropDown