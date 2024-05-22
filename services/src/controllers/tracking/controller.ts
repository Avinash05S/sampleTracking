import { TController } from "@shared/types";
import { v4 as uuid } from "uuid";
import DB from "../../shared/db";
import { PayloadMismatch } from "../../shared/error";

const db = DB.knex();
const payloadErr = " Please Ensure Payload contains title";

export const Upsert: TController = async (req, res, next) => {
  try {
    const { tracking_id, ...rest } = req.body;

    if (!tracking_id && !rest.title)
      throw new PayloadMismatch(payloadErr, { cause: " Tracking -> Upsert" });

    let payload = req.body;
    if (!tracking_id) {
      payload = {
        ...payload,
        tracking_id: uuid(),
      };
    }

    await db("tracking").insert(payload).onConflict("tracking_id").merge();
    res
      .status(200)
      .send(tracking_id ? "Tracking Data Updated" : "Tracking Data Added");
  } catch (err: any) {
    res.send(err?.message || err);
  }
};

export const getTrackingList: TController = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(
        await db("tracking").select(["tracking_id", "title", "description"])
      );
  } catch (err) {
    next(err);
  }
};
