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
        <div id="wd-account-navigation">
            {links.map((link) => (
                <Link to={link.path}
                    key={link.label}
                    id={`wd-account-${link.label}`}
                    className={`fs-5 wd-account-nav-link d-block mb-2 ps-1 me-3 ${pathname.includes(link.label) ? "active wd-black-text" : "text-danger"}`}> {link.label} </Link>
            ))}
        </div>
    );
}