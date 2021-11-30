import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

function HeaderContentFooter(props) {

    return (
        <Layout className="layout">
            <Header>
                <h1 className="logo">
                    EasyMocapUI
                </h1>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Link to="/calibration">
                        <Menu.Item key="cams">Camera Calibration</Menu.Item>
                    </Link>
                    <Link to="/animations">
                        <Menu.Item key="animations">Animations</Menu.Item>
                    </Link>
                </Menu>
            </Header>
            <Content style={{ padding: '24px 50px' }}>
                {props.children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>EasyMocapUI ©2021 Created by Rodrigo Denúbila</Footer>
        </Layout>
    );
}

export default HeaderContentFooter;
