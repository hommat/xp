import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import { RootState } from "MyTypes";
import { getClassName } from "../../../utils";
import {
  toggleMinimalize,
  changePriority
} from "../../../store/window/actions";

type OwnProps = {
  id: string;
  width: number;
};

type StateProps = {
  name: string;
  icon: string;
  minimalized: boolean;
  focused: boolean;
  openedWindows: number;
};

type DispatchProps = {
  toggleMinimalize: () => void;
  changePriority: () => void;
};

type Props = OwnProps & StateProps & DispatchProps;

export class Application extends React.Component<Props, {}> {
  private baseClassName = "taskbar__application";

  handleClick = () => {
    const {
      focused,
      toggleMinimalize,
      openedWindows,
      changePriority,
      minimalized
    } = this.props;

    if (openedWindows === 1 || focused || minimalized) toggleMinimalize();
    else changePriority();
  };

  getClassName = () => {
    const modifierObj = { focused: this.props.focused };

    return getClassName(this.baseClassName, modifierObj);
  };

  render() {
    const { name, width, icon } = this.props;
    const className = this.getClassName();
    return (
      <div
        className={className}
        onClick={this.handleClick}
        style={{ width }}
        data-test="application"
      >
        <div className="taskbar__icon-container">
          <img src={icon} className="taskbar__icon" alt="application icon" />
        </div>

        <span className="taskbar__text" data-test="text">
          {name}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, { id }: OwnProps): StateProps => ({
  name: state.window.byId[id].name,
  icon: state.window.byId[id].icon,
  minimalized: state.window.byId[id].minimalized,
  focused: state.window.focused === id,
  openedWindows: state.window.allIds.length
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  { id }: OwnProps
): DispatchProps => ({
  toggleMinimalize: () => dispatch(toggleMinimalize(id)),
  changePriority: () => dispatch(changePriority(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);
