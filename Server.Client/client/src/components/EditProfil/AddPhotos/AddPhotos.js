import React from 'react';
import {Grid, Progress, Image, Icon,} from 'semantic-ui-react';
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
import FileUpload from "../../fileUpload/fileUpload";

const DEFAULT_STATE = {
    profileImg: [],
    multerImage: "",
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
        this.state = ({...DEFAULT_STATE});
        this.state.multerImage = "https://react.semantic-ui.com/images/wireframe/white-image.png";
    }

    updateImages = () => {
        console.log(this.state);
        this.setState({multerImage: "http://localhost:8800/" + this.state.profileImg[0][0]});
    };

    setImages = (tab) => {
        this.setState({profileImg: tab});
        this.updateImages();
    };
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
                            {/*<Icon size='big' circular inverted name='facebook'/>*/}
                            {/*<Icon size='big' circular inverted name='instagram'/>*/}
                        </Grid.Row>
                        <Grid.Row>
                                <Image className="ShadowImage"
                                       centered
                                       src={this.state.multerImage}
                                       size='medium'
                                       circular bordered
                                />
                        </Grid.Row>
                        <FileUpload setImages={this.setImages}/>
                    </Grid>
                    <DividerC vertically={false}/>
                    <DividerC vertically={false}/>
                    <Grid>
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left outline'
                                  size="huge"
                                  onClick={this.props.prevSection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
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