import { Button, List, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { bvhExport, bvhLink, smplReconstruction } from '../../services/animation';

function AnimationBVH({ status, id, list, folder }) {
    const navigate = useNavigate();

    const extract = async () => {
        await bvhExport(id);
        navigate("/logs");
    }

    const render = () => {

        if (status) {
            return <>
                <Result
                    status="success"
                    title="BVH exported successfully"
                />
                <List
                    bordered
                    dataSource={list}
                    renderItem={item => (
                        <List.Item>
                            <a href={bvhLink(folder, item)}>{folder}/{item}</a>
                        </List.Item>
                    )}
                />
            </>
        } else {
            return <Result
                status="warning"
                title="BVH file not generated yet"
                extra={[
                    <Button onClick={extract}>Generate command</Button>,
                    <Link to="/logs"><Button>Logs page</Button></Link>
                ]}
            />
        }
    }

    return (<div>{render()}</div>);
}

export default AnimationBVH;
