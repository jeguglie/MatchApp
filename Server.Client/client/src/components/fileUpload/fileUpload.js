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
            previewTab: [],
            file: ''
        };
    }

    handleImageChange(e) {
        // Preview of image
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            let tab = this.state.previewTab;
            tab.push(reader.result);
            this.setState({file: file, previewTab: tab},() => {
                this.props.showPreview(this.state.previewTab);
            });
        };
        reader.readAsDataURL(file);
        // Send preview tab to the Parent
        this.props.showPreview(this.state.previewTab);
    }

    onFileChange(e) {
        // Add file to queue in state
        let tab = this.state.imagesFiles;
        this.setState({ imagesFiles: tab.push(e.target.files[0])}, this.handleImageChange(e));
    }

    imagesFilesUpload = async (imagesFilesValue, key) => {
        this.props.handleImageUpload(key);
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
        this.props.handleImageUpload(-100);
    };
    onSubmit = () => {
        if (this.state.imagesFiles.length > 0) {
            this.state.imagesFiles.map((imagesFilesValue, key) => this.imagesFilesUpload(imagesFilesValue, key));
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
