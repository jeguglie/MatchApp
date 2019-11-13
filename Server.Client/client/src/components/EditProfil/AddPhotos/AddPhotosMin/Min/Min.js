import React from 'react';
import {Grid, Image} from "semantic-ui-react";
const Min = (props) => {
    if (Array.isArray(props.data) && props.data.length > 0)
            return props.data.map((item, key) => {
                const add = "http://localhost:8800/";
                const srcImg = item.length > 200 ? item : add.concat(item);
                return (
                    <Grid.Column key={key}>
                        <Image
                            className="AddPhotosImgPreview"
                            src={srcImg}
                            rounded />
                    </Grid.Column>
                )
            });
    else {
        return null
    }
};

export default Min;