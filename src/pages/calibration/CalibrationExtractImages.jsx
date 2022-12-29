import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { extractCalibrationVideo } from '../../services/calibration';

function CalibrationExtractImages({ status, id }) {
    const navigate = useNavigate();

    const allVideosConverted = () => status.intri.images && status.extri.images;

    const extract = async () => {
        await extractCalibrationVideo(id);
        navigate("/logs");
    }

    const render = () => {

        if (allVideosConverted()) {
            return <Result
                status="success"
                title="Calibration videos already extracted!"
            />
        } else {
            return <Result
                status="warning"
                title="Images still need to be extracted."
                extra={[
                    <Button onClick={extract}>Generate extract command</Button>,
                    <Link to="/logs"><Button>Logs page</Button></Link>
                ]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationExtractImages;
