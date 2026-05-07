const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");


// ADMIN ONLY
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createTask
);


// ALL USERS
router.get(
    "/",
    authMiddleware,
    getTasks
);


// ADMIN + MEMBER
router.put(
    "/:id",
    authMiddleware,
    updateTaskStatus
);

// DELETE TASK
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteTask
);

module.exports = router;