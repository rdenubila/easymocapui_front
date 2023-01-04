import { Button, InputNumber, Modal, Result } from 'antd';
import { useEffect, useState, useContext } from 'react';
import CameraView from '../../components/CameraView';
import { listDevice } from '../../services/device';
import EventsService from '../../services/events';
import _ from 'lodash';

function CalibrationRecord({ cameras, folder, type, status }) {
    const [devices, setDevices] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const [startDelay, setStartDelay] = useState(0);
    const [endDelay, setEndDelay] = useState(0);
    const [hasTimer, setHasTimer] = useState(0)

    const eventsService = new EventsService('videoRecording');

    const getDevices = async () => {
        const _devices = await listDevice();
        setDevices(_devices);
    }

    useEffect(() => getDevices(), []);

    const filteredCams = () => {
        return _.intersectionBy(devices, cameras, 'deviceId')
    }

    const cameraOptions = (cam) => cameras.find(c => c.deviceId == cam.deviceId);

    const toggleRecording = () => {
        if (!isRecording)
            startRecording();
        else
            stopRecording();
    }

    const startRecording = () => {
        setHasTimer(startDelay);
        setTimeout(() => {
            eventsService.dispatch({ action: 'start' })
            setIsRecording(true);
            setHasTimer(0);

            if (endDelay)
                stopRecording();
        }, startDelay * 1000);
    }

    const stopRecording = () => {
        setHasTimer(endDelay);
        setTimeout(() => {
            eventsService.dispatch({ action: 'stop' })
            setIsRecording(false);
            setHasTimer(0);
        }, endDelay * 1000);
    }

    let delayInterval;
    useEffect(() => {
        if (hasTimer > 0)
            delayInterval = setTimeout(() => setHasTimer(hasTimer - 1), 1000);

    }, [hasTimer]);

    const hasModal = () => type === "intri" || type === "extri";
    const renderModal = () => {
        if (type === "intri") {
            return <Modal title="Intrinsic Dataset" visible={showHelp} footer={null} onCancel={() => setShowHelp(false)} >
                <p>Record videos showing the chessboard like the image bellow</p>
                <p><img src='https://github.com/zju3dv/EasyMocap/raw/master/apps/calibration/assets/intri_sample.png' /></p>
            </Modal>
        } else if (type === "extri") {
            return <Modal title="Extrinsic Dataset" visible={showHelp} footer={null} onCancel={() => setShowHelp(false)} >
                <p>For the extrinsic parameters, you should place the chessboard pattern where it will be visible to all the cameras (on the floor for example)</p>
                <p><img src='https://github.com/zju3dv/EasyMocap/raw/master/apps/calibration/assets/extri_sample.png' /></p>
            </Modal>
        }
    }

    const render = () => {

        if (status) {
            return <Result
                status="success"
                title="Video recorded successfully"
            />
        } else {
            return (<>
                {renderModal()}
                <div className='mb-4 p-3 shadow-md bg-white rounded-md flex gap-4 items-center'>
                    {hasTimer
                        ? <>Recording {isRecording ? "ends" : "starts"} in {hasTimer} seconds</>
                        : <Button onClick={toggleRecording} type="primary">{isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
                    }
                    {hasModal() ? <Button onClick={() => setShowHelp(true)}>Help</Button> : null}

                    <div>
                        Delay start: <InputNumber min={0} value={startDelay} onChange={(value) => setStartDelay(value)} />
                    </div>
                    <div>
                        End in: <InputNumber min={0} value={endDelay} onChange={(value) => setEndDelay(value)} />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    {filteredCams()?.map(cam => <CameraView key={cam._id} device={cam} options={cameraOptions(cam)} folder={folder} />)}
                </div></>)
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationRecord;
