import React from 'react';
import {Grid, Progress, Image, Icon,} from 'semantic-ui-react';
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
const DEFAULT_STATE = {
    email: "",
    firstName: "",
    lastName: "",
    interested: "",
    bio: "",
    gender: "",
    interests: [],
    country: "",
    birthday: "",
    messages : {
        save: false,
        warnings: []
    },
    complete : 0
};

const ProgressBar = () => (
    <Progress
        percent={70}
        className="ProgressBarProfile"
        indicating
        progress
        size="large"/>
);
class AddPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
    }
    render() {
        return (
            <div className="container-fluid">
                <div className={classnames("ui middle", "AddPhotos")}>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Add photos</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <Grid textAlign="center">
                        <Grid.Row className="EditProfilIcons ShadowIcon">
                            <Icon size='big' circular inverted name='facebook'/>
                            <Icon size='big' circular inverted name='instagram'/>
                            <Icon size='big' circular inverted name='upload'/>
                        </Grid.Row>
                        <Grid.Row>
                            <Image className="ShadowImage"
                                   centered
                                   src='https://react.semantic-ui.com/images/wireframe/white-image.png'
                                   size='medium'
                                   circular bordered/>
                        </Grid.Row>
                    </Grid>
                    <DividerC />
                    <DividerC />
                    <Grid>
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left'
                                  size="huge"
                                  onClick={this.props.prevSection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right'
                                  size="huge"
                                  onClick={this.handleSave}/>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}
export default AddPhotos;