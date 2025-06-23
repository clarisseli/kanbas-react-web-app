import { Form, Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function QuizControls({
    searchTerm,
    setSearchTerm
}: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}) {
    const { cid } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const handleAddQuiz = () => {
        const newQuizId = `Q${Date.now()}`;
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuizId}`);
    };

    return (
        <div id="wd-quiz-controls" className="wd-row-center justify-content-between gap-3 w-100 flex-wrap">
            <div className="position-relative flex-grow-1">
                <Form.Control
                    id="wd-search-quiz"
                    size="lg"
                    placeholder="Search for Quiz"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5 py-2"
                />
                <IoIosSearch className="fs-4 position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            </div>

            {currentUser && currentUser.role === "FACULTY" && (
                <div className="d-flex gap-2">
                    <Button
                        variant="danger"
                        id="wd-add-quiz"
                        size="lg"
                        className="px-3 flex-shrink-0"
                        onClick={handleAddQuiz}
                    >
                        <FiPlus className="fs-4 me-1" />
                        Quiz
                    </Button>
                    <Button variant="light" size="lg" className="px-3 flex-shrink-0">
                        <IoEllipsisVertical className="fs-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}