import React from 'react';
import {Grid, Progress, Image, Divider, Icon, Container, Dimmer, Loader} from 'semantic-ui-react';
import FileUpload from "Src/components/fileUpload/fileUpload";
import Warnings from 'Src/components/Warnings/Warnings';
import ProfileImgPreview from 'Src/components/EditProfil/AddPhotos/Preview/loadCurrentPictures/loadPreviewImages';
import API from "Src/utils/API";

const DEFAULT_STATE = {
    profileImg: [],
    coverImage: "",
    previewTab: [],
    warnings: [],
    loading: false,
    complete: 0,
};


class AddPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({...DEFAULT_STATE});
        this.state.complete = this.props.complete;
        this.state.coverImage = "https://react.semantic-ui.com/images/wireframe/white-image.png";
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        this._mounted = true;
        this._mounted && this.setState({loading: true});
        await API.getPhotos()
            .then(response => {
                if (response.data.profileImg.length > 0)
                    this._mounted && this.setState({profileImg: response.data.profileImg}, () => {
                        this.updateImages();
                    });
            });
        this.setState({loading: false});
    }

    componentWillUnmount() {
        this._mounted = false;
        this.setState({...DEFAULT_STATE});
    }

    componentDidUpdate = async(props, state) =>{
        if (props.complete !== state.complete)
            this._mounted && this.setState({complete: props.complete})
    };


    // Warnings for errors during upload or file
    setWarnings = (data) => this.setState({warnings: data});
    // Load preview tab for loadPreview Component
    showPreview = (previewTab) => this.setState({previewTab: previewTab});
    // Update Top image preview
    updateImages = () => {
        if(this.state.profileImg.length > 0)
            this.setState({coverImage: this.state.profileImg[0].img_link});
        else
            this.setState({coverImage : "https://react.semantic-ui.com/images/wireframe/white-image.png"});

    }
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
    removeElement = (array, index) => {
        if (index > -1)
            array.splice(index, 1);
        return array;
    };

    prevSection = () => {
        this._mounted && this.setState({loading: true});
        this.props.prevsection();
    };

    nextSection = () => {
        this._mounted && this.setState({loading: true});
        this.props.nextsection();
    };

    deleteImage = async(data, key) => {
        let imgID = data;
        let {profileImg} = this.state;
        profileImg.map((img_data, index) => {
            if(img_data.img_id === imgID)
                return this.removeElement(profileImg, index)
            return null;
        });
        this.setState({profileImg: profileImg});
        this.updateImages();
        await API.deleteImage(imgID)
            .then(response => {
                if (response.status === 200)
                    if (this._mounted) {
                        this.setState({warnings: response.data.warnings});
                        this.removeElement(this.state.profileImg, key);
                    }
            })
            .catch(error => {
                if (this._mounted)
                    this.setState({warnings: error.response.data.warnings});
            })
    }
    render() {
        const { nextSection, prevSection } = this;
        const ProgressBar = () => (
            <Progress
                percent={this.state.complete}
                progress
                indicating
                size="medium"/>
        );
        return (
            <div className="AddPhotos">
                <ProgressBar />
                <Dimmer active={this.state.loading}>
                    <Loader size='massive' />
                </Dimmer>
                <Grid textAlign="center">
                    <Grid.Row centered>
                        <h1 className="CompleteTitle">Add photos</h1>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <Divider hidden />
                <div className="shapeAddPhotos"></div>
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
                        <ProfileImgPreview
                            data={this.state.profileImg}
                            deleteImage={this.deleteImage}/>
                    </Grid.Column>
                </Grid>
                    <Grid>
                        <Divider hidden />
                        <Divider hidden />
                    <Grid.Row centered>
                        <Icon className="EditProfilArrow"
                              name='arrow circle left'
                              size="huge"
                              onClick={prevSection}/>
                        <Icon className="EditProfilArrow"
                              name='arrow circle right'
                              size="huge"
                              onClick={nextSection}/>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
export default AddPhotos;