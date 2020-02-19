import React from 'react';
import InputRange from 'react-input-range';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceRange: { min: 2, max: 10 },
        };
    }

    // Filter
    handleChange = async(value, id) => {
        if (id === "distanceRange")
            this._mounted && this.setState({distanceRange: value});
        else if (id === "ageRange")
            this._mounted && this.setState({ageRange: value});
        else if (id === "popularityRange")
            this._mounted && this.setState({popularityRange: value});
    };
    render() {
        return (
            <InputRange
                maxValue={20}
                minValue={0}
                value={this.state.value}
                onChange={value => this.setState({ value })} />
        );
    }
}
