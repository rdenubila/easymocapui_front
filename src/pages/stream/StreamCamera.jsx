import { useContext, useEffect, useState, useRef } from "react";
import { GlobalStateContext } from "../../wrappers/GlobalContext";
import { Menu, Dropdown } from 'antd';
import VideoService from "../../services/video";
import EventsService from "../../services/events";

const videoService = new VideoService();
let recordingData = {};

function StreamCamera() {
    const { videoStream } = useContext(GlobalStateContext);
    const [isRecording, setIsRecording] = useState(false);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const eventService = new EventsService('videoStream');
    const videoRef = useRef(null);

    const promptDeviceNotification = () => {
        navigator.mediaDevices.getUserMedia({ video: true });
    }

    const loadAvailableDevices = async () => {
        const devices = await videoService.getDevices();
        setAvailableDevices(devices);
    }

    const showVideoPreview = async () => {
        if (!selectedDevice) return;

        await videoService
            .setVideoRef(videoRef.current)
            .setCameraId(selectedDevice.deviceId)
            .updateDevice();

        console.log(videoService);

        videoStream.connect(false, selectedDevice.deviceId);
    }

    const connectToServer = () => {
        videoStream.connectToServer(selectedDevice);
        console.log(videoService);

    }

    const handleListener = (data) => {
        console.log(data);
        console.log(videoService);

        switch (data.detail.action) {
            case 'startRecording':
                setIsRecording(true);
                recordingData = data.detail;
                videoService.startRecording();
                break;
            case 'stopRecording':
                setIsRecording(false);
                videoService.stopRecording();
                setTimeout(async () => {
                    await VideoService.saveVideoToServer(recordingData.folder, recordingData.deviceId, videoService.blob, recordingData.options);
                    videoService.discardRecording();
                }, 1000);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        promptDeviceNotification();
        loadAvailableDevices();

        eventService.addListener((data) => handleListener(data))
        return () => {
            eventService.removeListener((data) => handleListener(data));
        }
    }, [])

    useEffect(() => {
        showVideoPreview();
    }, [selectedDevice])


    const menu = (
        <Menu>
            {availableDevices.map(device => (
                <Menu.Item key={device.deviceId} onClick={() => setSelectedDevice(device)}>
                    {device.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (<>
        {isRecording ? <div className="recording-dot"></div> : null}
        <video ref={videoRef} className="w-full h-screen" />

        <div className="absolute bottom-0 w-full flex text-xl">
            <Dropdown overlay={menu} trigger={['click']}>
                <button className="flex-1">
                    <i className="ri-camera-switch-fill"></i>
                </button>
            </Dropdown>
            <button onClick={connectToServer} className="flex-1">
                <i className="ri-plug-fill"></i>
            </button>
        </div>
    </>
    );
}

export default StreamCamera;
