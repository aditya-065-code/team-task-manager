const db = require("../config/db");


// CREATE TASK
exports.createTask = (req, res) => {

    const {
        title,
        description,
        due_date,
        project_id,
        assigned_to
    } = req.body;

    const created_by = req.user.id;

    // VALIDATION
    if (
        !title ||
        !description ||
        !due_date ||
        !project_id ||
        !assigned_to
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO tasks
        (
            title,
            description,
            due_date,
            project_id,
            assigned_to,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            due_date,
            project_id,
            assigned_to,
            created_by
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Task created successfully"
            });
        }
    );
};



// GET ALL TASKS
exports.getTasks = (req, res) => {

    const sql = `
        SELECT 
            tasks.*,
            users.name AS assigned_user,
            projects.name AS project_name

        FROM tasks

        LEFT JOIN users
        ON tasks.assigned_to = users.id

        LEFT JOIN projects
        ON tasks.project_id = projects.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};



// UPDATE TASK STATUS
exports.updateTaskStatus = (req, res) => {

    const { status } = req.body;

    const taskId = req.params.id;

    // VALID STATUS
    const validStatus = [
        "Pending",
        "In Progress",
        "Completed"
    ];

    // VALIDATION
    if (!validStatus.includes(status)) {

        return res.status(400).json({
            message:
                "Status must be Pending, In Progress, or Completed"
        });
    }

    const sql = `
        UPDATE tasks
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, taskId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                message: "Task status updated"
            });
        }
    );
};

// DELETE TASK
exports.deleteTask = (req, res) => {

    const taskId = req.params.id;

    const sql = `
        DELETE FROM tasks
        WHERE id = ?
    `;

    db.query(
        sql,
        [taskId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                message: "Task deleted successfully"
            });
        }
    );
};