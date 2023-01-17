import { useEffect, useState, useContext } from 'react';
import { Steps } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HeaderNavContent from '../../templates/HeaderNavContent';
import { getAnimationDetail } from '../../services/animation';
import CalibrationRecord from '../calibration/CalibrationRecord';
import { getCalibrationById } from '../../services/calibration';
import AnimationConversion from './AnimationConversion';
import AnimationExtractImages from './AnimationExtractImages';
import AnimationSMPL from './AnimationSMPL';
import AnimationBVH from './AnimationBVH';
import AnimationSynchronize from './AnimationSynchronize';

const { Step } = Steps;

function AnimationDetail() {
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState();
    const [calibration, setCalibration] = useState();

    const loadData = async () => {
        const response = await getAnimationDetail(id);
        loadCalibration(response);
        setData(response);
    }

    const loadCalibration = async (animation) => {
        const response = await getCalibrationById(animation.calibration);
        setCalibration(response);
    }

    useEffect(() => {
        loadData()
    }, [])

    const changeStep = (index) => {
        setCurrentStep(index);
    }
    const renderContent = () => {
        switch (currentStep) {
            case 0:
                return <CalibrationRecord cameras={calibration.cameras} folder={`animation/${data.folder}`} type="animation" status={data.status.raw} />
            case 1:
                return <AnimationConversion status={data.status.videos} />
            case 2:
                return <AnimationExtractImages status={data.status.images && data.status.openpose} id={id} />
            case 3:
                return <AnimationSynchronize id={id} />
            case 4:
                return <AnimationSMPL status={data.status.smpl} id={id} />
            case 5:
                return <AnimationBVH status={data.status.bvh} id={id} list={data.bvh} folder={data.folder} />
            default:
                return null;
        }
    }

    return (<HeaderNavContent title="Animation" subtitle={data?.name} full>
        {data && calibration ? (
            <div className="flex">
                <div className='p-4 w-1/4'>
                    <Steps direction="vertical" size="small" current={currentStep} >
                        <Step onStepClick={changeStep} title="Record videos" description="Record videos to generate animation" />
                        <Step onStepClick={changeStep} title="Video conversion" description="Convert recorded videos to desired format" />
                        <Step onStepClick={changeStep} title="Extract images" description="Convert video to images to run reconstruction commands" />
                        <Step onStepClick={changeStep} title="Synchronize videos" description="Synchronize videos from images" />
                        <Step onStepClick={changeStep} title="SMPL Reconstruction" description="Reconstruct poses based in images" />
                        <Step onStepClick={changeStep} title="Export BVH" description="Reconstruct poses based in images" />
                    </Steps>
                </div>
                <div className="p-4 w-3/4">
                    {renderContent()}
                </div>
            </div>
        ) : null}
    </HeaderNavContent>);
}

export default AnimationDetail;
