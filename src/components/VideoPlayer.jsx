import { Card } from "antd";
import React, { useEffect, useImperativeHandle, useRef } from "react";

const VideoPlayer = React.forwardRef((props, ref) => {
    const videoRef = useRef(null);

    const src = `${process.env.REACT_APP_API_URL}../files/animation/${props.folder}/videos/${props.video}`;

    useImperativeHandle(ref, () => ({
        play: () => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        },
        stop: () => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        },
    }), []);

    useEffect(() => {
        videoRef.current.src = src;
        videoRef.current.play();
    }, [src])


    return (<>
        <Card
            size="small"
        >
            <video ref={videoRef} width="100%" style={{ aspectRatio: "16/9" }} controls />
        </Card>
    </>);
})

export default VideoPlayer;