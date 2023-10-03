import express, { Request, Response } from "express";
import database from "./database";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";
import verifyEmail from "./templates/verify-email-template";
import MailService from "./mailerService";
import dotenv from "dotenv";
import verifyOTP from "./templates/verify-otp-template";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.get("/getusers", async (req: Request, res: Response) => {
  const connection = await database;
  const [rows, fields] = await connection.execute(
    "SELECT * FROM USERS where is_admin NOT IN (1)"
  );
  const userInfo = rows as RowDataPacket[];
  return res.status(201).json(userInfo);
});

app.post("/user", async (req: Request, res: Response) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const token = uuidv4();
    const connection = await database;

    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE email = ?",
      [req.body.email]
    );
    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo) {
      return res.status(409).json({ message: "Account already exist." });
    }

    const result = await connection.execute(
      'INSERT INTO USERS (NAME, EMAIL, PASSWORD, GUID, IS_ADMIN, ACTIVE_USER) VALUES ("' +
        req.body.name +
        '", "' +
        req.body.email +
        '", "' +
        hash +
        '", "' +
        token +
        '", ' +
        req.body.is_admin +
        ", " +
        req.body.is_active +
        ") "
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});
function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
app.post("/login", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE email = ?",
      [req.body.email]
    );

    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo && userInfo.password) {
      const matchPassword = bcrypt.compareSync(
        req.body.password,
        userInfo.password
      );

      if (matchPassword === true) {
        const newOTP = generateOTP();
        const emailTemplate = verifyOTP(newOTP);
        const mailService = MailService.getInstance();
        await mailService.createConnection();
        await mailService.sendMail("1", {
          to: userInfo.email,
          subject: "OTP Requested",
          html: emailTemplate.html,
        });
        userInfo.otp = newOTP;
        return res.status(201).json({ userInfo });
      }
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/forgot", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE email = ?",
      [req.body.email]
    );

    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo) {
      const url = `${process.env.PUBLIC_DOMAIN}/reset-password?id=${userInfo.guid}`;
      const emailTemplate = verifyOTP(url);
      const mailService = MailService.getInstance();
      await mailService.createConnection();
      await mailService.sendMail("1", {
        to: userInfo.email,
        subject: "Reset Password",
        html: emailTemplate.html,
      });
      return res.status(201).json({ message: "email sent for reset password" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/update-password", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE guid = ?",
      [req.body.guid]
    );

    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo) {
      var salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const [rows, fields] = await connection.execute(
        `UPDATE USERS SET PASSWORD = '${hash}' where guid = '${req.body.guid}'`
      );
      return res.status(201).json({ message: "password updated" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/active-user", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE user_id = ?",
      [req.body.user_id]
    );

    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo) {
      const [rows, fields] = await connection.execute(
        `UPDATE USERS SET ACTIVE_USER = 1 where user_id = ${req.body.user_id}`
      );
      return res.status(201).json({ message: "User Activated" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/update-user", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute(
      "SELECT * FROM USERS WHERE user_id = ?",
      [req.body.user_id]
    );

    const userInfo = (rows as RowDataPacket[])[0];
    if (userInfo) {
      var salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const [rows, fields] = await connection.execute(
        `UPDATE USERS SET NAME = '${req.body.name}', PASSWORD = '${hash}' where user_id = ${req.body.user_id}`
      );
      return res.status(201).json({ message: "User Updated" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
