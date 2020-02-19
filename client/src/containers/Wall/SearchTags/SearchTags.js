import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import API from "Src/utils/API";

const DEFAULT_STATE = {
        isFetching: false,
        multiple: true,
        search: true,
        value: [],
        DATA: [],
};
class SearchTags extends Component {
    constructor(props){
        super(props);
        this.state = {
            isFetching: false,
            multiple: true,
            search: true,
            value: [],
            DATA: [],
        };
        this._mounted = false;
    }
    componentDidMount = async() => {
        this._mounted = true;
        this._mounted && this.setState({loading: true, interests: []});
        await API.getInterests()
            .then(response => {
                this._mounted && this.setState({DATA: response.data.results.map((obj, i) => {
                        return { key: i, text: obj.title, value: obj.title }
                    })});
            });
    };
    componentWillUnmount() {
        this._mounted && this.setState({...DEFAULT_STATE});
        this._mounted = false;
    }

    handleChange = (e, { value }) => {
            this._mounted && this.setState({value}, () => {
                if (this.state.value && this.state.value.length < 1)
                    this.props.activeCheckBox();
                else
                    this.props.disableCheckBox();
            });
    };

    clearValue(){
        if (this._mounted && this.state.value && this.state.value.length > 0) {
            this._mounted && this.setState({value: []});
        }
    }

    render() {
        const { multiple, DATA, search, value } = this.state;

        return (
            <div className={'SearchTags'}>
                <Dropdown
                    id={'dropdownSearchTags'}
                    fluid
                    selection
                    multiple={multiple}
                    search={search}
                    options={DATA}
                    value={value}
                    placeholder='Add tags'
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default SearchTags;
