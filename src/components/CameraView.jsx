import { Badge } from "antd";
import React, { useRef, useEffect, useState, useContext } from "react";
import VideoService from "../services/video";
import EventsService from "../services/events";
import { GlobalStateContext } from "../wrappers/GlobalContext";

const LocalCamera = ({ device, options, folder }) => {
    const [isRecording, setIsRecording] = useState(false);
    const videoService = new VideoService();
    const eventService = new EventsService('videoRecording');
    const calibrationEvent = new EventsService('calibration');

    const videoRef = useRef(null);

    const handleListener = (data) => {
        switch (data.detail.action) {
            case 'start':
                setIsRecording(true);
                videoService.startRecording();
                break;
            case 'stop':
                setIsRecording(false);
                videoService.stopRecording();
                setTimeout(async () => {
                    await VideoService.saveVideoToServer(folder, device._id, videoService.blob, options);
                    videoService.discardRecording();
                    calibrationEvent.dispatch({ action: "reload" });
                }, 1000);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        videoService
            .setVideoRef(videoRef.current)
            .setCameraId(device.deviceId)
            .updateDevice();

        eventService.addListener(handleListener)
        return () => {
            eventService.removeListener(handleListener);
        }
    }, [])

    return (<div className="w-full h-full bg-black relative">
        {isRecording ? <div className="recording-dot"></div> : null}
        <video ref={videoRef} className="w-full h-full" />
    </div>);
}

const StreamCamera = ({ device, options, folder }) => {
    const { peers, videoStream } = useContext(GlobalStateContext);
    const [isRecording, setIsRecording] = useState(false);
    const eventService = new EventsService('videoRecording');

    const handleListener = (data) => {
        switch (data.detail.action) {
            case 'start':
                setIsRecording(true);
                videoStream.sendById(device.deviceId, {
                    action: "startRecording",
                    deviceId: device.deviceId,
                    folder,
                    options
                });
                break;
            case 'stop':
                setIsRecording(false);
                videoStream.sendById(device.deviceId, {
                    action: "stopRecording"
                });
                break;
            default:
                break;
        }
    }

    const isConnected = () => peers.find(p => p.peer === device.deviceId);

    useEffect(() => {

        eventService.addListener(handleListener)
        return () => {
            eventService.removeListener(handleListener);
        }
    }, [])

    return (<div className="w-full h-full bg-slate-300 relative flex items-center justify-center font-bold text-slate-200">
        {isRecording ? <div className="recording-dot"></div> : null}
        <div className="absolute left-2 bottom-2">
            {isConnected() ? <Badge color="green" text="Connected" /> : <Badge color="red" text="Disconnected" />}
        </div>
        <i className="ri-live-fill ri-6x"></i>
    </div>);
}


const CameraView = ({ device, options, folder }) => {

    return (<div className="w-full bg-white">
        <div className="truncate p-2 font-bold">{device.name}</div>
        <div className="aspect-video">
            {device.type === "local"
                ? <LocalCamera device={device} options={options} folder={folder} />
                : <StreamCamera device={device} options={options} folder={folder} />
            }
        </div>
    </div>);
}

export default CameraView;