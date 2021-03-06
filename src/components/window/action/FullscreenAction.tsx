import React, { Component } from "react";

import Action from "./Action";
import withContext from "../../../hoc/withContext";
import { WindowContextType } from "ContextType";

type Props = {
  window: WindowContextType;
};

export class FullscreenAction extends Component<Props, {}> {
  shouldComponentUpdate() {
    return false;
  }

  handleClick = () => {
    const { fullscreened, setContext } = this.props.window;
    setContext({ fullscreened: !fullscreened });
  };

  render() {
    return (
      <Action type="fullscreen" onClick={this.handleClick} data-test="action" />
    );
  }
}

export default withContext(FullscreenAction, "window");
