import axios from "axios";
const headers = {
    "Content-Type": "application/json"
};
const burl = "http://localhost:3000";

export default {
    login: function(email, password) {
        return axios.post(
            `${burl}/login`,
            {
                email,
                password
            },
            {
                headers: headers
            }
        );
    },
    signup: function(lastname, firstname, email, username, password, cpassword) {
        return axios.post(
            `${ burl}/signup`,
            {lastname, firstname, email, username, password, cpassword},
            {
                headers: headers
            }
        );
    },
    updateEditProfilValues: function(state) {
        return axios.post(
            `${burl}/updateEditProfilValues`,
            {
                state
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    getEditProfilValues: function(user_id) {
        return axios.post(
            `${burl}/getEditProfilValues`,
            {
                user_id,
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    getPhotos: function() {
        return axios.post(
            `${burl}/getPhotos`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    addInterests: function(interest){
        return axios.post(
            `${burl}/addInterests`,
            {interest},
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    getInterests: () => {
        return axios.post(
            `${burl}/getInterests`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    getUserInterests: () => {
        return axios.post(
            `${burl}/getUserInterests`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    }
};