import React from 'react';
import {Label, Divider} from 'semantic-ui-react';
const DEFAULT_STATE =  {
  interests: [],
};


class Interests extends React.Component {
    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    render(){
        const {interests} = this.props;
        return (
            <div className="ui middle InterestsContainer">
                <Label.Group size='huge'>
                    {interests.map((data, i) => {
                        return (
                            <Label className="interestLabel"
                                   id={i}
                                   key={i}
                                   data={data}
                                   onClick={() => this.props.deleteInterest({data, i})}><strong>#</strong>{data}</Label>
                        )
                    })}
                    <Divider hidden />
                </Label.Group>
            </div>
        )
    }
}

export default Interests;
