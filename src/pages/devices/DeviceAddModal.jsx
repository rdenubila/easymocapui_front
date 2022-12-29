import { Form, Input, Modal, Select } from 'antd';
import { useState, useEffect, useRef, useContext } from 'react';
import VideoService from '../../services/video';
import { saveDevice } from '../../services/device';
import EventsService from '../../services/events';
import { GlobalStateContext } from '../../wrappers/GlobalContext';

const { Option, OptGroup } = Select;

function DeviceAddModal({ isModalVisible, setIsModalVisible }) {
    const { peers, videoStream } = useContext(GlobalStateContext)
    const [availableDevices, setAvailableDevices] = useState([]);
    const [availableStreamingDevices, setAvailableStreamingDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceName, setDeviceName] = useState("");
    const videoService = new VideoService();
    const eventService = new EventsService('updateDevices');
    const videoRef = useRef(null);

    const loadAvailableDevices = async () => {
        const devices = await videoService.getDevices();
        setAvailableDevices(devices);
    }

    const loadStreamingAvailableDevices = async () => {
        const devices = peers.map(p => p.metadata);
        setAvailableStreamingDevices(devices);
    }


    const showVideoPreview = () => {
        if (!selectedDevice) return;

        if (selectedDevice.type === "local") {
            videoService
                .setVideoRef(videoRef.current)
                .setCameraId(selectedDevice.deviceId)
                .updateDevice();
        } else {
            //videoStream.callToPeer(selectedDevice.deviceId);
        }
    }

    useEffect(() => {
        if (isModalVisible) {
            loadAvailableDevices();
            loadStreamingAvailableDevices()
        }
    }, [isModalVisible])

    useEffect(() => {
        showVideoPreview();
    }, [selectedDevice])

    const handleOk = async () => {
        if (!selectedDevice || !deviceName) {
            alert("Fill all fields before add a device");
            return;
        }

        await saveDevice({
            ...selectedDevice,
            ...{ name: deviceName }
        })

        eventService.dispatch();

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onSelectDevice = (ev) => {
        setSelectedDevice(JSON.parse(ev));
    }

    return (<Modal title="Add Device" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form.Item label="Select a device">
            <Select onChange={onSelectDevice}>

                <OptGroup label="Local">
                    {availableDevices?.map(device => <Option
                        key={device.deviceId}
                        value={JSON.stringify({
                            type: "local",
                            label: device.label,
                            deviceId: device.deviceId
                        })}>{device.label}</Option>)}
                    {availableDevices.length === 0 ? <option disabled>- No local device available -</option> : null}
                </OptGroup>

                <OptGroup label="Streaming">
                    {availableStreamingDevices?.map(device => <Option
                        key={device.deviceId}
                        value={JSON.stringify({
                            type: "streaming",
                            label: device.label,
                            deviceId: device.deviceId
                        })}>{device.label}</Option>)}
                    {availableStreamingDevices.length === 0 ? <option disabled>- No streaming device available -</option> : null}
                </OptGroup>

            </Select>
        </Form.Item>
        <Form.Item label="Device name">
            <Input value={deviceName} onChange={(ev) => setDeviceName(ev.target.value)} />
        </Form.Item>

        <div className={selectedDevice && selectedDevice.type === "local" ? '' : 'hidden'}>
            <video ref={videoRef} width="100%" style={{ aspectRatio: "16/9" }} controls />
        </div>
    </Modal >);
}

export default DeviceAddModal;
