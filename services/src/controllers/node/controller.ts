import { TController } from "../../shared/types";
import { PayloadMismatch } from "../../shared/error";
import DB from "../../shared/db";
import { v4 } from "uuid";

const db = DB.knex();
const payloadErr = "Please ensure payload contains tracking_id";

export const getNodes: TController = async (req, res, next) => {
  try {
    const { tracking_id } = req.query;
    if (!tracking_id)
      throw new PayloadMismatch(payloadErr, { cause: "Node -> getNodes" });

    const Nodes = await db("node").select("*").where({ tracking_id });
    const defaultNodes = [];
    const mappingNodes = [];
    const defaultNodeIds = [];
    for (const node of Nodes) {
      if (node.default_id) {
        mappingNodes.push(node);
      } else {
        defaultNodes.push(node);
        defaultNodeIds.push(node.node_id);
      }
    }
    const [formData, connections] = await Promise.all([
      await db("form_data").select("*").whereIn("node_id", defaultNodeIds),
      await db("connections").select("*").where({ tracking_id }),
    ]);
    const formDataStructured: any = {};
    for (const data of formData) {
      if (!formDataStructured[data.node_id as string])
        formDataStructured[data.node_id as string] = [];
      formDataStructured[data.node_id as string].push(data);
    }
    res
      .status(200)
      .json({
        defaultNodes,
        mappingNodes,
        connections,
        formData: formDataStructured,
      });
  } catch (err: any) {
    res.send(err.message || err);
  }
};

export const getNodeForm: TController = async (req, res, next) => {
  try {
    const { node_id } = req.query;
    if (!node_id)
      throw new PayloadMismatch("Please Ensure Payload Contains node_id", {
        cause: "Node -> getNodeForm",
      });

    res.send(
      await db("form_data")
        .select(["form_id", "label", "data_type", "required"])
        .where({ is_form: true })
    );
  } catch (err: any) {
    res.send(err.message || err);
  }
};

export const defaultNodeCreate: TController = async (req, res, next) => {
  try {
    const { node_id } = req.body;
    let payload = req.body;
    if (!node_id) {
      payload = {
        ...payload,
        node_id: v4(),
      };
    }
    await db("node").insert(payload).onConflict("node_id").merge();

    res.status(200).send(node_id ? "Node Data Updated" : "Node Created");
  } catch (err) {
    next(err);
  }
};

type reqBody = {
  nodes: {
    node_id: string;
    title: string;
    incharge_id: string;
    tracking_id: string;
    [key: string]: string;
  }[];
  connections: {
    source_node: string;
    target_node: string;
    tracking_id: string;
    connection_id: string;
  }[];
  removedNodes: string[];
  removedConnections: string[];
};

export const mappingNodeCreate: TController = async (req, res, next) => {
  try {
    const {
      nodes = [],
      connections,
      removedNodes,
      removedConnections,
    } = req.body as reqBody;
    const nodePayload = nodes.map(
      ({ incharge_id, node_id, title, tracking_id }) => ({
        incharge_id,
        node_id,
        title,
        tracking_id,
      })
    );
    const connectionPayload = connections.map(
      ({ connection_id, source_node, target_node, tracking_id }) => ({
        connection_id,
        source_node,
        target_node,
        tracking_id,
      })
    );

    await db.transaction(async (trx) => {
      const promises = [];
      if (nodePayload.length) {
        promises.push(await trx("node").insert(nodePayload));
      }
      if (connectionPayload.length) {
        promises.push(await trx("connections").insert(connectionPayload));
      }
      removedConnections.forEach(async (connection_id) => {
        promises.push(
          await trx("connections").where({ connection_id }).delete()
        );
      });
      removedNodes.forEach(async (node_id) => {
        promises.push(await trx("node").where({ node_id }).delete());
      });

      await Promise.all(promises);
    });
    res.send("Data Successfully Updated");
  } catch (err: any) {
    res.send(err.message || err);
  }
};
