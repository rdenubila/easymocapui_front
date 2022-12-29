import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function AnimationConversion({ status }) {

    const render = () => {

        if (status) {
            return <Result
                status="success"
                title="Videos already converted!"
            />
        } else {
            return <Result
                status="warning"
                title="Videos still need to be converted. Go to Logs page to check status."
                extra={[<Link to="/logs"><Button>Logs page</Button></Link>]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default AnimationConversion;
