import { DeleteFilled, PlayCircleFilled, RotateRightOutlined, StopFilled, VideoCameraFilled } from "@ant-design/icons";
import { Card, Dropdown, Menu } from "antd";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import VideoService from "../services/video";

const VideoRecorder = React.forwardRef((props, ref) => {
    const { index, cameraId } = props;
    const [availableDevices, setAvailableDevices] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const videoRef = useRef(null);
    const [videoService] = useState(new VideoService());

    useEffect(() => {
        const getDevices = async () => {
            const devices = await videoService.getDevices();
            setAvailableDevices(devices)
        }
        getDevices();
    }, []);

    useEffect(() => {
        const update = async () => {
            if (videoRef.current)
                videoService.setVideoRef(videoRef.current);
            if (cameraId)
                videoService.setCameraId(cameraId);
            await videoService.updateDevice()
        }
        update();
    }, [cameraId, videoRef]);

    useImperativeHandle(ref, () => ({
        startRecording: () => startRecording(),
        stopRecording: () => stopRecording(),
        toggleRecording: () => toggleRecording(),
        discardRecording: () => discardRecording(),
        getData: () => videoService._data,
        isRecording,
        recorded
    }), []);

    const toggleRecording = () => {
        console.log("toggleRecording", isRecording);
        if (isRecording)
            stopRecording();
        else
            startRecording()
    }

    const startRecording = () => {
        console.log("startRecording")
        setIsRecording(true);
        videoService.startRecording();
    }

    const stopRecording = () => {
        console.log("stopRecording")
        setIsRecording(false);
        setRecorded(true);
        videoService.stopRecording();
    }

    const discardRecording = () => {
        setIsRecording(false);
        setRecorded(false);
        videoService.discardRecording();
    }

    const saveVideo = () => {
        videoService.saveVideoToServer('teste', index);
    }

    const actions = () => {
        const list = [];

        if (props.onRemove)
            list.push(<DeleteFilled onClick={() => props.onRemove(index)} key="Delete" />)

        if (props.onRecordEach) {
            if (recorded) {
                list.push(<span onClick={() => discardRecording()}><DeleteFilled key="discard" /> Discard recording</span>)
            } else {
                if (!isRecording)
                    list.push(<span onClick={() => startRecording()}><PlayCircleFilled key="record" /> Record this camera</span>)
                else
                    list.push(<span onClick={() => stopRecording()}><StopFilled key="record" /> Stop recording</span>)
            }

        }

        if (props.onSelect)
            list.push(<Dropdown overlay={devicesMenu()} placement="bottomLeft" arrow>
                <VideoCameraFilled key="selectCam" />
            </Dropdown>)

        if (props.onRotate)
            list.push(<Dropdown overlay={rotateMenu()} placement="bottomLeft" arrow>
                <RotateRightOutlined key="rotateCam" />
            </Dropdown>)

        return list;
    }

    const devicesMenu = () => (
        <Menu>
            {availableDevices.map(device => (
                <Menu.Item key={device.deviceId} onClick={() => props.onSelect(index, device.deviceId)} >
                    {device.label}
                </Menu.Item>
            ))
            }
        </Menu>
    );

    const rotateMenu = () => {
        const options = [-90, 0, 90, 180]
        return <Menu>
            {options.map(rotation => (
                <Menu.Item key={'rot-' + rotation} onClick={() => props.onRotate(index, rotation)} >
                    {rotation}
                </Menu.Item>
            ))
            }
        </Menu>
    };

    return (<>
        <Card
            size="small"
            actions={actions()}
        >
            <div className={`cam-rotation cam-rotation-${props.rotation}`}>
                <video ref={videoRef} width="100%" controls />
            </div>
            {isRecording ? <div className="recording-bullet blink"></div> : null}
        </Card>
    </>);
})

export default VideoRecorder;