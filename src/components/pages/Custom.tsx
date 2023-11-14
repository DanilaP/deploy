import * as React from 'react';
import { useParams } from 'react-router-dom';
import {useEffect} from "react";

export default function AboutPage (props:any) {
    let { num } = useParams();
    useEffect(() => {
        document.title = 'custom page';
    });
    return (
        <div>
            urlParam on custom page: { num }
        </div>
    );
}