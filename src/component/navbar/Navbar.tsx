
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate, Outlet } from 'react-router-dom';
import './Navbar.css'


export default function Navbar() {

    const navigate = useNavigate();
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Table',
            icon: 'pi pi-database',
            command: () => navigate('table')
        }
    ];

    return (<>
        <div className="">
            <div className="card div-menu-bar">
                <Menubar model={items} />
            </div>
        </div>
        <Outlet />
    </>
    )
}
