import React, { Component } from "react";

import SideItem from "../Item";
import NoFocusedOptions from "./NoFocusedOptions";
import OneFocusedOptions from "./OneFocusedOptions";
import ManyFocusedOptions from "./ManyFocusedOptions";
import withContext from "../../../../../hoc/withContext";
import { FilesystemContextType } from "ContextType";

type Props = {
  filesystem: FilesystemContextType;
};

export class FileAndFolderTasks extends Component<Props, {}> {
  getListOption = (): JSX.Element => {
    const { focused } = this.props.filesystem;

    if (focused.length === 0) return <NoFocusedOptions data-test="no" />;
    else if (focused.length === 1) return <OneFocusedOptions data-test="one" />;
    else return <ManyFocusedOptions data-test="many" />;
  };
  render() {
    if (this.props.filesystem.path.length === 0) return null;
    const options = this.getListOption();

    return (
      <SideItem title={"File and foler tasks"} data-test="container">
        <ul className="filesystem__side__list">{options}</ul>
      </SideItem>
    );
  }
}

export default withContext(FileAndFolderTasks, "filesystem");
