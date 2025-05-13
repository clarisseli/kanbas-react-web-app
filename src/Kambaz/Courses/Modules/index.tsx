export default function Modules() {
    return (
        <div>
            {/* Implement Collapse All button, View Progress button, etc. */}
            <button>Collapse All</button>
            <button>View Progress</button>
            <select>
                <option>Publish All</option>
            </select>
            <button>+ Module</button>

            <ul id="wd-modules">
                {/* Week 1, Lecture 1 */}
                <li className="wd-module">
                    <div className="wd-title">
                        Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
                    </div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to the course</li>
                                <li className="wd-content-item">Learn what is Web Development</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">READING</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 1 - Introduction</li>
                                <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to Web Development</li>
                                <li className="wd-content-item">Creating an HTTP server with Node.js</li>
                                <li className="wd-content-item">Creating a React Application</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <br />

                {/* Week 1, Lecture 2 */}
                <li className="wd-module">
                    <div className="wd-title">
                        Week 1, Lecture 2 - Formatting User Interfaces with HTML
                    </div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn how to create user interfaces with HTML</li>
                                <li className="wd-content-item">Deploy the assignment to Netlify</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to HTML and the DOM</li>
                                <li className="wd-content-item">Formatting Web content with Headings and Paragraphs</li>
                                <li className="wd-content-item">Formatting content with Lists and Tables</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <br />

                {/* Week 2, Lecture 1 */}
                <li className="wd-module">
                    <div className="wd-title">
                        Week 2, Lecture 1 - Styling User Interfaces with CSS
                    </div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn how to style HTML using CSS</li>
                                <li className="wd-content-item">Understand the Box Model and CSS selectors</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">READING</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 3 - Styling User Interfaces with CSS</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Styling with CSS</li>
                                <li className="wd-content-item">The Box Model</li>
                                <li className="wd-content-item">Styling using Classes and IDs</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <br />

                {/* Week 2, Lecture 2 */}
                <li className="wd-module">
                    <div className="wd-title">
                        Week 2, Lecture 2 - Positioning and Responsive Web Design
                    </div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Understand how to position elements using CSS</li>
                                <li className="wd-content-item">Implement responsive layouts with Flexbox and Grid</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">CSS Positioning</li>
                                <li className="wd-content-item">Flexbox</li>
                                <li className="wd-content-item">CSS Grid</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}