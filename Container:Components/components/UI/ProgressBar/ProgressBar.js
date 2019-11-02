import React from 'react';
import { Progress } from 'semantic-ui-react'

const ProgressExampleProgress = () => <Progress percent={44} progress />

export default function ProgressBar (props) {
    return (
        <div className="ui progress" data-percent="44">
            <div className="bar" style="width:44%">
                <div className="progress">44%</div>
            </div>
        </div>
    )
};