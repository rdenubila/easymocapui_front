import { DeleteFilled, SaveFilled, VideoCameraFilled } from "@ant-design/icons";
import { Input, Form, Select, Divider, Empty, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import VideoRecorder from "../../components/VideoRecorder";
import { saveAnimation } from "../../services/animation";
import { getCalibrationById, listCalibration } from "../../services/calibration";
import VideoService from "../../services/video";

const { Option } = Select;

export default function AnimationForm(props) {

    const [cameras, setCameras] = useState([]);
    const [calibrationList, setCalibrationList] = useState([]);
    const refs = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [form] = Form.useForm();

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
        console.log(values);

        if (!values.calibration)
            return;

        const savedData = await saveAnimation(values);

        refs.current.forEach(async (cam, index) => await VideoService.saveVideoToServer(`animation/${savedData.folder}/videos`, index, cam.getData()));
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
                        name: ''
                    }}
                >
                    <Divider orientation="left">Recording</Divider>

                    <Form.Item name="calibration" label="Calibration">
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

                    <Form.Item name="description" label="Description">
                        <Input.TextArea autoSize={true} />
                    </Form.Item>

                    <Button htmlType="submit" type="primary" block><SaveFilled /> Save Animation</Button>


                </Form>
            </div>

            <div className="col-md">
                <Divider orientation="left">Cameras</Divider>

                {cameras.length ?
                    <div className="cameras">{cameras.map((id, i) => <VideoRecorder
                        key={`camera-${i}`}
                        index={i}
                        ref={el => (refs.current[i] = el)}
                        cameraId={id}
                    />)}</div>
                    : <Empty className="mv-16" description="No camera. Click 'Add Camera' above to add cameras to calibration" />
                }
            </div>

        </div>

    </>);
}