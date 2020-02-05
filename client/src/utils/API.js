import axios from "axios";
const headers = {
    "Content-Type": "application/json"
};
const burl = "http://localhost:5000";

export default {
    reportuser: function(user_id_reported){
        return axios.post(
            `${burl}/reportuser`,
            {
                user_id_reported
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    deletenotif: function(id_notif){
        return axios.post(
            `${burl}/deletenotif`,
            {
                id_notif
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    reportuserhide: function(user_id_reported){
        return axios.post(
            `${burl}/reportuserhide`,
            {
                user_id_reported
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    reportuserfake: function(user_id_reported){
        return axios.post(
            `${burl}/reportuserfake`,
            {
                user_id_reported
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    updategeolocate: function(latitude, longitude){
        return axios.post(
            `${burl}/updategeolocate`,
            {
                latitude, longitude
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    changemyemail: function(email, emailconfirm){
        return axios.post(
            `${burl}/changemyemail`,
            {
                email, emailconfirm
            },
            {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    activeaccount: function(token){
        return axios.post(
            `${burl}/activeaccount`,
            {
                token
            },
        );
    },
    changepassword: function(token, password, passwordconfirm){
        return axios.post(
            `${burl}/changepassword`,
            {
                token, password, passwordconfirm
            },
        {
                withCredentials: 'true',
                headers: headers
            }
        );
    },
    userforgot: function(email) {
        return axios.post(
            `${burl}/userforgot`,
            {
                email,
            },
        );
    },
    login: function(email, password) {
        return axios.post(
            `${burl}/login`,
            {
                email,
                password
            },
            {
                withCredentials: 'true',
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
    },
    getComplete: () => {
        return axios.post(
            `${burl}/getComplete`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    withAuth: () => {
        return axios.get(
            `${burl}/checkToken`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    deleteInterest: (data) => {
        return axios.post(
            `${burl}/deleteInterest`,
            {data},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    deleteImage: (imgID) => {
        return axios.post(
            `${burl}/deleteImage`,
            {imgID},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getUsers: (distanceRange, ageRange, popularityRange) => {
        return axios.post(
            `${burl}/getUsers`,
            {distanceRange, ageRange, popularityRange},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getConnectedUserLocation: () => {
        return axios.post(
            `${burl}/getConnectedUserLocation`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    checkUserView: () => {
        return axios.post(
            `${burl}/checkUserView`,
            {},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getUserIdProfile: (userId) => {
        return axios.post(
            `${burl}/getUserIdProfile`,
            {userId},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    userLike: (userLikedID) => {
        return axios.post(
            `${burl}/userLike`,
            {userLikedID},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getNotifications: () => {
        return axios.get(
            `${burl}/getNotifications`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getNotifNb: () => {
        return axios.get(
            `${burl}/getNotifNb`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    logout: () => {
        return axios.get(
            `${burl}/logout`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    }
};