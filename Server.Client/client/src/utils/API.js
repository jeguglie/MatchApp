import axios from "axios";
const headers = {
    "Content-Type": "application/json"
};
const burl = "http://localhost:8800";

export default {
    login: function(email, password) {
        return axios.post(
            `${burl}/user/login`,
            {
                email,
                password
            },
            {
                headers: headers
            }
        );
    },
    signup: function(lastName, firstName, email, username, password, cpassword) {
        return axios.post(
            `${ burl}/user/signup`,
            {lastName, firstName, email, username, password, cpassword},
            {
                headers: headers
            }
        );
    },

    logout: function() {
        localStorage.clear();
    },
    updateEditProfilValues: function(state) {
        return axios.post(
            `${burl}/user/updateEditProfilValues`,
            {
                state
            },
            {
                headers: headers
            }
        );
    },
    getEditProfilValues: function(user_id) {
        return axios.post(
            `${burl}/user/getEditProfilValues`,
            {
                user_id,
            },
            {
                headers: headers
            }
        );
    },
    getPhotos: function(user_id) {
        return axios.post(
            `${burl}/user/getPhotos`,
            {
                user_id,
            },
            {
                headers: headers
            }
        );
    }

};