import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";

export default function Profile() {
    return (
        <div id="wd-profile-screen">
            <h3>Profile</h3>
            <Form.Control id="wd-username" value="alice" placeholder="username" className="mb-2" />
            <Form.Control id="wd-password" value="123" placeholder="password" type="password" className="mb-2" />
            <Form.Control id="wd-firstname" value="Alice" placeholder="First Name" className="mb-2" />
            <Form.Control id="wd-lastname" value="Wonderland" placeholder="Last Name" className="mb-2" />
            <Form.Control id="wd-dob" value="2000-01-01" type="date" className="mb-2" />
            <Form.Control id="wd-email" value="alice@wonderland" type="email" className="mb-2" />
            <Form.Select id="wd-role" className="mb-2">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
            </Form.Select>
            <Link to="/Kambaz/Account/Signin" className="btn btn-danger w-100 text-white" >Sign out</Link>
        </div>
    );
}
