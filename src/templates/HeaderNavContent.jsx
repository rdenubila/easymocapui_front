import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { GlobalStateContext } from '../wrappers/GlobalContext';

function HeaderNavContent({ children, title, subtitle, buttons, full }) {
    const { videoStream, peers } = useContext(GlobalStateContext);

    const promptDeviceNotification = () => {
        navigator.mediaDevices.getUserMedia({ video: true });
    }

    useEffect(() => {
        promptDeviceNotification();
    }, []);

    const menu = [
        {
            to: '/devices',
            label: 'Devices',
            icon: 'ri-webcam-fill'
        },
        {
            to: '/calibration',
            label: 'Calibration',
            icon: 'ri-screenshot-2-fill'
        },
        {
            to: '/animation',
            label: 'Animation',
            icon: 'ri-dvd-fill'
        },
        {
            to: '/logs',
            label: 'Logs',
            icon: 'ri-terminal-box-fill'
        }
    ]

    return (
        <div className='structure'>
            <header className='border-b border-gray-200 p-2 bg-secondary'>
                <h1 className='font-bitter font-bold text-lg text-white'>Easy mocap UI</h1>
            </header>

            <nav className='border-r border-gray-200 p-2'>
                <ul className='nav-menu'>
                    {menu.map(item =>
                        <li key={item.label}>
                            <Link to={item.to}>
                                <i className={item.icon}></i> {item.label}
                            </Link>
                        </li>)}
                </ul>
            </nav>

            <main className='bg-slate-100'>
                <div className="p-2 border-b border-gray-200 font-bitter font-bold text-lg text-secondary flex items-center bg-white">
                    <div className="flex-1">
                        {title}
                        {subtitle ? <span className='ml-2 text-gray-300'>{subtitle}</span> : null}
                    </div>
                    <div className="flex-1 text-right">
                        {buttons?.map(button => button)}
                    </div>
                </div>

                {full ? children :
                    <div className="w-full max-w-5xl mx-auto p-4">
                        {children}
                    </div>
                }
            </main>
        </div>
    );
}

export default HeaderNavContent;
