import React from "react";
import { shallow } from "enzyme";

import { Provider } from "./Context";
import { findByTestAtrr } from "../../../testingUtils";

const wrapper = shallow(
  <Provider>
    <h1 data-test="child">child</h1>
    <h1 data-test="child">child</h1>
  </Provider>
);

describe("Menu Context Provider Component", () => {
  describe("render", () => {
    it("should render without throwing an error", () => {
      expect(findByTestAtrr(wrapper, "context").length).toBe(1);
    });

    it("should render children", () => {
      expect(findByTestAtrr(wrapper, "child").length).toBe(2);
    });
  });
});
