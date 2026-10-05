import { findRoute } from "./graph.js";
import { initializeLanguage, setLanguage, translate } from "./i18n.js";
import { validateBuilding } from "./validate.js";
import {
  clearMapCount,
  renderBuildingDetails,
  renderEmptyMap,
  renderInitialState,
  renderMap,
  renderMapCount,
  renderMessages,
  renderRouteResult,
} from "./render.js";
import {
  createBuildingState,
  getHazards,
  resetBuildingState,
  setStart,
  toggleEdgeHazard,
  toggleNodeHazard,
} from "./state.js";

const fileInput = document.querySelector("#building-file");
const importButton = document.querySelector("#import-button");
const sampleButton = document.querySelector("#sample-button");
const startModeButton = document.querySelector("#start-mode");
const hazardModeButton = document.querySelector("#hazard-mode");
const resetButton = document.querySelector("#reset-button");
const mapContainer = document.querySelector("#map-container");
const mapCount = document.querySelector("#map-count");
const detailsContainer = document.querySelector("#building-details");
const initialStateContainer = document.querySelector("#initial-state");
const routeContainer = document.querySelector("#route-result");
const messageList = document.querySelector("#message-list");
const messageEmpty = document.querySelector("#message-empty");
const messageCard = document.querySelector("#message-card");

let activeState = null;
let activeRoute = null;
let activeErrors = [];

function displayErrors(errors) {
  activeErrors = errors;
  renderMessages(messageList, messageEmpty, messageCard, errors, (error) => (
    translate(error.key, error.params)
  ));
}

function updateModeButtons() {
  for (const [button, mode] of [[startModeButton, "start"], [hazardModeButton, "hazard"]]) {
    const isActive = activeState?.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = !activeState;
  }
  resetButton.disabled = !activeState;
}

function clearBuilding() {
  activeState = null;
  activeRoute = null;
  renderEmptyMap(mapContainer);
  clearMapCount(mapCount);
  renderRouteResult(routeContainer, null);
  updateModeButtons();

  detailsContainer.replaceChildren();
  const detailsEmpty = document.createElement("p");
  detailsEmpty.className = "muted-copy";
  detailsEmpty.dataset.i18n = "detailsEmpty";
  detailsEmpty.textContent = translate("detailsEmpty");
  detailsContainer.append(detailsEmpty);

  initialStateContainer.replaceChildren();
  const initialEmpty = document.createElement("p");
  initialEmpty.className = "muted-copy";
  initialEmpty.dataset.i18n = "initialEmpty";
  initialEmpty.textContent = translate("initialEmpty");
  initialStateContainer.append(initialEmpty);
}

function calculateRoute() {
  if (!activeState.start) return null;
  return findRoute(activeState.building, activeState.start, getHazards(activeState));
}

function onNodeClick(nodeId) {
  if (!activeState) return;
  if (activeState.mode === "start") {
    setStart(activeState, nodeId);
  } else {
    toggleNodeHazard(activeState, nodeId);
  }
  refreshBuilding();
}

function onEdgeClick(edgeId) {
  if (!activeState || activeState.mode !== "hazard") return;
  toggleEdgeHazard(activeState, edgeId);
  refreshBuilding();
}

function refreshBuilding() {
  activeRoute = calculateRoute();
  renderMap(
    mapContainer,
    activeState.building,
    activeState,
    activeRoute,
    onNodeClick,
    onEdgeClick,
  );
  renderMapCount(mapCount, activeState.building);
  renderBuildingDetails(detailsContainer, activeState.building);
  renderInitialState(initialStateContainer, activeState.building, activeState);
  renderRouteResult(routeContainer, activeRoute);
  updateModeButtons();
}

function loadBuilding(building) {
  const errors = validateBuilding(building);
  if (errors.length > 0) {
    clearBuilding();
    displayErrors(errors);
    return false;
  }

  activeState = createBuildingState(building);
  refreshBuilding();
  displayErrors([]);
  return true;
}

async function loadSample() {
  sampleButton.disabled = true;
  try {
    const response = await fetch(new URL("../sample/building.json", import.meta.url));
    if (!response.ok) {
      throw new Error(`Sample request failed with status ${response.status}`);
    }
    const building = await response.json();
    loadBuilding(building);
  } catch (error) {
    console.error("Unable to load the sample building.", error);
    clearBuilding();
    displayErrors([{ key: "sampleLoadError", params: {} }]);
  } finally {
    sampleButton.disabled = false;
  }
}

function loadFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const building = JSON.parse(String(reader.result));
      loadBuilding(building);
    } catch (error) {
      if (error instanceof SyntaxError) {
        clearBuilding();
        displayErrors([{ key: "invalidJson", params: {} }]);
        return;
      }
      console.error("Unable to process the selected building file.", error);
      clearBuilding();
      displayErrors([{ key: "readFileError", params: {} }]);
    }
  });
  reader.addEventListener("error", () => {
    console.error("Unable to read the selected building file.", reader.error);
    clearBuilding();
    displayErrors([{ key: "readFileError", params: {} }]);
  });
  reader.readAsText(file);
}

importButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  loadFile(fileInput.files?.[0]);
  fileInput.value = "";
});
sampleButton.addEventListener("click", loadSample);
startModeButton.addEventListener("click", () => {
  if (activeState) {
    activeState.mode = "start";
    updateModeButtons();
    refreshBuilding();
  }
});
hazardModeButton.addEventListener("click", () => {
  if (activeState) {
    activeState.mode = "hazard";
    updateModeButtons();
    refreshBuilding();
  }
});
resetButton.addEventListener("click", () => {
  if (activeState) {
    resetBuildingState(activeState);
    refreshBuilding();
  }
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

window.addEventListener("languagechange", () => {
  if (activeState) {
    refreshBuilding();
  } else {
    renderRouteResult(routeContainer, null);
  }
  displayErrors(activeErrors);
});

initializeLanguage();
updateModeButtons();
