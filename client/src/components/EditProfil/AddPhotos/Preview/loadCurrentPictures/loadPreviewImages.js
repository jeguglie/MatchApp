import React from 'react';
import LoadImages from "Src/components/EditProfil/AddPhotos/Preview/loadCurrentPictures/loadImages/loadImages";
import {Container, Divider, Grid} from "semantic-ui-react";

const LoadPreviewImages = (props) => {
    if (props.data.length > 0) {
        return (
            <div className="AddPhotosMinContainer">
                <Container textAlign="left">
                    <Divider hidden/>
                    <Divider />
                    <h1 className="titlePreviewAddPhotos">Profile images</h1><br/>
                    <Grid columns={props.data.length} doubling>
                        <LoadImages data={props.data} deleteImage={props.deleteImage} />
                    </Grid>
                </Container>
            </div>
        );
    }
    else
        return null;
};

export default LoadPreviewImages;