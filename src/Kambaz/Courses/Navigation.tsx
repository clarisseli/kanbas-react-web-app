import { NavLink } from "react-router-dom";
import { useParams } from "react-router";



export default function CourseNavigation() {
    const { cid } = useParams();

    const links = [
        { label: "Home", id: "home" },
        { label: "Modules", id: "modules" },
        { label: "Piazza", id: "piazza" },
        { label: "Zoom", id: "zoom" },
        { label: "Assignments", id: "assignments" },
        { label: "Quizzes", id: "quizzes" },
        { label: "Grades", id: "grades" },
        { label: "People", id: "people" },
    ];

    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map(({ label, id }) => (
                <NavLink
                    key={id}
                    to={`/Kambaz/Courses/${cid}/${label}`}
                    id={`wd-course-${id}-link`}
                    className={({ isActive }) =>
                        `list-group-item border-0 ${isActive ? "active" : "text-danger"}`
                    }
                >
                    {label}
                </NavLink>
            ))}
        </div>
    );
}