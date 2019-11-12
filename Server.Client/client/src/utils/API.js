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
    signup: function(email, password, cpassword) {
        return axios.post(
            `${ burl}/user/signup`,
            {email, password, cpassword},
            {
                headers: headers
            }
        );
    },

    isAuth: function() {
        return localStorage.getItem("token") !== null;
    },
    logout: function() {
        localStorage.clear();
    },
    checkMail: function(email) {
        return axios.post(
            `${burl}/user/checkMail`,
            {
                email,
            },
            {
                headers: headers
            }
        );
    },
    updateEditProfilValues: function(state, id) {
        return axios.post(
            `${burl}/user/updateEditProfilValues`,
            {
                state,
                id
            },
            {
                headers: headers
            }
        );
    },
    getEditProfilValues: function(id) {
        return axios.post(
            `${burl}/user/getEditProfilValues`,
            {
                id,
            },
            {
                headers: headers
            }
        );
    },
    getPhotos: function(id) {
        return axios.post(
            `${burl}/user/getPhotos`,
            {
                id,
            },
            {
                headers: headers
            }
        );
    }

};