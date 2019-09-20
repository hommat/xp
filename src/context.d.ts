declare module "ContextType" {
  export type WindowContextType = import("./components/window/Context").Context;
  export type MenuContextType = import("./components/menu/Context").Context;
  export type FilesystemContextType = import("./components/apps/filesystem/context/Context").Context;
}
