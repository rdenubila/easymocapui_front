import { Badge, Button, Card, Menu, Dropdown } from "antd";
import React, { useEffect, useState, useContext } from "react";
import VideoService from "../services/video";
import { removeDevice } from "../services/device";
import EventsService from "../services/events";
import { GlobalStateContext } from "../wrappers/GlobalContext";

const DeviceCard = React.forwardRef(({ device, onEdit }, ref) => {
    const { peers } = useContext(GlobalStateContext);
    const [connected, setConnected] = useState(false);
    const videoService = new VideoService();
    const eventService = new EventsService('updateDevices');

    const isConnected = async () => {
        const devices = await videoService.getDevices();
        const streamDevices = peers;
        const connected = devices.some(d => device.deviceId === d.deviceId) || streamDevices.some(d => device.deviceId === d.metadata.deviceId);
        setConnected(connected);
    }

    const deleteDevice = async () => {
        await removeDevice(device._id);
        eventService.dispatch();
    }

    useEffect(() => {
        isConnected();
    }, []);

    const menu = (
        <Menu>
            <Menu.Item onClick={() => onEdit(device)}>
                Edit
            </Menu.Item>
            <Menu.Item danger onClick={deleteDevice}>
                Delete
            </Menu.Item>
        </Menu>
    );

    return (<>
        <Badge.Ribbon text={connected ? "Online" : "Offline"} color={connected ? "green" : "red"}>
            <Card
                title={device.name}
                size="small"
                className="my-4"
            >
                <Dropdown overlay={menu}>
                    <Button className="float-right" shape="circle" ><i className="ri-more-2-fill"></i></Button>
                </Dropdown>
                <div>
                    <ul>
                        <li>Label: {device.label}</li>
                        <li>Type: {device.type}</li>
                        <li>ID: {device.deviceId}</li>
                    </ul>
                </div>
            </Card>
        </Badge.Ribbon>
    </>);
})

export default DeviceCard;