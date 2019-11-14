import React from 'react';
import {Grid, Progress, Image, Divider, Icon} from 'semantic-ui-react';
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
import FileUpload from "../../fileUpload/fileUpload";
import Warnings from '../../../components/Warnings/Warnings';
import loadPreview from '../../../components/EditProfil/AddPhotos/loadPreview/loadPreview';
import API from "../../../utils/API";

const DEFAULT_STATE = {
    profileImg: [],
    coverImage: "",
    previewTab: [],
    currentImageUpload: '',
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
    },
    warnings: [],
    savePhotos: 0,
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
        this.state.coverImage = "https://react.semantic-ui.com/images/wireframe/white-image.png";
    }

    async componentDidMount() {
        try {
            const { data } = await API.getPhotos(localStorage.getItem('id'));
            if (data.profileImg)
                this.setState({profileImg: data.profileImg}, () => {
                    this.updateImages();
                });
        } catch(error){
            console.log(error);
        }
    }
    setWarnings = (data) => this.setState({warnings: data});

    // Load preview tab for loadPreview Component
    showPreview = (previewTab) => this.setState({previewTab: previewTab});

    updateImages = () => this.setState({coverImage: "http://localhost:8800/" +
            this.state.profileImg[0]});
    handleSave = () => this.setState({savePhotos: 1});
    handleSaveFinished = () => this.setState({savePhotos: 0});
    handleImageUpload = (imageNumber) => {
        if (imageNumber == -100)
            this.setState({currentImageUpload: -100, activeLoader: false});
        else
            this.setState({currentImageUpload: imageNumber, activeLoader: true});
    };


    render() {
        const warningsPhotos = () => {
            if (this.state.warnings.length > 0){
                return (
                    <div className="WarningsAddPhotos">
                        <Warnings data={this.state.warnings}/>
                    </div>
                );
            }
            else
                return null
        };
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
                    <DividerC vertically={false}/>
                    <Grid verticalAlign='middle' columns={2} doubling textAlign="center">
                        <Grid.Column>
                            <FileUpload
                                handleSaveFinished={this.handleSaveFinished}
                                savePhotos={this.state.savePhotos}
                                showPreview={this.showPreview}
                                setWarnings={this.setWarnings}
                                handleImageUpload={this.handleImageUpload}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Image className="ShadowImage"
                                   src={this.state.coverImage}
                                   size='medium'
                                   centered
                                   rounded bordered
                            />
                        </Grid.Column>
                    </Grid>
                    <DividerC vertically={false}/>
                    <DividerC vertically={false}/>
                    <Grid textAlign="left">
                       {warningsPhotos}
                        <loadPreview
                            data={this.state.previewTab}
                            currentImageUpload={this.state.currentImageUpload}
                            imageNumber={this.state.currentImageUpload}
                            activeLoader={this.state.activeLoader} />
                    </Grid>
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