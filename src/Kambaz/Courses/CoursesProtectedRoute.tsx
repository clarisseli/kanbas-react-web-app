import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router";

export default function ProtectedCourseRoute({ children }: { children: any }) {
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { cid } = useParams();

    const isEnrolled = enrollments.some(
        (enrollment: any) => enrollment.user === currentUser._id && enrollment.course === cid
    );
    if (!isEnrolled) {
        return <Navigate to="/Kambaz/Dashboard" />;
    }
    return children;
}

