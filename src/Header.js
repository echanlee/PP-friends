import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

const Header = (props) => {
    return(
        <nav>
            <div className='div-header'>
                <div>
                    <NavLink to={{
                        pathname:'/matches',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Matches</NavLink>
                    <NavLink to={{
                        pathname:'/profile',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Profile</NavLink>
                    <NavLink to={{
                        pathname:'/messages',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Messages</NavLink>
                    <NavLink to={{
                        pathname:'/profile'}} className='inactive' activeClassName="active">Settings</NavLink>
                </div>
                <div>
                    <NavLink to={{
                        pathname:'/'}} className='inactive' activeClassName="active">
                        <button className='button-header'>Log Out</button>
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default Header;