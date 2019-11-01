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
        return axios.post(`${ burl}/user/signup`, {email, password, cpassword}, { headers: headers });
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
    updateEditProfilValues: function(state) {
        return axios.post(
            `${burl}/user/updateProfil`,
            {
                state,
            },
            {
                headers: headers
            }
        );
    },
    getEditProfilValues: function(email) {
        return axios.post(
            `${burl}/user/getProfilValues`,
            {
                email,
            },
            {
                headers: headers
            }
        );
    }
};