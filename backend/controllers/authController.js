const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================

exports.signup = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        // VALIDATION
        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // EMAIL VALIDATION
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // PASSWORD VALIDATION
        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        // HASH PASSWORD
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // INSERT USER
        const sql = `
            INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                hashedPassword,
                role || "member"
            ],
            (err, result) => {

                if (err) {

                    // DUPLICATE EMAIL
                    if (
                        err.code === "ER_DUP_ENTRY"
                    ) {

                        return res.status(400).json({
                            message:
                                "Email already exists"
                        });
                    }

                    return res.status(500).json(err);
                }

                return res.status(201).json({
                    message:
                        "User registered successfully"
                });
            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= LOGIN =================

exports.login = (req, res) => {

    try {

        const { email, password } = req.body;

        // VALIDATION
        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const sql =
            "SELECT * FROM users WHERE email = ?";

        db.query(
            sql,
            [email],
            async (err, results) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json(err);
                }

                // USER NOT FOUND
                if (results.length === 0) {

                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                const user = results[0];

                // PASSWORD MATCH
                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!isMatch) {

                    return res.status(400).json({
                        message:
                            "Invalid credentials"
                    });
                }

                // GENERATE TOKEN
                const token = jwt.sign(
                    {
                        id: user.id,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "7d"
                    }
                );

                return res.json({
                    token
                });
            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};