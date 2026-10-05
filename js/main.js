import { getLanguage, initializeLanguage, setLanguage, translate } from "./i18n.js";
import { validateBuilding } from "./validate.js";
import {
  clearMapCount,
  renderBuildingDetails,
  renderEmptyMap,
  renderInitialState,
  renderMap,
  renderMapCount,
  renderMessages,
} from "./render.js";

const fileInput = document.querySelector("#building-file");
const importButton = document.querySelector("#import-button");
const sampleButton = document.querySelector("#sample-button");
const mapContainer = document.querySelector("#map-container");
const mapCount = document.querySelector("#map-count");
const detailsContainer = document.querySelector("#building-details");
const initialStateContainer = document.querySelector("#initial-state");
const messageList = document.querySelector("#message-list");
const messageEmpty = document.querySelector("#message-empty");
const messageCard = document.querySelector("#message-card");

let activeBuilding = null;
let activeErrors = [];

function displayErrors(errors) {
  activeErrors = errors;
  renderMessages(messageList, messageEmpty, messageCard, errors, (error) => (
    translate(error.key, error.params)
  ));
}

function clearBuilding() {
  activeBuilding = null;
  renderEmptyMap(mapContainer);
  clearMapCount(mapCount);

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

function loadBuilding(building) {
  const errors = validateBuilding(building);
  if (errors.length > 0) {
    clearBuilding();
    displayErrors(errors);
    return false;
  }

  activeBuilding = building;
  renderMap(mapContainer, building);
  renderMapCount(mapCount, building);
  renderBuildingDetails(detailsContainer, building);
  renderInitialState(initialStateContainer, building);
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
  if (!file) {
    return;
  }

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

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

window.addEventListener("languagechange", () => {
  if (activeBuilding) {
    renderMap(mapContainer, activeBuilding);
    renderMapCount(mapCount, activeBuilding);
    renderBuildingDetails(detailsContainer, activeBuilding);
    renderInitialState(initialStateContainer, activeBuilding);
  }
  if (!activeBuilding && activeErrors.length > 0) {
    renderEmptyMap(mapContainer, "emptyMap");
  }
  displayErrors(activeErrors);
});

initializeLanguage();
