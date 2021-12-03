import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from '../constant';
import axios from 'axios';
import { signIn } from '../reducer/userReducer';
import { addAllTasks } from '../reducer/taskReducer';

function SignForm() {

    const { handleSubmit, register, formState: { errors }, watch } = useForm({ mode: "all", defaultValues: {
        username: "megazord",
        password: "123456"
    } });

    const dispatch = useDispatch();
    const formRef = useRef();

    const [mode, setMode] = useState("Sign In");
    const user = useSelector(state => state.user);

    const onSubmit = async (data) => {
        // console.log(data);
        const url = BASE_URL || "http://localhost:1368/api/user";
        try {
            let response = null;

            if (mode === "Sign Up") {
                response = await axios.post(`${url}/register`, data);
            }
            else {
                response = await axios.post(`${url}/login`, data);
            }
            // console.log(response.data);

            if (response.data.success) {
                dispatch(signIn(response.data.user));
                dispatch(addAllTasks(response.data.user.list));
                if (formRef) formRef.current.classList.remove("active"); 
            }
            else {
                const errorE = document.querySelector(".response-error");
                if (errorE) errorE.textContent = response.data.message;
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const password = useRef(watch("password", ""));
    password.current = watch("password", "");

    const handleWithoutLogin = () => {
        if (formRef) formRef.current.classList.remove("active");
    }

    return (
        <div className={`form ${(user && user.username) ? "" : "active"}`} ref={formRef}>
            <div className="form-wrap">
                <form id="form" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-heading">
                        <div className={`form-heading-item ${mode === "Sign In" ? "active" : ""}`} onClick={() => setMode("Sign In")} >Sign In</div>
                        <div className={`form-heading-item ${mode === "Sign Up" ? "active" : ""}`} onClick={() => setMode("Sign Up")} >Sign Up</div>
                        <div className={`form-heading-item test`} onClick={handleWithoutLogin}>For Testing</div>
                    </div>

                    <div className="error response-error"></div>

                    <div className="form-group">
                        <div className="group-title">Username</div>
                        <input type="text" {...register("username", {
                            required: "This field is required",
                            minLength: { value: 4, message: "The least is 4 characters" },
                            maxLength: { value: 15, message: "The maximum is 15 characters" },
                        })} />
                        <div className="error error-username">
                            {errors && errors.username && errors.username.message}
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="group-title">Password</div>
                        <input type="password"
                            {...register("password", {
                                required: "This field is required",
                                minLength: { value: 6, message: "The least is 4 characters" },
                                maxLength: { value: 15, message: "The maximum is 15 characters" },
                            })}
                        />
                        <div className="error error-password">
                            {errors && errors.password && errors.password.message}
                        </div>
                    </div>

                    {mode === "Sign Up" && <div className="form-group">
                        <div className="group-title">Confirm Password</div>
                        <input type="password"
                            {...register("confirm", {
                                required: "This field is required",
                                validate: value => value === password.current || "Incorrect passowrd"
                            })}
                        />
                        <div className="error error-password">
                            {errors && errors.confirm && errors.confirm.message}
                        </div>
                    </div>}

                    <button type="submit">{mode}</button>

                </form>
            </div>
        </div>
    )
}

export default SignForm
