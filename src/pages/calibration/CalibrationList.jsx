import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { listCalibration, removeCalibration } from '../../services/calibration';
import { DeleteFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import HeaderNavContent from '../../templates/HeaderNavContent';

function CalibrationList(props) {
    const [data, setData] = useState();

    const loadData = async () => {
        const data = await listCalibration();
        setData(data);
    }

    const remove = async (id) => {
        await removeCalibration(id);
        loadData();
    }

    useEffect(() => {
        loadData();
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, element) => <Link to={`/calibration/${element._id}`}>{text}</Link>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: element => ([
                <Popconfirm
                    title="Are you sure to delete this item?"
                    onConfirm={() => remove(element._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="#">
                        <DeleteFilled />
                    </a>
                </Popconfirm>
            ]),
        }
    ]

    return (<HeaderNavContent title="Camera Calibration" buttons={[<Link to="/calibration/new"><Button type="primary">New Calibration</Button></Link>]}>
        <Table columns={columns} dataSource={data} />
    </HeaderNavContent>);
}

export default CalibrationList;
