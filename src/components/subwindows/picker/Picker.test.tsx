import React from "react";
import { shallow } from "enzyme";

import { Picker } from "./Picker";
import { findByTestAtrr } from "../../../../testingUtils";

const wrapper = shallow(
  <Picker {...({} as any)}>
    <p data-test="child" />
    <p data-test="child" />
  </Picker>
);

describe("Subwindow Picker Component", () => {
  describe("render", () => {
    it("should render without throwing an error", () => {
      expect(findByTestAtrr(wrapper, "container").length).toBe(1);
    });

    it("should render Content Component", () => {
      expect(findByTestAtrr(wrapper, "content").length).toBe(1);
    });

    it("should render children", () => {
      expect(findByTestAtrr(wrapper, "child").length).toBe(2);
    });
  });
});
