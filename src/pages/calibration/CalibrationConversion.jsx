import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function CalibrationConversion({ status }) {

    const allVideosConverted = () => status.intri.videos && status.extri.videos;

    const render = () => {

        if (allVideosConverted()) {
            return <Result
                status="success"
                title="Calibration videos already converted!"
            />
        } else {
            return <Result
                status="warning"
                title="Calibration videos still need to be converted. Go to Logs page to check status."
                extra={[<Link to="/logs"><Button>Logs page</Button></Link>]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationConversion;
