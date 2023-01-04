import { useEffect, useState, useContext } from 'react';
import { Steps } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HeaderNavContent from '../../templates/HeaderNavContent';
import { getCalibrationById } from '../../services/calibration';
import CalibrationRecord from './CalibrationRecord';
import EventsService from '../../services/events';
import CalibrationConversion from './CalibrationConversion';
import CalibrationExtractImages from './CalibrationExtractImages';
import CalibrationCalibrateCommands from './CalibrationCalibrateCommands';
import CalibrationChessboardCommands from './CalibrationDetectChessboard';
import CalibrationSelectImages from './CalibrationSelectImages';

const { Step } = Steps;

function CalibrationDetail() {
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState();
    const calibrationEvent = new EventsService('calibration');

    const loadData = async () => {
        const response = await getCalibrationById(id);
        setData(response);
    }

    const handleListener = (data) => {
        if (data.detail.action === "reload") loadData()
    }

    useEffect(() => {
        loadData()
        calibrationEvent.addListener(handleListener)
        return () => {
            calibrationEvent.removeListener(handleListener);
        }
    }, [])

    const changeStep = (index) => {
        setCurrentStep(index);
    }

    const renderContent = () => {
        switch (currentStep) {
            case 0:
                return <CalibrationRecord cameras={data.cameras} folder={`calibration/${data.folder}/intri`} type="intri" status={data.status.intri.raw} />
            case 1:
                return <CalibrationRecord cameras={data.cameras} folder={`calibration/${data.folder}/extri`} type="extri" status={data.status.extri.raw} />
            case 2:
                return <CalibrationConversion status={data.status} />
            case 3:
                return <CalibrationExtractImages status={data.status} id={id} />
            case 4:
                return <CalibrationSelectImages />
            case 5:
                return <CalibrationChessboardCommands status={data.status.intri.chessboard && data.status.extri.chessboard} id={id} />
            case 6:
                return <CalibrationCalibrateCommands status={data.status} id={id} />
            default:
                return null;
        }
    }

    return (<HeaderNavContent title="Camera Calibration" subtitle={data?.name} full>
        {data ? (
            <div className="flex">
                <div className='p-4 w-1/4'>
                    <Steps direction="vertical" size="small" current={currentStep} >
                        <Step onStepClick={changeStep} title="Intrinsic Dataset" description="Record videos to generate Intrinsic data" />
                        <Step onStepClick={changeStep} title="Extrinsic Dataset" description="Record videos to generate Extrinsic data" />
                        <Step onStepClick={changeStep} title="Video conversion" description="Convert recorded videos to desired format" />
                        <Step onStepClick={changeStep} title="Extract images" description="Convert video to images to run conversion commands" />
                        <Step onStepClick={changeStep} title="Select images" description="Select one image that show the chessboard for calibration" />
                        <Step onStepClick={changeStep} title="Detect chessboard" description="Detect chessboard from generated images" />
                        <Step onStepClick={changeStep} title="Calibration Files" description="Generate calibration files" />
                    </Steps>
                </div>
                <div className="p-4 w-3/4">
                    {renderContent()}
                </div>
            </div>
        ) : null}
    </HeaderNavContent>);
}

export default CalibrationDetail;
