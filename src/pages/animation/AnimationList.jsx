import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { listAnimation, removeAnimation } from '../../services/animation';
import HeaderNavContent from '../../templates/HeaderNavContent';

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
                </Popconfirm>,
                <Link className="ml-2" to={`/animation/${element._id}/edit`}>
                    <EditFilled />
                </Link>
            ]),
        }
    ]

    return (
        <HeaderNavContent title="Animation" buttons={[<Link to="/animation/new"><Button type="primary">New Animation</Button></Link>]}>
            <Table columns={columns} dataSource={data} />
        </HeaderNavContent>
    );
}

export default AnimationList;
