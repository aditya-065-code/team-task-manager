const db = require("../config/db");


// CREATE PROJECT
exports.createProject = (req, res) => {

    const { name, description } = req.body;

    // VALIDATION
    if (!name || !description) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const created_by = req.user.id;

    const sql = `
        INSERT INTO projects
        (
            name,
            description,
            created_by
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, description, created_by],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Project created successfully"
            });
        }
    );
};



// GET ALL PROJECTS
exports.getProjects = (req, res) => {

    const sql = `
        SELECT 
            projects.*,
            users.name AS created_by_name

        FROM projects

        JOIN users
        ON projects.created_by = users.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(results);
    });
};