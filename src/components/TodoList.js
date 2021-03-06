import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Css/TodoList.css';
import NewTask from './NewTask';
import { removeMultiTasks } from '../reducer/taskReducer';
import axios from 'axios';
import { BASE_URL } from '../constant';
import { signIn } from '../reducer/userReducer';

function TodoList() {



    const tasks = useSelector(state => state.tasks);
    const [list, setList] = useState(null);
    const [keyword, setKeyword] = useState("");

    const dispatch = useDispatch();

    const user = useSelector(state => state.user);

    const updateUser = async (user, list) => {
        try {
            // console.log(BASE_URL)
            const url = BASE_URL;
            const response = await axios.post(`${url}/update/${user.id}`, { list });
            if (response.data.success) dispatch(signIn(response.data.user));
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (tasks) {
            // console.log(tasks)
            setList(tasks);
            const checkboxE = document.querySelectorAll("input[type='checkbox']");
            [...checkboxE].forEach(item => item.checked = false);

            if (user && user.username) updateUser(user, tasks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks])

    const handleScroll = (e) => {
        if (!e) return;
        if (e.target.scrollTop > 0) {
            e.target.classList.add("scroll");
        }
        else e.target.classList.remove("scroll");
    }

    const renderList = (list) => {
        return list.map((item, index) => {
            return <li className="list-item" key={index}>
                <NewTask item={item} index={index} />
            </li>
        })
    }

    const handleRemoveMultiTasks = () => {
        const inputs = document.querySelectorAll("input[type='checkbox']");
        // eslint-disable-next-line array-callback-return
        const isChecked = [];
        [...inputs].forEach((item, index) => {
            if (item.checked) {
                isChecked.push(list[index].id);
            }
        });
        // console.log(isChecked);
        dispatch(removeMultiTasks(isChecked));
    }

    function UtilChangeToAlpha(letter) {
        letter = letter
            .toLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .replace(/\s+/g, "-") // Replace space = '-'
            .replace(/[^A-Za-z0-9_-]/g, "-") // Replace not number and not a-z, A-Z to "";
        // .replace(/-+/g, "-");    // Replace -
        return letter;
    }

    const handleSearch = (e) => {
        setKeyword(e.target.value);
        if (e.target.value !== "") {
            const newList = tasks.filter(item => UtilChangeToAlpha(item.title).includes(UtilChangeToAlpha(e.target.value)));
            // console.log(newList);
            setList(newList);
        }
        else setList(tasks)
    }

    const handleExpandAdd = () => {
        const newTask = document.querySelector(".task.new");
        if (newTask) newTask.classList.add("active");
    }

    return (
        <div className="todo-list">
            <div className="task-expand" onClick={handleExpandAdd}><i className="fas fa-plus-circle"></i></div>
            <div className="todo-list-wrap">
                <h3 className="title">To Do List</h3>

                <div className="todo-search">
                    <input type="text" name="search" placeholder="Search" value={keyword} onChange={handleSearch} />
                </div>
                <div className="todo-list-body">
                    <div className="list" onScroll={handleScroll}>
                        <ul className="list-wrap">

                            {list && renderList(list)}
                            {(!list || list.length <= 0) && <li className="list-item" id="no-task">You don't have any tasks</li>}
                        </ul>
                    </div>
                </div>

            </div>
            <div className="bulk-action">
                <div className="bulk-action-wrap">
                    <div className="buk-action-title">Bulk Action:</div>
                    <div className="bulk-action-btn">
                        <button className="btn btn-done">Done</button>
                        <button className="btn btn-remove" onClick={handleRemoveMultiTasks}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoList
