import React from 'react';
import {Grid, Image} from "semantic-ui-react";


const LoadImages = (props) => {
    if (Array.isArray(props.data) && props.data.length > 0) {
        return props.data.map((item, key) => {
            return (
                <Grid.Column mobile={5} tablet={5} computer={5}>
                        <Image
                            className="ImagePreview"
                            id={key}
                            src={"http://localhost:8800/" + item.img_link}
                            rounded
                            fluid
                            label={{ as: 'a', corner: 'right', icon: 'close' }}
                            onClick={props.deleteImage}
                        />
                </Grid.Column>
            )
        });
    }
    else {
        return null
    }
};

export default LoadImages;