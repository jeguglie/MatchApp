import React from 'react';
import Min from "./Min/Min";
import {Grid} from "semantic-ui-react";

const AddPhotosMin = (props) => {
    if (props.data.length > 0)
    {
        return (
            <div className="AddPhotosMinContainer">
                <Grid columns={props.data.length}>
                    <Min data={props.data}/>
                </Grid>
            </div>
        )
    }
    else {
        return null
    }
};

export default AddPhotosMin;