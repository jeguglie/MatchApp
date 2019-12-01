import React from 'react';
import classnames from "classnames";
import {Grid, Progress, Input, Icon, Divider} from "semantic-ui-react";
import ReactSearchBox from 'react-search-box';
const DEFAULT_STATE = {
    interests: []
};

const ProgressBar = () => (
    <Progress
        percent={70}
        className="ProgressBarProfile"
        indicating
        progress
        size="large"/>
);

const InputRightLabeledTag = (
    <Input
        icon='tags'
        iconPosition='left'
        label={{ tag: true, content: 'Add Tag' }}
        labelPosition='right'
        placeholder='Add interests'
    />
)

class AddInterests extends React.Component {
    constructor(props){
        super(props);
       this.state = DEFAULT_STATE;
    }

    componentDidMount() {

    }

    data = [
        {
            key: 'john',
            value: 'John Doe',
        },
        {
            key: 'jane',
            value: 'Jane Doe',
        },
        {
            key: 'mary',
            value: 'Mary Phillips',
        },
        {
            key: 'robert',
            value: 'Robert',
        },
        {
            key: 'karius',
            value: 'Karius',
        },
    ]
    render() {
        return(
            <div className="container-fluid">
                <div className={classnames("ui middle", "AddInterests")}>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Add interests</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <Grid  verticalAlign={"middle"}>
                    <Grid.Row centered>
                        <h1 className="InterestsTitle">Tell us what do you like</h1>
                    </Grid.Row>
                    <Grid.Row centered>
                        <ReactSearchBox
                            placeholder="Placeholder"
                            data={this.data}
                            callback={record => console.log(record)}
                        />
                    </Grid.Row>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <Grid>
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left outline'
                                  size="huge"
                                  onClick={this.props.prevSection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
                                  size="huge"
                                  onClick={this.props.nextSection}/>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
            )

    }
}

export default AddInterests;