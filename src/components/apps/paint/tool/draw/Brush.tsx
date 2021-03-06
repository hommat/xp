import React, { Component } from "react";

import Tool from "../Tool";
import Vector from "../../../../../classes/Vector";
import withContext from "../../../../../hoc/withContext";
import { PaintContextType } from "ContextType";
import { BrushSize } from "../../models";
import {
  fillRect,
  fillSpaceBetweenPoints,
  line,
  fillEllipse
} from "../../../../../utils/paint";

import brushIcon from "../../../../../assets/paint/brush.png";

type CtxProps = {
  paint: PaintContextType;
};

type State = {
  lastPoint: Vector;
  isMouseMoving: boolean;
};

export class Brush extends Component<CtxProps, State> {
  readonly state: State = {
    lastPoint: Vector.Zero,
    isMouseMoving: false
  };

  shouldComponentUpdate() {
    return false;
  }

  handleMouseDown = (canvasPos: Vector, isLeft: boolean) => {
    const { setColor } = this.props.paint;

    setColor(isLeft);
    this.draw(canvasPos);
    this.setState({ lastPoint: canvasPos, isMouseMoving: true });
  };

  handleMouseMove = (canvasPos: Vector) => {
    const { lastPoint } = this.state;

    fillSpaceBetweenPoints(lastPoint, canvasPos, this.draw);
    this.draw(canvasPos);
    this.setState({ lastPoint: canvasPos });
  };

  handleMouseUp = () => {
    this.setState({ isMouseMoving: false });
  };

  draw = (canvasPos: Vector) => {
    const { type } = this.props.paint.options.brush;

    if (type === "circle") this.drawCircle(canvasPos);
    else if (type === "rect") this.drawRect(canvasPos);
    else if (type === "slash") this.drawSlash(canvasPos, true);
    else this.drawSlash(canvasPos, false);
  };

  drawCircle = (canvasPos: Vector) => {
    const { canvasCtx, options } = this.props.paint;
    const { size } = options.brush;

    if (size === BrushSize.Small) fillRect(canvasPos, 1, canvasCtx!);
    else fillEllipse(canvasPos, size / 2, size / 2, canvasCtx!);
  };

  drawRect = (canvasPos: Vector) => {
    const { canvasCtx, options } = this.props.paint;
    fillRect(canvasPos, options.brush.size, canvasCtx!);
  };

  drawSlash = (cvsPos: Vector, forward: boolean) => {
    const { isMouseMoving } = this.state;
    const { canvasCtx } = this.props.paint;

    const [sPoint, ePoint] = this.getSlashStartAndEndPoint(cvsPos, forward);
    line(sPoint, ePoint, 1, canvasCtx!);

    if (!isMouseMoving) return;

    [-1, 1].forEach(n => {
      const movedStartPoint: Vector = { ...sPoint, x: sPoint.x + n };
      const movedEndPoint: Vector = { ...ePoint, x: ePoint.x + n };
      line(movedStartPoint, movedEndPoint, 1, canvasCtx!);
    });
  };

  getSlashStartAndEndPoint = (
    { x, y }: Vector,
    forward: boolean
  ): [Vector, Vector] => {
    const lineLength = this.getSlashLineLength();
    const halfLineLength = lineLength / 2;

    const startX = Math.floor(x - halfLineLength * (forward ? 1 : -1));
    const startY = Math.floor(y + halfLineLength);
    const endX = Math.ceil(x + halfLineLength * (forward ? 1 : -1));
    const endY = Math.ceil(y - halfLineLength);

    const startVector: Vector = { x: startX, y: startY };
    const endVector: Vector = { x: endX, y: endY };

    return [startVector, endVector];
  };

  getSlashLineLength = () => {
    const { size } = this.props.paint.options.brush;

    if (size === BrushSize.Small) return 4;
    else if (size === BrushSize.Medium) return 6;
    else return 8;
  };

  render() {
    return (
      <Tool
        icon={brushIcon}
        toolType="brush"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        data-test="tool"
      />
    );
  }
}

export default withContext(Brush, "paint");
