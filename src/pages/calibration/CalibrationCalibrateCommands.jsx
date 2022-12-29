import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { calibrate } from '../../services/calibration';

function CalibrationCalibrateCommands({ status, id }) {
    const navigate = useNavigate();

    const allVideosConverted = () => false; //status.intri.images && status.extri.images;

    const extract = async () => {
        await calibrate(id);
        navigate("/logs");
    }

    const render = () => {

        if (allVideosConverted()) {
            return <Result
                status="success"
                title="Calibration files generated successfully!"
            />
        } else {
            return <Result
                status="warning"
                title="Calibration files still need to be generated"
                extra={[
                    <Button onClick={extract}>Generate calibration commands</Button>,
                    <Link to="/logs"><Button>Logs page</Button></Link>
                ]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationCalibrateCommands;
