import React from 'react';
import LoadImages from "./loadImages/loadImages";
import {Container, Divider, Grid} from "semantic-ui-react";
import DividerC from "../../../../Divider/Divider";

const LoadPreviewImages = (props) => {
    if (props.data.length > 0) {
        return (
            <div className="AddPhotosMinContainer">
                <Container textAlign="left">
                    <Divider hidden/>
                    <Divider />
                    <h1 className="titlePreviewAddPhotos">Profile images</h1><br/>
                </Container>
                <Grid columns={props.data.length} doubling>
                    <LoadImages deleteImage={props.deleteImage} data={props.data} />
                </Grid>
                <DividerC vertically={false}/>
            </div>
        );
    }
    else
        return null;
};

export default LoadPreviewImages;