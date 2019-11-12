import React from 'react';
import axios from 'axios';
import {Grid} from 'semantic-ui-react';
export default class FileUpload extends React.Component {
    constructor(props){
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            profileImg: '',
            profileImgTab: [],
        }
    }

    onFileChange(e) {
        this.setState({ profileImg: e.target.files[0] });
        console.log("State: " + this.state.profileImg);
    }

    onSubmit = async(e) => {
        e.preventDefault();
        if (this.state.profileImg) {
            const fsize = this.state.profileImg.size;
            const file = Math.round((fsize / 1024));
            if (file >= 4096) {
                this.props.setWarnings(["File is too big. Max limit is 4Mb"]);
            }
            else {
                const formData = new FormData();
                formData.append('profileImg', this.state.profileImg);
                formData.append('id', localStorage.getItem('id'));
                const { data } = await axios.post("http://localhost:8800/user/user-profile", formData);
                if (data.profileImgTab) {
                    const tab = [];
                    tab.push(data.profileImgTab);
                    this.setState({profileImgTab: tab});
                    this.props.setImages(tab);
                }
                if (data.warnings)
                    this.props.setWarnings(data.warnings);
            }
        }
        this.setState({profileImg: ''});
    };

    render(){
        return (
            <div className="containerUpload">
                <Grid textAlign="center">
                        <form onSubmit={this.onSubmit}>
                            <Grid textAlign="center">
                                <Grid.Row>
                                    <input type="file" onChange={this.onFileChange}/><br />
                                </Grid.Row>
                                <Grid.Row>
                                    <button type="submit">Upload</button>
                                </Grid.Row>
                            </Grid>
                         </form>
                </Grid>
            </div>
        )
    }
}
