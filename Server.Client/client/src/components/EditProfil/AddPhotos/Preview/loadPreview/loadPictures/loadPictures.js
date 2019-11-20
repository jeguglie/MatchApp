import React from 'react';
import {Grid, Image, Loader} from "semantic-ui-react";

const LoaderMin = (props) => {
    if (props.imgNb === props.currentNb)
        return <Loader inverted size='medium' active />;
    else return null;
};

const LoadPictures = (props) => {
    if (Array.isArray(props.data) && props.data.length > 0) {
        return props.data.map((base64, key) => {
            return (
                <Grid.Column>
                    <LoaderMin
                        imgNb={props.imgNb}
                        currentNb={key}
                    />
                    <Image
                        label={{ as: 'a', corner: 'right', icon: 'close' }}
                        className="AddPhotosImgPreview"
                        src={base64}
                        fluid
                    />
                </Grid.Column>
            )
        });
    }
    else {
        return null
    }
};

export default LoadPictures;