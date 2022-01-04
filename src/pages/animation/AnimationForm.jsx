import { DeleteFilled, SaveFilled, VideoCameraFilled } from "@ant-design/icons";
import { Input, Form, Select, Divider, Empty, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import VideoRecorder from "../../components/VideoRecorder";
import { saveAnimation } from "../../services/animation";
import { getCalibrationById, listCalibration } from "../../services/calibration";
import VideoService from "../../services/video";

const { Option } = Select;

export default function AnimationForm(props) {

    const refs = useRef([]);
    const [cameras, setCameras] = useState([]);
    const [calibrationList, setCalibrationList] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleFormChange = async (changed, all) => {
        if (changed.calibration) {
            changeCalibration(changed.calibration);
        }
    }

    const changeCalibration = async (id) => {
        console.log('changeCalibration', id);
        const calibrationData = await getCalibrationById(id);
        setCameras(calibrationData.cameras)
    }

    const getCalibrationList = async () => {
        const list = await listCalibration();
        setCalibrationList(list);
    }

    useEffect(() => getCalibrationList(), [])

    const recordVideos = () => {
        for (const cam of refs.current) {
            if (!isRecording) {
                setIsRecording(true);
                cam.startRecording();
            } else {
                setIsRecording(false);
                setRecorded(true);
                cam.stopRecording();
            }
        };
    }

    const discardRecording = () => {
        for (const cam of refs.current) {
            cam.discardRecording();
            setIsRecording(false);
            setRecorded(false);
        }
    }

    const sendForm = async (values) => {
        if (!values.calibration)
            return;

        const savedData = await saveAnimation(values);

        refs.current.forEach(async (cam, index) =>
            await VideoService.saveVideoToServer(`animation/${savedData.folder}`, index, cam.getData(), cameras[index])
        );

        message.success("Animation successfully saved");

        navigate(`/animation/${savedData.id}`)
    }

    const canRecordAnimation = () => cameras.length > 0;

    return (<>
        <h1>New Animation</h1>

        <div className="row mv-4">

            <div className="col-md-3 pr-8">
                <Form
                    form={form}
                    layout="vertical"
                    onSub
                    onValuesChange={handleFormChange}
                    onFinish={sendForm}
                    initialValues={{
                        calibration: '',
                        name: '',
                        persons: 'single'
                    }}
                >
                    <Divider orientation="left">Recording</Divider>

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

                    {recorded
                        ? <Button onClick={discardRecording} htmlType="button" danger block><DeleteFilled /> Discard animation</Button>
                        : <Button disabled={!canRecordAnimation()} onClick={recordVideos} htmlType="button" danger block><VideoCameraFilled /> {isRecording ? "Stop recording" : "Record animation"}</Button>
                    }

                    <Divider orientation="left">Properties</Divider>

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

                    <Button htmlType="submit" type="primary" block><SaveFilled /> Save Animation</Button>


                </Form>
            </div>

            <div className="col-md">
                <Divider orientation="left">Cameras</Divider>

                {cameras.length ?
                    <div className="cameras">{cameras.map((cam, i) => <VideoRecorder
                        key={`camera-${i}`}
                        index={i}
                        ref={el => (refs.current[i] = el)}
                        cameraId={cam.id}
                        rotation={cam.rotation}
                    />)}</div>
                    : <Empty className="mv-16" description="No camera. Click 'Add Camera' above to add cameras to calibration" />
                }
            </div>

        </div>

    </>);
}