import { CameraFilled, LeftCircleFilled, PlayCircleOutlined, RightCircleFilled, SaveFilled, StopFilled, VideoCameraAddOutlined, VideoCameraFilled } from "@ant-design/icons";
import { Button, Empty, Input, Steps } from "antd";
import { useRef, useState } from "react";
import VideoRecorder from "../../components/VideoRecorder";
import { saveCalibration } from "../../services/calibration";
import VideoService from "../../services/video";
import './calibrationStyles.scss';

const { Step } = Steps;

export default function CalibrationForm(props) {

    const refs = useRef([]);
    const [step, setStep] = useState(0);
    const [cameras, setCameras] = useState([]);
    const [intrinsicData, setIntrinsicData] = useState([]);
    const [extrinsicData, setExtrinsicData] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [name, setName] = useState("");

    const handleName = (event) => {
        setName(event.target.value);
    }

    const addCamera = () => {
        requestCamera();
        setCameras([...cameras, {
            id: null,
            rotation: 0
        }]);
    }

    const requestCamera = () => {
        navigator.mediaDevices.getUserMedia({
            video: true
        })
    }

    const removeCamera = (i) => {
        setCameras(cameras.filter((v, index) => i !== index));
    }

    const changeCameraId = (index, id) => {
        const cams = [...cameras];
        cams[index].id = id;
        setCameras(cams);
    }

    const changeCameraRotation = (index, rotation) => {
        const cams = [...cameras];
        cams[index].rotation = rotation;
        setCameras(cams);
    }

    const recordVideos = () => {
        for (const cam of refs.current) {
            if (!isRecording) {
                setIsRecording(true);
                cam.startRecording();
            } else {
                setIsRecording(false);
                cam.stopRecording();
            }
        };
    }

    const getIntrinsicData = () => {
        const data = refs.current.map(item => item.getData());
        setIntrinsicData(data);
    }

    const getExtrinsicData = () => {
        const data = refs.current.map(item => item.getData());
        setExtrinsicData(data);
    }

    const resetCameras = () => {
        refs.current.forEach(element => {
            element.discardRecording();
        });
    }

    const save = async () => {
        const savedData = await saveCalibration({
            name,
            cameras
        });
        intrinsicData.forEach(async (blob, index) => await VideoService.saveVideoToServer(`calibration/${savedData.folder}/intri`, index, blob, cameras[index]));
        extrinsicData.forEach(async (blob, index) => await VideoService.saveVideoToServer(`calibration/${savedData.folder}/extri`, index, blob, cameras[index]));
    }

    const actionButtons = () => {
        switch (step) {
            case 0:
                return <Button onClick={addCamera} type="primary"><VideoCameraAddOutlined /> Add Camera</Button>
            case 1:
                return <Button onClick={() => recordVideos()} className="ml-1" type="primary" danger>{
                    !isRecording ? <><PlayCircleOutlined /> Record Intrinsic</> : <><StopFilled /> Stop Recording</>
                }</Button>
            case 2:
                return <Button onClick={() => recordVideos()} className="ml-1" type="primary" danger>{
                    !isRecording ? <><PlayCircleOutlined /> Record Extrinsic</> : <><StopFilled /> Stop Recording</>
                }</Button>
            default:
                return null;
        }
    }

    const stepValidation = () => {
        switch (step) {
            case 0:
                return cameras.length > 0;
            default:
                return true;
        }
    }

    const cameraActionParams = () => {
        switch (step) {
            case 0:
                return {
                    onRemove: removeCamera,
                    onSelect: changeCameraId,
                    onRotate: changeCameraRotation,
                }
            case 1:
            case 2:
                return {
                    onRecordEach: recordVideos
                }
            default:
                return [];
        }
    }

    const nextStep = () => {
        if (stepValidation()) {

            switch (step) {
                case 1:
                    getIntrinsicData();
                    resetCameras();
                    break;
                case 2:
                    getExtrinsicData();
                    resetCameras();
                    break;
                default:
                    break;
            }

            setStep(step + 1);
        }
    }

    const prevStep = () => {
        setStep(step - 1);
    }

    const isLastStep = () => step >= 3;

    return (<>
        <h1>New Camera Calibration</h1>
        <Steps size="small" current={step} >
            <Step title="Select Cameras" />
            <Step title="Record Intrinsic" />
            <Step title="Record Extrinsic" />
            <Step title="Finish" />
        </Steps>

        <div className="row mv-4">
            <div className="col-xs">
                {step > 0 ? <Button onClick={prevStep} className="ml-1" type="dashed"><LeftCircleFilled /> Prev</Button> : null}
            </div>
            <div className="col-xs ta-c">
                {actionButtons()}
            </div>
            <div className="col-xs ta-r">
                {
                    !isLastStep()
                        ? <Button onClick={nextStep} className="ml-1" type="primary"><RightCircleFilled /> Next</Button>
                        : <Button onClick={save} className="ml-1" type="primary"><SaveFilled /> Save</Button>
                }
            </div>
        </div>

        <div style={{ display: isLastStep() ? "none" : "block" }}>
            {cameras.length ?
                <div className="cameras">{cameras.map((cam, i) => <VideoRecorder
                    key={`camera-${i}`}
                    index={i}
                    ref={el => (refs.current[i] = el)}
                    cameraId={cam.id}
                    rotation={cam.rotation}
                    {...cameraActionParams()}
                />)}</div>
                : <Empty className="mv-16" description="No camera. Click 'Add Camera' above to add cameras to calibration" />
            }
        </div>

        <div style={{ display: !isLastStep() ? "none" : "block" }}>
            <div className="row center-xs">
                <div className="col-md-6">
                    <Input
                        size="large"
                        placeholder="Input the Camera Calibration Name"
                        prefix={<VideoCameraFilled />}
                        value={name}
                        onChange={handleName}
                    />
                </div>
            </div>
        </div>

    </>);
}