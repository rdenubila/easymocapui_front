import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { listAnimation, removeAnimation } from '../../services/animation';

function AnimationList(props) {
    const [data, setData] = useState();

    const loadData = async () => {
        const data = await listAnimation();
        setData(data);
    }

    const remove = async (id) => {
        await removeAnimation(id);
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
            render: (text, el) => <Link to={`/animation/${el._id}`}>{text}</Link>,
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
                <h1>Animations</h1>
            </div>
            <div className="col-xs ta-r">
                <Link to="/animation/new"><Button type="primary">New Animation</Button></Link>
            </div>
        </div>
        <Table columns={columns} dataSource={data} />
    </>);
}

export default AnimationList;
