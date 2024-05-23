import { TController } from "@shared/types";
import DB from "../../shared/db";
import { PayloadMismatch } from "../../shared/error";
import { v4 as uuid } from "uuid";

const db = DB.knex();

export const Create: TController = async (req, res, next) => {
  try {
    const { tracking_input_data_id, data, tracking_id, node_id } = req.body;
    const payload = {
      ...req.body,
      tracking_id,
      node_id,
      data: JSON.stringify(data),
    };

    if (!tracking_input_data_id) {
      payload["tracking_input_data_id"] = uuid();
    }
    const [{ target_node } = { target_node: null }] = await db("connections")
      .select("target_node")
      .where({ tracking_id, source_node: node_id });

    await db.transaction(async (trx) => {
      if (target_node) {
        await trx("node")
          .update({ initiated: true })
          .where({ node_id: target_node });
      }

      await trx("tracking_input_data")
        .insert(payload)
        .onConflict("tracking_input_data")
        .merge();
    });

    res.status(200).send("Request Sent Successfully");
  } catch (err) {
    next(err);
  }
};
