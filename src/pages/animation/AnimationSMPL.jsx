import { Button, Result, Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smplReconstruction } from '../../services/animation';

function AnimationSMPL({ status, id }) {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const extract = async (values) => {
        await smplReconstruction(id, values);
        navigate("/logs");
    }

    const render = () => {

        if (status) {
            return <Result
                status="success"
                title="SMPL reconstructed successfully"
            />
        } else {
            return <Result
                status="warning"
                title="SMPL not reconstructed yet"
                extra={[
                    <Button onClick={() => setModalOpen(true)}>Generate command</Button>,
                    <Link to="/logs"><Button>Logs page</Button></Link>
                ]}
            />
        }
    }

    return (<div>

        <Modal
            title="Generate SMPL Reconstruction command"
            visible={modalOpen}
            onOk={() => form.submit()}
            onCancel={() => setModalOpen(false)}
        >
            <p className='mb-4'>Control the begin and end number of frames.</p>

            <Form
                form={form}
                layout='vertical'
                initialValues={{
                    start: 0,
                    end: 0,
                }}
                onFinish={extract}
            >
                <Form.Item label="Start" name="start">
                    <Input />
                </Form.Item>

                <Form.Item label="End" name="end">
                    <Input />
                </Form.Item>

            </Form>

        </Modal>

        {render()}
    </div>);
}

export default AnimationSMPL;
