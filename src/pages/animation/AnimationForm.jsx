import { DeleteFilled, SaveFilled, VideoCameraFilled } from "@ant-design/icons";
import { Input, Form, Select, Divider, Empty, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import VideoRecorder from "../../components/VideoRecorder";
import { getAnimationDetail, saveAnimation } from "../../services/animation";
import { getCalibrationById, listCalibration } from "../../services/calibration";
import VideoService from "../../services/video";
import HeaderNavContent from "../../templates/HeaderNavContent";

const { Option } = Select;

export default function AnimationForm(props) {
    const refs = useRef([]);
    const [calibrationList, setCalibrationList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const loadData = async () => {
        const _data = await getAnimationDetail(id);
        form.setFieldsValue({
            calibration: _data.calibration,
            name: _data.name,
            description: _data.description,
            persons:  _data.persons
        });
    }

    const getCalibrationList = async () => {
        const list = await listCalibration();
        setCalibrationList(list);
    }

    useEffect(() => {
        getCalibrationList()
        if (id) loadData()
    }, [])

    const sendForm = async (values) => {
        if (!values.calibration)
            return;

        const savedData = await saveAnimation(values, id);

        message.success("Animation successfully saved");

        navigate(`/animation/${savedData.id || id}`)
    }

    return (<HeaderNavContent title="Animation" subtitle="New">
        <Form
            form={form}
            layout="vertical"
            onSub
            onFinish={sendForm}
            initialValues={{
                calibration: '',
                name: '',
                description: '',
                persons: 'single'
            }}
        >

            <Form.Item
                name="name"
                label="Animation Name"
                rules={[
                    { required: true, message: 'Please input the animation name!' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="persons"
                label="Persons in scene"
                rules={[
                    { required: true, message: 'Please select the count of persons in scene!' }
                ]}
            >
                <Select>
                    <Option value="single">Single person</Option>
                    <Option value="multiple">Multiple persons</Option>
                </Select>
            </Form.Item>

            <Form.Item name="description" label="Description">
                <Input.TextArea autoSize={true} />
            </Form.Item>

            <Form.Item
                name="calibration"
                label="Calibration"
                rules={[
                    { required: true, message: 'Please select the calibration' }
                ]}
            >
                <Select>
                    <Option value="">Select</Option>
                    {calibrationList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>

        </Form>
    </HeaderNavContent>);
}