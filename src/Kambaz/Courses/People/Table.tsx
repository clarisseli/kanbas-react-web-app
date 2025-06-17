import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PeopleDetails from "./Details";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    return (
        <div className="container-fluid overflow-auto" id="wd-people-table">
            {currentUser.role === "ADMIN" && <PeopleDetails />}
            <div className="table-responsive">
                <Table striped>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Login ID</th>
                            <th>Section</th>
                            <th>Role</th>
                            <th>Last Activity</th>
                            <th>Total Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .map((user: any) => (
                                <tr key={user._id}>
                                    <td className="wd-full-name text-nowrap">
                                        <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                                            <FaUserCircle className="me-2 fs-1 text-secondary" />
                                            <span className="wd-first-name text-danger">{user.firstName}</span>
                                            <span className="wd-last-name text-danger"> {user.lastName}</span>
                                        </Link>
                                    </td>
                                    <td className="wd-login-id">{user.loginId}</td>
                                    <td className="wd-section">{user.section}</td>
                                    <td className="wd-role">{user.role}</td>
                                    <td className="wd-last-activity">{user.lastActivity}</td>
                                    <td className="wd-total-activity">{user.totalActivity}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div >
    );
}