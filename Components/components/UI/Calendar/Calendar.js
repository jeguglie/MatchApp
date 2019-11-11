import React from "react";

function calendar (props) {
    return (
        <div className="ui calendar" id="standard_calendar">
            <div className="ui input left icon">
                <i className="calendar icon"></i>
                <input type="text" placeholder="Date/Time"/>
            </div>
        </div>
    );
}

export default calendar;