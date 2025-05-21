import LessonControlButtons from "./LessonControlButtons";
import { ListGroup, Row, Col } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";

export default function Modules() {
    return (
        <div className="container-fluid" id="wd-modules-screen">
            <Row>
                <Col xs={12}>
                    <ModulesControls />
                </Col>
            </Row>
            <Row className="pt-4">
                <Col xs={12}>
                    <ListGroup className="rounded-0" id="wd-modules">
                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <span>Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <ModuleControlButtons />
                                </div>
                            </div>
                            <ListGroup className="wd-lessons rounded-0">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            LEARNING OBJECTIVES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Introduction to the course</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Learn what is Web Development</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            READING
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Full Stack Developer - Chapter 1 - Introduction</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            SLIDES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Introduction to Web Development</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Creating an HTTP server with Node.js</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Creating a React Application</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>


                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <span>Week 1, Lecture 2 - Formatting User Interfaces with HTML</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <ModuleControlButtons />
                                </div>
                            </div>

                            <ListGroup className="wd-lessons rounded-0">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            LEARNING OBJECTIVES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Learn how to create user interfaces with HTML</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Deploy the assignment to Netlify</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            SLIDES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Introduction to HTML and the DOM</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Formatting Web content with Headings and Paragraphs</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Formatting content with Lists and Tables</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>

                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <span>Week 2, Lecture 1 - Styling User Interfaces with CSS</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <ModuleControlButtons />
                                </div>
                            </div>
                            <ListGroup className="wd-lessons rounded-0">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            LEARNING OBJECTIVES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Learn how to style HTML using CSS</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Understand the Box Model and CSS selectors</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            READING
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Full Stack Developer - Chapter 3 - Styling User Interfaces with CSS</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            SLIDES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Styling with CSS</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">The Box Model</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Styling using Classes and IDs</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>

                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <span>Week 2, Lecture 2 - Positioning and Responsive Web Design</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <ModuleControlButtons />
                                </div>
                            </div>
                            <ListGroup className="wd-lessons rounded-0">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            LEARNING OBJECTIVES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Understand how to position elements using CSS</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Implement responsive layouts with Flexbox and Grid</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            SLIDES
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">CSS Positioning</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">Flexbox</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <span className="ms-4">CSS Grid</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <LessonControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
}
