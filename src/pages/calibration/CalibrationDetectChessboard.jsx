import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { calibrate, detectChessboard } from '../../services/calibration';

function CalibrationChessboardCommands({ status, id }) {
    const navigate = useNavigate();

    const extract = async () => {
        await detectChessboard(id);
        navigate("/logs");
    }

    const render = () => {

        if (status) {
            return <Result
                status="success"
                title="Chessboard detected successfully!"
            />
        } else {
            return <Result
                status="warning"
                title="Chessboard not detected"
                extra={[
                    <Button onClick={extract}>Generate detection commands</Button>,
                    <Link to="/logs"><Button>Logs page</Button></Link>
                ]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default CalibrationChessboardCommands;
