type node = {
  node_id: string;
  title: string;
  default_id: string;
  tracking_id: string;
  incharge_id: string;
  initiated: boolean;
};

type connections = {
  connection_id: string;
  tracking_id: string;
  source_node: string;
  target_node: string;
};

type form_data = {
  form_id: string;
  label: string;
  data: string;
  variable_name: string;
  data_type: string;
  lookup_id: string;
  node_id: string;
  required: boolean;
  is_form: boolean;
};

type tracking = {
  tracking_id: string;
  title: string;
  description: string;
};

type tracking_input_data = {
  tracking_input_data_id: string;
  tracking_id: string;
  node_id: string;
  data: Record<string, any>;
};
