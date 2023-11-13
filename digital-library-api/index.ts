import express, { Request, Response } from "express";
import database from "./database";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";
import verifyEmail from "./templates/verify-email-template";
import MailService from "./mailerService";
import ElasticSearchClient from "./elastic-search";
import dotenv from "dotenv";
import verifyOTP from "./templates/verify-otp-template";
import cors from "cors";

import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { EDT } from "./edt";

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

const IngestEDTData = async (data: any) => {
  const connection = await database;
  const query =
    "INSERT INTO edt_data (edtid, title, author, year, university, program, degree, advisor, abstract, pdf, wikifier_terms) VALUES ?";
  const result = await connection.query(query, [data]);
  console.log(result);
};

const wikifierText = async (text: string) => {
  try {
    const response = await fetch("http://www.wikifier.org/annotate-article", {
      method: "POST",
      body: new URLSearchParams({
        text: text,
        userKey: "qicclugaocdekxkxsgdoaqbunmqbbg",
        lang: "en",
        pageRankSqThreshold: "0.9",
        applyPageRankSqThreshold: "true",
        nTopDfValuesToIgnore: "200",
        nWordsToIgnoreFromList: "200",
        wikiDataClasses: "true",
        wikiDataClassIds: "false",
        support: "true",
        ranges: "false",
        minLinkFrequency: "2",
        includeCosines: "false",
        maxMentionEntropy: "3",
      }),
    });
    const data = await response.json();
    return JSON.stringify(data.annotations);
  } catch (err: any) {
    return "";
  }
};

app.post("/post-data", async (req: Request, res: Response) => {
  try {
    const connection = await database;
    const [rows, fields] = await connection.execute("SELECT * FROM edt_data;");
    await connection.execute("DELETE FROM edt_data;");
    const result = rows as RowDataPacket[];

    if (result.length <= 0) {
      let edtarray: any = [];

      const processFile = async () => {
        const records: any = [];
        const parser = fs
          .createReadStream(`${__dirname}/edt/metadata_abstract.csv`)
          .pipe(
            parse({
              delimiter: ",",
              from_line: 2,
            })
          );
        for await (const record of parser) {
          // Work with each record
          //edtid, title, author, year, university, program, degree, advisor, abstract, pdf, wikifier_terms
          records.push([
            record[0],
            record[5],
            record[2],
            record[7],
            record[6],
            record[4],
            record[3],
            record[1],
            record[8],
          ]);
        }
        return records;
      };

      edtarray = await processFile();

      edtarray = await Promise.all(
        edtarray.map(async (item: any) => {
          const wikifierterms = await wikifierText(item[8]);
          return [...item, `${item[0]}.pdf`, wikifierterms];
        })
      );

      await IngestEDTData(edtarray);
    }

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/index-documents", async (req: Request, res: Response) => {
  const esClient = new ElasticSearchClient();
  const connection = await database;
  const [rows, fields] = await connection.execute("SELECT * FROM edt_data;");
  const edtArray = rows as EDT[];
  await esClient.createBulkIndexes(edtArray);
  return res.status(201).json({ message: "indexes created..." });
});

app.get("/query-documents", async (req: Request, res: Response) => {
  const esClient = new ElasticSearchClient();
  const searchTerm = String(req.query["query"]);
  const result = await esClient.searchIndexes(searchTerm);
  return res.status(201).json({ message: "indexes created...", data: result });
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
      const url = `${process.env.PUBLIC_DOMAIN}?id=${userInfo.guid}`;
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
