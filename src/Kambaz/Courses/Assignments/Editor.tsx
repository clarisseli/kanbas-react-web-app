export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <h2>Assignment Name</h2>
            <input id="wd-name" value="A1 - ENV + HTML" style={{ width: "100%" }} /><br /><br />

            <textarea
                id="wd-description"
                rows={6}
                cols={60}
                style={{ width: "100%", display: "block" }}
            >
                The assignment is available online. Submit a link to the landing page of your Web
                application running on Netlify. The landing page should include the following:
                Your full name and section
                Links to each of the lab assignments
                Link to the Kanbas application
                Links to all relevant source code repositories
                The Kanbas application should include a link to navigate back to the landing page.
            </textarea>

            <br />

            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "180px" }} align="right" valign="top">
                            <label htmlFor="wd-points">Points</label>
                        </td>
                        <td><input id="wd-points" type="number" value={100} style={{ width: "100%" }} /></td>
                    </tr>

                    <tr><td colSpan={2}><br /></td></tr>

                    <tr>
                        <td align="right"><label htmlFor="wd-group">Assignment Group</label></td>
                        <td>
                            <select id="wd-group" style={{ width: "100%" }}>
                                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            </select>
                        </td>
                    </tr>

                    <tr><td colSpan={2}><br /></td></tr>

                    <tr>
                        <td align="right"><label htmlFor="wd-display-grade-as">Display Grade as</label></td>
                        <td>
                            <select id="wd-display-grade-as" style={{ width: "100%" }}>
                                <option value="Percentage">Percentage</option>
                                <option value="Points">Points</option>
                                <option value="Letter Grade">Letter Grade</option>
                            </select>
                        </td>
                    </tr>

                    <tr><td colSpan={2}><br /></td></tr>

                    <tr>
                        <td align="right" valign="top"><label htmlFor="wd-submission-type">Submission Type</label></td>
                        <td>
                            <select id="wd-submission-type" style={{ width: "100%" }}>
                                <option value="Online">Online</option>
                            </select>
                            <br /><br />
                            Online Entry Options<br />
                            <label htmlFor="wd-text-entry">
                                <input id="wd-text-entry" type="checkbox" /> Text Entry
                            </label><br />
                            <label htmlFor="wd-website-url">
                                <input id="wd-website-url" type="checkbox" /> Website URL
                            </label><br />
                            <label htmlFor="wd-media-recordings">
                                <input id="wd-media-recordings" type="checkbox" /> Media Recordings
                            </label><br />
                            <label htmlFor="wd-student-annotation">
                                <input id="wd-student-annotation" type="checkbox" /> Student Annotation
                            </label><br />
                            <label htmlFor="wd-file-upload">
                                <input id="wd-file-upload" type="checkbox" /> File Uploads
                            </label>
                        </td>
                    </tr>

                    <tr><td colSpan={2}><br /></td></tr>

                    <tr>
                        <td align="right" valign="top">Assign</td>
                        <td>
                            <label htmlFor="wd-assign-to">Assign to</label><br />
                            <input id="wd-assign-to" value="Everyone" style={{ width: "100%" }} /><br /><br />

                            <label htmlFor="wd-due-date">Due</label><br />
                            <input id="wd-due-date" type="date" value="2024-05-13" style={{ width: "100%" }} /><br /><br />

                            <table style={{ width: "100%" }}>
                                <tbody>
                                    <tr>
                                        <td><label htmlFor="wd-available-from">Available from</label></td>
                                        <td><label htmlFor="wd-available-until">Until</label></td>
                                    </tr>
                                    <tr>
                                        <td><input id="wd-available-from" type="date" value="2024-05-06" style={{ width: "100%" }} /></td>
                                        <td><input id="wd-available-until" type="date" value="2024-05-20" style={{ width: "100%" }} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button>Cancel</button>
                <button>Save</button>
            </div>
        </div>
    );
}