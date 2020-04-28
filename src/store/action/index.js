import * as pk from "./pk/index";
import * as monitor from "./monitor/index";
import * as dataflow from "./dataflow/index";
import * as getDataflowset from "./dataflow/index";
import * as getStepData from "./dataflow/index";
import * as permission from "./permission/index";
import * as common from "./common/index"
import * as realtime from "./realtime/index"
import * as analyze from "./realtime/index"
import * as dataset from "./dataset/index"

import _ from "lodash";

export default _.assign(
  pk,
  monitor,
  dataflow,
  getDataflowset,
  getStepData,
  permission,
  common,
  realtime,
  analyze,
  dataset
);
