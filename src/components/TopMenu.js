import React from 'react'
import { Link } from 'react-router-dom';
import { Menu} from 'semantic-ui-react'

const TopMenu = () => (
    <Menu>
        <Menu.Item header>Faraday</Menu.Item>
        <Menu.Item as='a'><Link to="/">Home</Link></Menu.Item>
        <Menu.Item as='a'><Link to="/users">Users</Link></Menu.Item>
        <Menu.Item as='a'><Link to="dashboard">Dashboard</Link></Menu.Item>
        <Menu.Menu position="right">
            <Menu.Item as='a'>Logout</Menu.Item>
        </Menu.Menu>
    </Menu>
);

export default TopMenu;