import React from "react";

import Tool from "../Tool";
import polygonIcon from "../../../../../assets/paint/polygon.png";

const Polygon = () => {
  return <Tool icon={polygonIcon} toolType="poly" data-test="tool" />;
};

export default Polygon;
