import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

const Header = (props) => {
    return(
        <nav>
            <div className='div-header'>
                <div class ="navbar">
                    <NavLink to={{
                        pathname:'/main',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Back to Swiping!</NavLink>
                    <NavLink to={{
                        pathname:'/matches',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Matches</NavLink>
                    <NavLink to={{
                        pathname:'/viewprofile',
                        state:{id: props.id, friendId: -1}}} className='inactive' activeClassName="active" replace>View Profile</NavLink>
                    <NavLink to={{
                        pathname:'/editprofile',
                        state:{id: props.id}}} className='inactive' activeClassName="active">Edit Profile</NavLink>
                    <NavLink to={{
                        pathname:'/profile'}} className='inactive' activeClassName="active">Settings</NavLink>
                </div>
                <div class="navbar">
                    <NavLink to={{
                        pathname:'/login'}} className='inactive' activeClassName="active">
                        <button className='button-header'>Log Out</button>
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default Header;