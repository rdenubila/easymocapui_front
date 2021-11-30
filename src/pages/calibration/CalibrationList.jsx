import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { listCalibration, removeCalibration } from '../../services/calibration';
import { DeleteFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

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
            render: text => <a>{text}</a>,
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

    return (<>
        <div className="row">
            <div className="col-xs">
                <h1>Camera Calibration</h1>
            </div>
            <div className="col-xs ta-r">
                <Link to="/calibration/new"><Button type="primary">New Calibration</Button></Link>
            </div>
        </div>
        <Table columns={columns} dataSource={data} />
    </>);
}

export default CalibrationList;
