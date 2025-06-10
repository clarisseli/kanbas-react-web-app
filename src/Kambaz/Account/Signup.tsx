import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Button, Form } from "react-bootstrap";
export default function Signup() {
    const [user, setUser] = useState<any>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signup = async () => {
        const currentUser = await client.signup(user);
        dispatch(setCurrentUser(currentUser));
        navigate("/Kambaz/Account/Profile");
    };
    return (
        <div id="wd-signup-screen">
            <h3>Sign up</h3>
            <Form.Control placeholder="username" className="wd-username d-block mb-2" onChange={(e) => setUser({ ...user, username: e.target.value })} />
            <Form.Control placeholder="password" type="password" className="wd-password mb-2 d-block" onChange={(e) => setUser({ ...user, password: e.target.value })} />
            <Button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </Button><br />
            <Link to="/Kambaz/Account/Signin">Sign in</Link>
        </div>

    );
}