import React from 'react';
import {Grid, Image, Loader} from "semantic-ui-react";

const LoaderMin = (props) => {
    if (props.activeLoader === true && props.imageNumber === props.currentNumber)
        return (
            <Loader inverted size='medium' active />
        );
    else
        return null;
};

const loadPictures = (props) => {
    if (Array.isArray(props.data) && props.data.length > 0)
        return props.data.map((item, key) => {
            const srcImg = item.length > 200 ? item : "http://localhost:8800/".concat(item);
            return (
                <Grid.Column>
                    <LoaderMin
                        activeLoader={ props.activeLoader }
                        imageNumber={ props.imageNumber }
                        currentNumber={ key }
                    />
                    <Image
                        className="AddPhotosImgPreview"
                        src={ srcImg }
                        rounded
                        centered
                    />
                </Grid.Column>
            )
        });
    else {
        return null
    }
};

export default loadPictures;