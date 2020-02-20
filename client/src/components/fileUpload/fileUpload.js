import React from 'react';
import axios from 'axios';
export default class FileUpload extends React.Component {
    constructor(props){
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            file: ''
        };
    }

    onFileChange(e) {
        // Add file to queue in state
        this.setState({file: e.target.files[0]}, this.onSubmit);
    }

    imagesFilesUpload = async (file) => {
        const fileSize = Math.round((file.size / 1024));
        if (fileSize >= 4096)
            this.props.setWarnings(["File is too big. Max limit is 4Mb"]);
        else {
            const formData = new FormData();
            formData.append('file', file);
            const {data} = await axios.post(process.env.SERVER_LOCALHOST === JSON.stringify(false) ? "https://matchappli.herokuapp.com/api/user-profile" : "http://localhost:5000/api/user-profile", formData, {withCredentials: 'true'});
            if (data.warnings)
                this.props.setWarnings(data.warnings);
        }
        this.props.handleImageUpload();
    };
    onSubmit = () => {
        if (this.state.file != null) {
            this.imagesFilesUpload(this.state.file);
            this.setState({file: ''});
        }
    };

    simulateClick = (e) => {
        e.click()
    }


    render(){
        return (
            <div className="containerUpload">
                <div className="file-upload">
                    <div className="image-upload-wrap">
                         <input
                               className="file-upload-input"
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
