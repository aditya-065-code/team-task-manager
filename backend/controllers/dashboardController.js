const db = require("../config/db");

exports.getDashboard = (req, res) => {

    const totalTasksQuery =
        "SELECT COUNT(*) AS totalTasks FROM tasks";

    const completedTasksQuery =
        "SELECT COUNT(*) AS completedTasks FROM tasks WHERE status='Completed'";

    const pendingTasksQuery =
        "SELECT COUNT(*) AS pendingTasks FROM tasks WHERE status='Pending'";

    const overdueTasksQuery =
        `SELECT COUNT(*) AS overdueTasks
         FROM tasks
         WHERE due_date < CURDATE()
         AND status != 'Completed'`;

    db.query(totalTasksQuery, (err, totalResult) => {

        if (err) return res.status(500).json(err);

        db.query(completedTasksQuery, (err, completedResult) => {

            if (err) return res.status(500).json(err);

            db.query(pendingTasksQuery, (err, pendingResult) => {

                if (err) return res.status(500).json(err);

                db.query(overdueTasksQuery, (err, overdueResult) => {

                    if (err) return res.status(500).json(err);

                    res.json({
                        total_tasks:
                            totalResult[0].totalTasks,

                        completed_tasks:
                            completedResult[0].completedTasks,

                        pending_tasks:
                            pendingResult[0].pendingTasks,

                        overdue_tasks:
                            overdueResult[0].overdueTasks
                    });

                });

            });

        });

    });

};