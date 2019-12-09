import React from "react";

function warnings (props) {
    if (Array.isArray(props.data) && props.data.length > 0)
    {
        return props.data.map((item, key) => {
            return (<span key={key}>{item}</span>)
        });
    }
    else
        return null
}

export default warnings;