import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import DeviceCard from '../../components/DeviceCard';
import { listDevice } from '../../services/device';
import EventsService from '../../services/events';
import HeaderNavContent from '../../templates/HeaderNavContent';
import DeviceAddModal from './DeviceAddModal';

function DevicesList(props) {
    const [data, setData] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const eventService = new EventsService('updateDevices');

    const loadData = async () => {
        const data = await listDevice();
        setData(data);
    }

    const handleUpdate = () => {
        loadData();
    };

    useEffect(() => {
        loadData();
        eventService.addListener(handleUpdate);
        return () => {
            eventService.removeListener(handleUpdate);
        }
    }, [])




    return (<HeaderNavContent
        title="Devices"
        buttons={[
            <Button onClick={() => setIsModalVisible(true)}>Add Device</Button>
        ]}>
        <DeviceAddModal {...{ isModalVisible, setIsModalVisible }} />

        {data?.map(device => <DeviceCard key={device._id} device={device} />)}

    </HeaderNavContent>);
}

export default DevicesList;
