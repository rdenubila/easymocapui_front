import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { extractAnimationVideo } from '../../services/animation';
import { extractCalibrationVideo } from '../../services/calibration';

function AnimationExtractImages({ status, id }) {
    const navigate = useNavigate();

    const extract = async () => {
        await extractAnimationVideo(id);
        navigate("/logs");
    }

    const render = () => {

        if (status) {
            return <Result
                status="success"
                title="Video images already extracted!"
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

export default AnimationExtractImages;
