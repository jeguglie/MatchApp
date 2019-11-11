import React from 'react';
import axios from 'axios';

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

    onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profileImg', this.state.profileImg);
        formData.append('id', localStorage.getItem('id'));
        axios.post("http://localhost:8800/user/user-profile", formData, {
            }).then(res => {
                const data = res.data.profileImgTab;
                console.log('data:' + res.data.profileImgTab);
                const tab = [];
                tab.push(data);
                this.setState({profileImgTab: tab});
                this.props.setImages(tab);
        })
    }

    render(){
        return (
            <div className="containerUpload">
                    <form onSubmit={this.onSubmit}>
                        <input type="file" onChange={this.onFileChange}/>
                        <button type="submit">Upload</button>
                    </form>
            </div>
        )
    }
}
