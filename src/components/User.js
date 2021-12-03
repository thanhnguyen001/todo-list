import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useClickOutside from '../hooks/useClickOutside';
import { logout } from '../reducer/userReducer';

function User() {
    
    const optionRef = useRef();
    useClickOutside(optionRef);

    const dispatch = useDispatch();

    const user = useSelector(state => state.user);

    const handleClick = (e) => {
        const option = document.querySelector(".user-logout");
        if (e.target.closest(".user-option")) return;
        if (option) option.classList.toggle("active");
    }

    const handleLogout = () => {
        dispatch(logout());
        const form = document.querySelector(".form");
        if (form) form.classList.add("active");
        // eslint-disable-next-line no-restricted-globals
        location.href = "/";
    }

    return (    
        <div className="user">
            <div className="user-wrap">
                <div className="user-name">{user ? user.username : "Username"}</div>
                <div className="user-logout" onClick={handleClick} ref={optionRef}>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className="user-option">
                        <div className="user-option-item" onClick={handleLogout}>Log out</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
