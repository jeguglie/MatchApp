import React from 'react';
import {Grid, Progress, Image, Divider, Icon, Container, Dimmer, Loader} from 'semantic-ui-react';
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
import FileUpload from "../../fileUpload/fileUpload";
import Warnings from '../../../components/Warnings/Warnings';
import UploadPreview from '../../../components/EditProfil/AddPhotos/Preview/loadPreview/loadPreview';
import ProfileImgPreview from '../../../components/EditProfil/AddPhotos/Preview/loadCurrentPictures/loadPreviewImages';
import API from "../../../utils/API";
import VALIDATE from "../../../utils/validation";

const DEFAULT_STATE = {
    profileImg: [],
    coverImage: "",
    previewTab: [],
    warnings: [],
    loading: false,
};


class AddPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({...DEFAULT_STATE});
        this.state.coverImage = "https://react.semantic-ui.com/images/wireframe/white-image.png";
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }
    async componentDidMount() {
        this.setState({loading: true});
        this.props.getcomplete();
        await VALIDATE.sleepLoader(400).then(async()=>{
            await API.getPhotos()
                .then(response => {
                    if (response.data.profileImg.length > 0)
                        this.setState({profileImg: response.data.profileImg}, () => {
                            this.updateImages();
                        });
                })
        });
        this.setState({loading: false});
    }

    componentWillUnmount() {
        this.setState({...DEFAULT_STATE});
    }

    // Warnings for errors during upload or file
    setWarnings = (data) => this.setState({warnings: data});
    // Load preview tab for loadPreview Component
    showPreview = (previewTab) => this.setState({previewTab: previewTab});
    // Update Top image preview
    updateImages = () => this.setState({coverImage: "http://localhost:3000/" + this.state.profileImg[0].img_link});
    async handleImageUpload () {
        try {
            const { data } = await API.getPhotos();
            if (data.profileImg.length > 0)
                this.setState({profileImg: data.profileImg}, () => {
                    this.updateImages();
                });
        } catch(error){
            console.log(error);
        }
    };
    render() {
        const ProgressBar = () => (
            <Progress
                percent={this.props.complete}
                className="ProgressBarProfile"
                indicating
                progress
                size="large"/>
        );
        return (
            <div className="container-fluid">
                <div className={classnames("ui middle", "AddPhotos")}>
                    <Dimmer active={this.state.loading}>
                        <Loader size='massive'>Get photos...</Loader>
                    </Dimmer>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Add photos</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <DividerC vertically={false}/>
                    <Grid columns={2} doubling textAlign="center">
                        <Grid.Column>
                            <Image className="ShadowImage"
                                   src={this.state.coverImage}
                                   size='medium'
                                   centered
                                   rounded bordered />
                        </Grid.Column>
                        <Grid.Column>
                            <Grid.Row centered>
                            <FileUpload
                                handleSaveFinished={this.handleSaveFinished}
                                savePhotos={this.state.savePhotos}
                                showPreview={this.showPreview}
                                setWarnings={this.setWarnings}
                                handleImageUpload={this.handleImageUpload} />
                            </Grid.Row>
                                <Container fluid textAlign="center">
                                    <div className="loginWarnings WarningsUpload">
                                        <Warnings data={this.state.warnings}/>
                                    </div>
                                </Container>
                            <ProfileImgPreview  data={this.state.profileImg}/>
                        </Grid.Column>
                    </Grid>
                        <UploadPreview data={this.state.previewTab} />
                        <Grid>
                            <Divider hidden />
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left outline'
                                  size="huge"
                                  onClick={this.props.prevsection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
                                  size="huge"
                                  onClick={this.props.nextsection}/>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}
export default AddPhotos;