const bcrypt = require("bcryptjs");
const db = require("./db");

const password = "Cabwise@123";

const hashedPassword = bcrypt.hashSync(password, 10);

const sql = `
    UPDATE users
    SET password = ?
    WHERE email = ?
`;

db.query(
    sql,
    [hashedPassword, "owner@cabwise.com"],
    (err, result) => {
        if (err) {
            console.log("Password update failed:", err.message);
            return;
        }

        console.log("Password updated successfully");
        console.log("Login Email: owner@cabwise.com");
        console.log("Login Password: Cabwise@123");

        db.end();
    }
);