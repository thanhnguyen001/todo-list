import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Css/Task.css';
import moment from 'moment';
import useClickOutside from '../hooks/useClickOutside';
import { useDispatch } from 'react-redux';
import { addOrUpdateTask, removeTask } from '../reducer/taskReducer';


function NewTask(props) {

    const { item, index = -1 } = props;

    const dispatch = useDispatch();

    const [priority, setPriority] = useState("Normal");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(item ? moment(item.dueDate).toDate() : new Date());
    const calendarRef = useRef();
    const checkboxRef = useRef();
    useClickOutside(calendarRef);

    useEffect(() => {
        if (checkboxRef.current) checkboxRef.current.checked = false;
        if (item) {
            setTitle(item.title);
            setDescription(item.description);
            const dueDateItem = moment(moment(item.dueDate).toDate()).format("YYYY-MM-DD");
            const today = moment(new Date()).format("YYYY-MM-DD");
            if (moment(dueDateItem).isBefore(moment(today))) {
                setPriority("Expired");
            }
            else setPriority(item.priority);
        }
    }, [item])

    // HandleTitle
    const handleTitle = (e) => {
        setTitle(e.target.value);
        if (e.target.value !== "") {
            const error = document.querySelector(`.task[tabindex="${index}"] .error`);
            error.textContent = "";
        }
    }

    // Handle due date
    const handleDate = (value) => {
        const dueDate = document.getElementById("due-date");
        if (dueDate) {
            const newDueDate = moment(value);
            if (newDueDate.isBefore(moment(new Date()))) {
                alert("Invalid due date, today is " + moment(new Date()).format("L"));
                return;
            }
            dueDate.textContent = moment(value).format("DD MMM YYY");
            setDate(value)
            handleShowCalendar(true);
        }
    }

    const handleShowCalendar = (isClose) => {
        const calendar = document.querySelector(`.task[tabindex="${index}"] .calendar`);
        if (calendar) {
            if (isClose) {
                calendar.classList.remove("active");
                return;
            }
            calendar.classList.add("active");
        }
    }

    // Handle Priority
    const handleClickPriority = () => {
        const icons = document.querySelectorAll(".task-priority-wrap i");
        if (icons && icons.length > 0) {
            icons[0].classList.toggle("active");
            icons[1].classList.toggle("active");
        }
    }

    const handleShowDetail = (e) => {
        const taskWrap = e.target.closest(".task.item");
        const listItem = taskWrap.querySelector(".task-body-wrap");
        if (listItem) {
            e.target.textContent === "Less" ? e.target.textContent = "Detail" : e.target.textContent = "Less";
            listItem.classList.toggle("active");
        }
    }

    const handleShowBulkAction = (e) => {
        const isChecked = e.target.value;
        if (isChecked) {
            const bulkAction = document.querySelector(".bulk-action");
            const listElement = document.querySelector(".list");
            if (listElement) listElement.style.maxHeight = `calc(100vh - 190px - 75px)`
            if (bulkAction) bulkAction.classList.add("active");
        }
    }
    // handleTask
    const handleAddOrUpdateTask = () => {
        const error = document.querySelector(`.task[tabindex="${index}"] .error`);
        if (!title) {
            if (error) error.textContent = "This field is required!";
            return;
        }
        dispatch(addOrUpdateTask({
            id: item ? item.id : -1, title, description, dueDate: moment(date).toISOString(), priority, isUpdate: item ? true : false
        }));
        if (item) return;
        setTitle("");
        setDescription("");
        setPriority("Normal");
        setDate(new Date());
    }

    const handleRemoveTask = () => {
        dispatch(removeTask(item));
    }

    const handleExpandAdd = () => {
        const newTask = document.querySelector(".task.new");
        if (newTask) newTask.classList.remove("active");
    }

    return (
        <div className={`task ${item ? "item" : "new"}`} tabIndex={index}>
            {!item && <div className="task-expand" onClick={handleExpandAdd}><i className="fas fa-chevron-circle-left"></i></div>}
            <div className="task-wrap">
                {item && <div className="task-heading">
                    <div className="task-heading-checkbox">
                        <input type="checkbox" onChange={handleShowBulkAction} ref={checkboxRef} />
                        <div className={`task-heading-title ${priority === "Expired" ? "Expired" : ""}`}>{item ? item.title : ""}</div>
                    </div>
                    <div className="task-heading-action">
                        <button className="btn btn-detail" onClick={handleShowDetail}>Detail</button>
                        <button className="btn btn-remove" onClick={handleRemoveTask}>Remove</button>
                    </div>
                </div>}

                {!item && <h3 className="title">New Task</h3>}

                <div className="task-body-wrap">

                    <div className={`task-body ${item ? "" : ""}`}>
                        <div className="task-input">
                            <input type="text" placeholder="Add new task" value={title} onChange={handleTitle} />
                        </div>

                        <div className="error error-title"></div>

                        <div className="task-description">
                            <div className="sub-title">Description</div>
                            <textarea className="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="task-primacy">
                            <div className="task-due-date">
                                <div className="sub-title">Due Date</div>
                                <div className="task-due-date-body" onClick={() => handleShowCalendar(false)}>
                                    <div id="due-date" >{item ? moment(item.dueDate).format('DD MMM YYYY') : moment(date).format('DD MMM YYYY')}</div>
                                    <i className="fas fa-calendar-alt"></i>
                                    <div className="calendar" ref={calendarRef}>
                                        <Calendar
                                            onChange={(value, e) => handleDate(value, e)}
                                            value={date}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="task-priority">
                                <div className="sub-title">Priority</div>
                                <div className="task-priority-wrap">
                                    <select className={`priority ${priority}`} value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        onClick={handleClickPriority}
                                    >
                                        <option className="priority-item" value="Low">Low</option>
                                        <option className="priority-item" value="Normal">Normal</option>
                                        <option className="priority-item" value="High">High</option>

                                        {item && <option className="priority-item expired" value="Expired">Expired</option>}

                                    </select>
                                    <i className="fas fa-caret-down active"></i>
                                    <i className="fas fa-caret-up"></i>
                                </div>
                            </div>
                        </div>


                        <button className="btn btn-add" onClick={handleAddOrUpdateTask}>{`${item ? "Update" : "Add"}`}</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewTask
