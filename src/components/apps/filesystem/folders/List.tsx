import React from "react";

import FoldersTree from "../tree/Tree";
import withContext from "../../../../hoc/withContext";
import { FilesystemContextType } from "ContextType";

export const List: React.FC<{ context: FilesystemContextType }> = ({
  context
}) => {
  const { path, setPath, historyPosition } = context;

  const handleClick = (path: string[]) => {
    setPath(path, historyPosition + 1);
  };

  return (
    <FoldersTree
      selectedPath={path}
      onClick={handleClick}
      withToggler={true}
      data-test="tree"
    />
  );
};

export default withContext(List, "filesystem");
