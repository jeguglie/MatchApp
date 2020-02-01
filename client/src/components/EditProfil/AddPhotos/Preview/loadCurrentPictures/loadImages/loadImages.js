import React from 'react';
import {Grid, Image} from "semantic-ui-react";


const LoadImages = (props) => {
    const deleteImage = (event) => {
        props.deleteImage(event);
    }
    if (Array.isArray(props.data) && props.data.length > 0) {
        return props.data.map((item, key) => {
            return (
                <Grid.Column key={key} mobile={8} tablet={6} computer={6}>
                        <Image
                            className="ImagePreview"
                            src={item.img_link}
                            rounded
                            fluid
                            label={{ as: 'a', corner: 'right', icon: 'close' , onClick: () => deleteImage(item.img_id, key) }}
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