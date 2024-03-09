"use client";

import moment from "moment";


const TimeStamp = ({seconds, nanoseconds}) => {

    const milliseconds = seconds * 1000 + Math.round(nanoseconds / 1000000);
    const date = moment(milliseconds).format("MMM Do YY");


    return (
        <div className="text-sm opacity-50 ">
            {date}
        </div>
    )
}

export default TimeStamp;