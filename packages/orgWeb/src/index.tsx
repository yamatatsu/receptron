import React from "react";
import { render } from "react-dom";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import Routes from "./Routes";

initializeIcons();

render(
  <Fabric>
    <Routes />
  </Fabric>,
  document.getElementById("root"),
);
