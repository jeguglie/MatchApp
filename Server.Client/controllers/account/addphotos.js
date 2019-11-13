const Profil = require('../../schema/schemaProfil');

async function uploadPhoto(req, res) {
    try {
        const id = req.body.id;
        const profileImgTab = [];
        const addPathImg = req.file.path;
        const fsize = req.file.size;
        const file = Math.round((fsize / 1024));
        if (file >= 4096) {
            return res.status(200).json({
                warnings: ["File is too big. Max limit is 4Mb"]
            })
        }
         await Profil.findOne({_id: id}, function(err, out) {
            if (err)
                return res.status(500).json({
                    warnings: ["Error find Profile"]
                });
            const profileImgTab = out.profileImg;
            if (profileImgTab.length + 1 > 5){
                return res.status(200).json({
                    warnings: ["Number limit of images is 5"]
                })
            }
            profileImgTab.push(addPathImg);
            out.profilImg = profileImgTab;
            out.save(function (err) {
                if (err) {
                    return res.status(200).json({
                        warnings: ["Error during save"]
                    });
                }
                return res.status(200).json({
                    warnings: ["Image successfully uploaded"],
                    save: true
                })
            });
        });
    } catch (error) {
        return res.status(200).json({
            warnings: ["Error during file upload"]
        });
    }
}

async function getPhotos(req, res) {
    try {
        const findProfil = await Profil.findById(req.body.id, function(err, out) {
            if (err) {
                return res.status(500).json({
                    warnings: ["Not Found"]
                });
            }
            else {
                if (out.profileImg.length < 1){
                    return res.status(200).json({
                        warnings: ["Zero images"]
                    });
                }
                return res.status(200).json({
                    profileImg: out.profileImg
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            warnings: ["Error"]
        });
    }
}

exports.uploadPhoto = uploadPhoto;
exports.getPhotos = getPhotos;