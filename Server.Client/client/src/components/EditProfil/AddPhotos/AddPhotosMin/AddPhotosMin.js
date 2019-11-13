import React from 'react';
import Min from "./Min/Min";
import {Grid} from "semantic-ui-react";
import DividerC from "../../../Divider/Divider";

const AddPhotosMin = (props) => {
    if (props.data.length > 0)
    {
        return (
            <div className="AddPhotosMinContainer">
                <Grid doubling columns={props.data.length}>
                        <Min isBase64={props.isBase64} data={props.data}/>
                </Grid>
                <DividerC vertically={false}/>
            </div>
        )
    }
    else {
        return null
    }
};

export default AddPhotosMin;