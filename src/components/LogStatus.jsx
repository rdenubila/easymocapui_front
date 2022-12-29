import { Badge } from "antd";

const LogStatus = ({ status }) => {

    const getStatusInfo = () => {
        switch (status) {
            case 'finished':
                return { text: "Finished", color: "green" };
            case 'running':
                return { text: "Running", color: "orange" };
            case 'created':
                return { text: "Created", color: "cyan" };
            default:
                return { text: "-", color: "gray" };
        }
    }

    return (<Badge {...getStatusInfo()} />);
}

export default LogStatus;