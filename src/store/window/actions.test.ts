import * as actions from "./actions";
import * as WindowAction from "./constants";
import store from "../";
import {
  windowId,
  applicationName,
  windowName,
  windowIcon,
  emptyState,
  stateWithOneWindow,
  stateWithChangedMinimalize,
  secondWindowId
} from "./testingData";
import { Window } from "./models";

type AnyAction = {
  type: any;
  payload: any;
};

describe("Window actions", () => {
  beforeEach(() => store.dispatch(actions.closeAll()));

  describe("closeAll", () => {
    it("should return proper type", () => {
      const action = actions.closeAll();

      expect(action.type).toBe(WindowAction.CLOSE_ALL);
    });
  });

  describe("removeFocus", () => {
    it("should return proper type", () => {
      const action = actions.removeFocus();

      expect(action.type).toBe(WindowAction.REMOVE_FOCUS);
    });
  });

  describe("open", () => {
    it("should open new window", () => {
      const action = actions.open(windowId, applicationName, windowName);

      expect(action.type).toBe(WindowAction.OPEN);
      expect(action.payload).toEqual(stateWithOneWindow);
    });
  });

  describe("replace", () => {
    const newWindow: Window = {
      name: "x",
      application: "notepad",
      icon: "i",
      id: "id",
      minimalized: false
    };

    describe("window exists", () => {
      it("should return proper type and payload", () => {
        store.dispatch(actions.open(windowId, applicationName, windowName));
        const action = actions.replace(windowId, newWindow) as AnyAction;

        expect(action.type).toBe(WindowAction.REPLACE);
        expect(action.payload).toEqual({
          byId: { id: newWindow },
          allIds: ["id"],
          focused: "id"
        });
      });
    });

    describe("window does not exists", () => {
      it("should return error action", () => {
        const action = actions.replace(windowId, newWindow) as AnyAction;

        expect(action.type).toBe(WindowAction.REPLACE_FAILED);
        expect(action.payload).toBe(undefined);
      });
    });
  });

  describe("close", () => {
    describe("window exists", () => {
      it("should return proper type and payload", () => {
        store.dispatch(actions.open(windowId, applicationName, windowName));
        const action = actions.close(windowId) as AnyAction;

        expect(action.type).toBe(WindowAction.CLOSE);
        expect(action.payload).toEqual(emptyState);
      });
    });

    describe("window does not exists", () => {
      it("should return error action", () => {
        const action = actions.close("id-not-exists") as AnyAction;

        expect(action.type).toBe(WindowAction.CLOSE_FAILED);
        expect(action.payload).toBe(undefined);
      });
    });
  });

  describe("toggleMinimalize", () => {
    describe("window exists", () => {
      it("should toggle minimalized when was NOT minimalized", () => {
        store.dispatch(actions.open(windowId, applicationName, windowName));
        const action = actions.toggleMinimalize(windowId) as AnyAction;

        expect(action.type).toBe(WindowAction.TOGGLE_MINIMALIZE);
        expect(action.payload).toEqual({
          ...stateWithChangedMinimalize,
          focused: null
        });
      });

      it("should toggle minimalized when was minimalized", () => {
        store.dispatch(actions.open(windowId, applicationName, windowName));
        store.dispatch(actions.toggleMinimalize(windowId));
        const action = actions.toggleMinimalize(windowId) as AnyAction;

        expect(action.type).toBe(WindowAction.TOGGLE_MINIMALIZE);
        expect(action.payload).toEqual(stateWithOneWindow);
      });
    });

    describe("window does NOt exists", () => {
      it("shoud return error action", () => {
        const action = actions.toggleMinimalize("id-not-exists") as AnyAction;

        expect(action.type).toBe(WindowAction.CHANGE_PROP_FAILED);
        expect(action.payload).toBe(undefined);
      });
    });
  });

  describe("rename", () => {
    it("should fail when window does not exists", () => {
      const action = actions.rename(
        "no exists",
        windowName,
        windowIcon
      ) as AnyAction;

      expect(action).toEqual({
        type: WindowAction.CHANGE_PROP_FAILED,
        payload: undefined
      });
    });

    it("should change window name and icon", () => {
      store.dispatch(actions.open(windowId, applicationName, windowName));
      const action = actions.rename(windowId, "new Name", "disk") as AnyAction;

      expect(action.type).toBe(WindowAction.RENAME);
    });
  });

  describe("changePriority", () => {
    describe("window exists", () => {
      it("should change priority of window", () => {
        store.dispatch(actions.open(windowId, applicationName, windowName));
        store.dispatch(
          actions.open(secondWindowId, applicationName, windowName)
        );
        let action = actions.changePriority(windowId) as AnyAction;

        expect(action.type).toBe(WindowAction.CHANGE_PRIORITY);
        expect(action.payload).toEqual({
          allIds: [secondWindowId, windowId],
          focused: windowId
        });

        action = actions.changePriority(secondWindowId) as AnyAction;
        expect(action.payload).toEqual({
          allIds: [windowId, secondWindowId],
          focused: secondWindowId
        });
      });
    });

    describe("window does NOT exists", () => {
      it("should return error action", () => {
        const action = actions.changePriority("id-not-exists") as AnyAction;

        expect(action.type).toBe(WindowAction.CHANGE_PRIORITY_FAILED);
        expect(action.payload).toBe(undefined);
      });
    });
  });
});
