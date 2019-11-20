import React from 'react';
import LoadPictures from "./loadPictures/loadPictures";
import {Container, Divider, Grid} from "semantic-ui-react";
import DividerC from "../../../../Divider/Divider";

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
                <DividerC vertically={false}/>
            </div>
        );
    }
    else
        return null;
};

export default LoadPreview;