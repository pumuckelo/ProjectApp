import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ConfirmationPopup from "./ConfirmationPopup";

let container = null;

beforeEach(() => {
  //setup a DOM element as render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

test("placeholder", () => {
  expect(true).toBeTruthy();
});

afterEach(() => {
  //cleanup on exiting

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
