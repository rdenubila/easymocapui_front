import { Button, Modal, Result } from 'antd';
import { useEffect, useState, useContext } from 'react';
import CameraView from '../../components/CameraView';
import { listDevice } from '../../services/device';
import EventsService from '../../services/events';
import _ from 'lodash';

function CalibrationRecord({ cameras, folder, type, status }) {
    const [devices, setDevices] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
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
        eventsService.dispatch({ action: !isRecording ? 'start' : 'stop' })
        setIsRecording(!isRecording);
    }

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
                <div className='mb-4'>
                    <Button onClick={toggleRecording} type="primary">{isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
                    {hasModal() ? <Button onClick={() => setShowHelp(true)}>Help</Button> : null}
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    {filteredCams()?.map(cam => <CameraView key={cam._id} device={cam} options={cameraOptions(cam)} folder={folder} />)}
                </div></>)
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationRecord;
