import React from 'react';
import LoadPictures from "Src/components/EditProfil/AddPhotos/Preview/loadPreview/loadPictures/loadPictures";
import {Container, Divider, Grid, Divider} from "semantic-ui-react";

const LoadPreview = (props) => {
    if (props.data.length > 0) {
        return (
            <div className="AddPhotosMinContainer">
                <Container textAlign="left">
                    <Divider hidden/>
                    <Divider />
                    <h1 className="titlePreviewAddPhotos">Images preview</h1><br/>
                </Container>
                <Grid columns={props.data.length} stackable>
                    <LoadPictures
                        data={props.data}
                        imgNb={props.imgNb} />
                </Grid>
              <Divider hidden />
            </div>
        );
    }
    else
        return null;
};

export default LoadPreview;