import React from 'react';
import {Grid, Image} from "semantic-ui-react";
const Min = (props) => {
    if (Array.isArray(props.data) && props.data.length > 0)
    {
        return props.data.map((item, key) => {
            return (
                <Grid.Column>
                    <Image
                        key={key}
                        src={"http://localhost:8800/" + item}
                        rounded
                        size="medium"/>
                </Grid.Column>
            )
        });
    }
    else {
        return null
    }
};

export default Min;