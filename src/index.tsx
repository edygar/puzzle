/* @refresh reload */
import { render } from "solid-js/web";

import "./style.css";
import { App } from "./App";
import { Router } from "@solidjs/router";

const root = document.getElementById("root");
render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root!,
);
