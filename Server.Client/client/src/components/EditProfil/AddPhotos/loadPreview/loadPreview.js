import React from 'react';
import loadPictures from "../loadPictures/loadPictures";
import { Grid } from "semantic-ui-react";
import DividerC from "../../../Divider/Divider";

const loadPreview = (props) => {
    console.log(props.data);
    if (props.data.length > 0)
        return (
            <div className="AddPhotosMinContainer">
                <Grid
                    doubling
                    textAlign="center"
                    columns={ props.data.length } >
                    <loadPictures
                        data={ props.data }
                        isBase64={ props.isBase64 }
                        imageNumber={ props.imageNumber }
                        activeLoader={ props.activeLoader } />
                </Grid>
                <DividerC vertically={false}/>
            </div>
        );
    else
        return null
};

export default loadPreview;