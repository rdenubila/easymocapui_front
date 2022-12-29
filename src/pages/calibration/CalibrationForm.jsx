import { useEffect, useState, useContext } from 'react';
import { Form, Input, Button, Select, Badge, Space, message } from 'antd';
import HeaderNavContent from "../../templates/HeaderNavContent";
import './calibrationStyles.scss';
import { listDevice } from '../../services/device';
import { GlobalStateContext } from '../../wrappers/GlobalContext';
import VideoService from '../../services/video';
import { saveCalibration } from '../../services/calibration';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function CalibrationForm() {
    const { peers } = useContext(GlobalStateContext);
    const videoService = new VideoService();
    const [devices, setDevices] = useState([]);
    const [connectedDevices, setConnectedDevices] = useState([]);
    const navigate = useNavigate();

    const getDevices = async () => {
        const _devices = await listDevice();
        setDevices(_devices);
    }
    const getConnectedDevices = async () => {
        const _devices = await videoService.getDevices();
        setConnectedDevices(_devices);
    }

    const isConnected = (device) => {
        return connectedDevices.some(d => device.deviceId === d.deviceId)
            || peers.some(d => device.deviceId === d.metadata.deviceId);
    }

    useEffect(() => {
        getDevices();
        getConnectedDevices();
    }, []);

    const initialValues = {
        name: "",
        description: "",
        cameras: [],
        grid: "0.15",
        pattern: "9,6"
    };

    const onFinish = async (values) => {
        try {
            const newCalibration = await saveCalibration(values);
            message.success('Calibration created!');
            console.log(newCalibration);
            navigate('/calibration/' + newCalibration.id);

        } catch (e) {
            console.error(e);
        }
    };

    return (<HeaderNavContent title="Camera Calibration" subtitle="New">

        <Form
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
        //onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input the calibration name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <Input />
            </Form.Item>

            <Form.List
                label="Cameras"
                name="cameras"
            >
                {(fields, { add, remove }) => (<>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex' }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, "deviceId"]}
                                className='w-96'>
                                <Select placeholder="Select camera" >
                                    {devices?.map(device => <Select.Option key={device._id} value={device.deviceId}>
                                        <Badge color={isConnected(device) ? "green" : "red"} text={device.name} /> <small>({device.type})</small>
                                    </Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, "rotation"]}
                            >
                                <Select placeholder="Select rotation" >
                                    <Select.Option value="0">0</Select.Option>
                                    <Select.Option value="90">90</Select.Option>
                                    <Select.Option value="180">180</Select.Option>
                                    <Select.Option value="-90">-90</Select.Option>
                                </Select>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add camera
                        </Button>
                    </Form.Item>
                </>)}
            </Form.List>

            <Form.Item
                label="Grid"
                name="grid"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Pattern"
                name="pattern"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>

    </HeaderNavContent>);
}