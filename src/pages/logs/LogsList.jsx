import { Button, Popconfirm, Input } from 'antd';
import { useEffect, useState, useContext  } from 'react';
import LogStatus from '../../components/LogStatus';
import { getCommandById, listCommands, removeCommandById, runCommandById } from '../../services/command';
import HeaderNavContent from '../../templates/HeaderNavContent';
import { GlobalStateContext } from '../../wrappers/GlobalContext';
const nl2br = require('react-nl2br');

let interval;

function LogsList() {
    const { logList } = useContext(GlobalStateContext);
    const [selectedLog, setSelectedLog] = useState();
    const [detail, setDetail] = useState();

    const loadDetail = async () => {
        if (!selectedLog) return;

        const _data = await getCommandById(selectedLog);
        setDetail(_data);
    }

    const runCommand = async () => {
        await runCommandById(detail._id);
        loadDetail();
    }

    const removeCommand = async () => {
        await removeCommandById(detail._id);
        setSelectedLog(null);
        setDetail(null);
    }

    useEffect(() => {
        loadDetail();
    }, [selectedLog])

    const selectLog = (log) => {
        setSelectedLog(log._id);
    }

    return (<HeaderNavContent title="Logs" full>
        <div className="flex">
            <div className='w-80 max-h-mainContent overflow-y-auto'>
                <ul className='divide-y'>
                    {logList?.map(command => <li onClick={() => selectLog(command)} className='p-2 cursor-pointer hover:bg-slate-200' key={command._id}>
                        <h3 className='truncate font-bold'>{command.name}</h3>
                        <p className='truncate'>{command.command}</p>
                        <LogStatus status={command.status} />
                    </li>
                    )}
                </ul>
            </div>
            <div className="flex-1 p-4 pl-8">
                {detail ? <>
                    <h3 className='truncate font-bold text-lg'>{detail.name}</h3>
                    <Input value={detail.command} />
                    <p>Status: <LogStatus status={detail.status} /></p>
                    <div className='my-4'>
                        {detail.status === 'created' ? <Button onClick={runCommand}><i className="ri-play-fill"></i> Run command</Button> : null}
                        {detail.status === 'running' ? <Button onClick={loadDetail}><i className="ri-refresh-line"></i> Refresh</Button> : null}

                        <Popconfirm
                            title="Are you sure to delete this command?"
                            onConfirm={removeCommand}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type='text' danger ><i className="ri-delete-bin-fill"></i> Delete</Button>
                        </Popconfirm>
                    </div>
                    <div className="bg-black text-white p-4 rounded overflow-y-auto max-h-96">
                        {nl2br(detail.log) || "Click the button above to run the command"}
                    </div>
                </> : null}
            </div>
        </div>
    </HeaderNavContent>);
}

export default LogsList;
