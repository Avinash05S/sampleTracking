import { TController } from "@shared/types";
import DB from "../../shared/db";
import { PayloadMismatch } from "../../shared/error";

const db = DB.knex();

const userListColumns = ["user_id", "name", "email"];
const userVerifyColumns = ["user_id", "name", "password", "email"];
const payloadErr = "Please Ensure Payload Contains email and password";
const noUserErr = "No User Found";
const pwdErr = "Password Mismatch";

export const getUserList: TController = async (req, res, next) => {
  try {
    res.status(200).json(await db("user").select(userListColumns));
  } catch (err) {
    next(err);
  }
};

export const userVerify: TController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new PayloadMismatch(payloadErr, { cause: "user: userVerify " });

    const userData = await db("user")
      .select(userVerifyColumns)
      .where({ email });

    if (!userData.length) throw new Error(noUserErr);

    const { password: pwd = "" } = userData[0];
    if (password !== pwd) throw new Error(pwdErr);

    res.status(200).json(userData[0]);
  } catch (err: any) {
    res.status(400).json(err.message || err);
  }
};
