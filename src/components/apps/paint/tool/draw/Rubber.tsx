import React, { Component } from "react";

import Tool from "../Tool";
import Vector from "../../../../../classes/Vector";
import withContext from "../../../../../hoc/withContext";
import { PaintContextType } from "ContextType";
import { fillRect, fillSpaceBetweenPoints } from "../../../../../utils/paint";

import rubberIcon from "../../../../../assets/paint/rubber.png";

type CtxProps = {
  paint: PaintContextType;
};

type State = {
  lastPos: Vector;
};

export class Rubber extends Component<CtxProps, State> {
  readonly state: State = {
    lastPos: Vector.Zero
  };

  shouldComponentUpdate() {
    return false;
  }

  handleMouseDown = (canvasPos: Vector) => {
    const { setColor } = this.props.paint;

    setColor(false);
    this.draw(canvasPos);
    this.setState({ lastPos: canvasPos });
  };

  handleMouseMove = (canvasPos: Vector) => {
    const { lastPos } = this.state;

    fillSpaceBetweenPoints(lastPos, canvasPos, this.draw, true);
    this.setState({ lastPos: canvasPos });
  };

  draw = (canvasPos: Vector) => {
    const { options, canvasCtx } = this.props.paint;
    fillRect(canvasPos, options.rubberSize, canvasCtx!);
  };

  render() {
    return (
      <Tool
        icon={rubberIcon}
        toolType="rubber"
        data-test="tool"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

export default withContext(Rubber, "paint");
