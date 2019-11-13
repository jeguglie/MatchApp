import React from 'react';
import axios from 'axios';
import {Grid, Divider} from 'semantic-ui-react';
export default class FileUpload extends React.Component {
    constructor(props){
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            imagesFiles: [],
            imagePreviewUrl: [],
            file: ''
        };
    }

    handleImageChange(e) {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            let tab = this.state.imagePreviewUrl;
            tab.push(reader.result);
            this.setState({
                file: file,
                imagePreviewUrl: tab
            },() => {this.props.showPreview(this.state.imagePreviewUrl);});
        };
        reader.readAsDataURL(file);
        this.props.showPreview(this.state.imagePreviewUrl);
    }

    onFileChange(e) {
        let tab = this.state.imagesFiles;
        tab.push(e.target.files[0]);
        this.setState({ imagesFiles: tab}, this.handleImageChange(e));
    }

    imagesFilesUpload = async (imagesFilesValue) => {
        const file = Math.round((imagesFilesValue.size / 1024));
        if (file >= 4096)
            this.props.setWarnings(["File is too big. Max limit is 4Mb"]);
        else {
            const formData = new FormData();
            formData.append('imagesFiles', imagesFilesValue);
            formData.append('id', localStorage.getItem('id'));
            const {data} = await axios.post("http://localhost:8800/user/user-profile", formData);
            if (data.warnings)
                this.props.setWarnings(data.warnings);
        }
    };
    onSubmit = () => {
        if (this.state.imagesFiles.length > 0) {
            this.state.imagesFiles.map(imagesFilesValue => this.imagesFilesUpload(imagesFilesValue));
            this.setState({imagesFiles: []});
        }
    };

    render(){
        if (this.props.savePhotos === 1) {
            this.props.handleSaveFinished();
            this.onSubmit();
        }
        return (
            <div className="containerUpload">
                        <div className="file-upload">
                            <div className="image-upload-wrap">
                                 <input className="file-upload-input"
                                       type="file"
                                       onChange={this.onFileChange}
                                       accept="image/png, image/jpg, image/jpeg"
                                 /><br />
                                 <div className="drag-text">
                                     <h3>Drag and Drop <strong>or</strong> add file</h3>
                                 </div>
                            </div>
                        </div>
            </div>
        )
    }
}
