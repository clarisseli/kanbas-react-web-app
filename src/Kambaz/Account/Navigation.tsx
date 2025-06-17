import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
    const { pathname } = useLocation();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const links = currentUser
        ? [{ label: "Profile", path: "/Kambaz/Account/Profile" }]
        : [
            { label: "Signin", path: "/Kambaz/Account/Signin" },
            { label: "Signup", path: "/Kambaz/Account/Signup" },
        ];

    return (
        <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => (
                <Link
                    to={link.path}
                    key={link.label}
                    id={`wd-account-${link.label}`}
                    className={`list-group-item border-0 d-block ps-1 me-3 ${pathname.includes(link.label) ? "active wd-black-text" : "text-danger"}`}>
                    {link.label}
                </Link>
            ))}
            {currentUser && currentUser.role === "ADMIN" && (
                <Link
                    to={`/Kambaz/Account/Users`}
                    className={`list-group-item border-0 fs-5 d-block ps-1 me-3 ${pathname.includes("Users") ? "active wd-black-text" : "text-danger"}`}>
                    Users
                </Link>
            )}
        </div>
    );
}