import { PlayCircleFilled, SaveFilled, StopFilled } from "@ant-design/icons";
import { Input, Form, Select, Divider, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import VideoPlayer from "../../components/VideoPlayer";
import { getAnimationDetail, saveAnimation } from "../../services/animation";

const { Option } = Select;

export default function AnimationDetail(props) {
    const refs = useRef([]);
    const [data, setData] = useState();
    const { id } = useParams();
    const [form] = Form.useForm();

    const sendForm = async (values) => {
        const savedData = await saveAnimation(values, id);
        message.success("Animation successfully saved");
        loadData();
    }

    const loadData = async () => {
        const response = await getAnimationDetail(id)
        setData(response);
        form.setFieldsValue(response);
    }

    useEffect(() => {
        loadData()
    }, []);

    const playVideos = () => {
        refs.current.forEach(video => video.play());
    }
    const stopVideos = () => {
        refs.current.forEach(video => video.stop());
    }

    return (<>
        <h1>New Animation</h1>

        <div className="row mv-4">

            <div className="col-md-3 pr-8">
                <Form
                    form={form}
                    layout="vertical"
                    onSub
                    onFinish={sendForm}
                >
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
                <Divider orientation="left">Videos</Divider>

                <Button type="link" onClick={playVideos}><PlayCircleFilled />Play</Button>
                <Button type="link" onClick={stopVideos}><StopFilled /> Stop</Button>

                <div className="cameras">{data?.videos.map((video, i) => <VideoPlayer
                    key={`camera-${i}`}
                    index={i}
                    ref={el => (refs.current[i] = el)}
                    folder={data.folder}
                    video={video}
                />)}</div>

            </div>

        </div>

    </>);
}