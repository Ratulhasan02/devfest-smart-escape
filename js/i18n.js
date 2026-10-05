const translations = {
  en: {
    appTitle: "Building Evacuation Map",
    brandLabel: "Building Evacuation Map",
    languageGroup: "Language",
    mapLegend: "Map legend",
    buildingInfo: "Building information",
    eyebrow: "BUILDING SAFETY",
    pageHeading: "Know your way out.",
    pageDescription: "Import a building map to see rooms, connections and the initial safety conditions.",
    importButton: "Import building JSON",
    sampleButton: "Load sample",
    helpLink: "Data format",
    mapEyebrow: "FLOOR PLAN",
    mapHeading: "Building map",
    emptyMap: "Load a sample or import a building JSON file to view its map.",
    room: "Room",
    junction: "Junction",
    exit: "Exit",
    blocked: "Blocked",
    closed: "Closed",
    detailsEyebrow: "OVERVIEW",
    detailsHeading: "Building details",
    detailsEmpty: "Building information will appear here after a valid file is loaded.",
    messagesHeading: "Messages",
    messagesEmpty: "No errors to show.",
    initialEyebrow: "STARTING CONDITIONS",
    initialHeading: "Initial state",
    initialEmpty: "Load a valid building file to see its starting conditions.",
    footerText: "A clear map is a safer first step.",
    buildingName: "Building",
    nodeCount: "Nodes",
    edgeCount: "Connections",
    startLocation: "Starting room",
    blockedLocations: "Blocked locations",
    closedExits: "Closed exits",
    none: "None",
    nodesUnit: "nodes",
    edgesUnit: "connections",
    statusBlocked: "Blocked",
    statusClosed: "Closed",
    mapLoaded: "Building map loaded.",
    readFileError: "The selected file could not be read.",
    invalidJson: "The selected file is not valid JSON.",
    sampleLoadError: "The sample building could not be loaded.",
    errorBuildingName: "Building name must be a non-empty string.",
    errorNodesArray: "Nodes must be provided as an array.",
    errorNodeCount: "A building must contain between 2 and 60 nodes.",
    errorNodeObject: "Each node must be an object with an ID, type, x and y coordinates.",
    errorNodeId: "Node IDs must be non-empty strings.",
    errorDuplicateNodeId: "Node ID “{id}” is used more than once.",
    errorNodeType: "Node “{id}” must have type room, junction or exit.",
    errorNodeCoordinates: "Node “{id}” must have numeric x and y coordinates.",
    errorNodeKinds: "Include at least one room or junction.",
    errorExitRequired: "Include at least one exit.",
    errorEdgesArray: "Edges must be provided as an array.",
    errorEdgeCount: "A building must contain between 1 and 150 edges.",
    errorEdgeObject: "Each edge must be an object with from, to and cost fields.",
    errorEdgeEndpoint: "Connection {from} → {to} refers to a node that does not exist.",
    errorSelfLoop: "Connection “{id}” cannot connect a node to itself.",
    errorRepeatedEdge: "Connection between “{from}” and “{to}” is repeated.",
    errorEdgeCost: "Connection {from} → {to} must have a positive integer cost.",
    errorInitialState: "Initial state must include a starting room, blocked_nodes and closed_exits.",
    errorStartId: "Initial starting room “{id}” does not exist.",
    errorStartCategory: "Initial starting point “{id}” must be a room.",
    errorBlockedArray: "initial_state.blocked_nodes must be an array.",
    errorBlockedId: "Blocked node “{id}” does not exist.",
    errorBlockedCategory: "Blocked node “{id}” must be a room or junction.",
    errorClosedArray: "initial_state.closed_exits must be an array.",
    errorClosedId: "Closed exit “{id}” does not exist.",
    errorClosedCategory: "Closed node “{id}” must be an exit.",
    errorDuplicateInitialId: "Node “{id}” appears more than once in {list}.",
    blockedListName: "blocked_nodes",
    closedListName: "closed_exits",
    accessibilityMap: "Map of {name}",
    accessibilityNode: "{label}, {type}{state}",
    accessibilityBlockedSuffix: ", blocked",
    accessibilityClosedSuffix: ", closed",
    accessibilityEdge: "Connection from {from} to {to}, cost {cost}",
    accessibilityEdgeCost: "Cost {cost}",
    importButtonLabel: "Choose a building JSON file",
  },
  bn: {
    appTitle: "ভবনের জরুরি নির্গমন মানচিত্র",
    brandLabel: "ভবনের জরুরি নির্গমন মানচিত্র",
    languageGroup: "ভাষা",
    mapLegend: "মানচিত্রের চিহ্ন",
    buildingInfo: "ভবনের তথ্য",
    eyebrow: "ভবনের নিরাপত্তা",
    pageHeading: "নিরাপদ পথে বেরিয়ে যান।",
    pageDescription: "কক্ষ, সংযোগ এবং প্রাথমিক নিরাপত্তার অবস্থা দেখতে ভবনের মানচিত্র আমদানি করুন।",
    importButton: "ভবনের JSON আমদানি করুন",
    sampleButton: "নমুনা দেখুন",
    helpLink: "ডেটার ধরন",
    mapEyebrow: "ফ্লোর প্ল্যান",
    mapHeading: "ভবনের মানচিত্র",
    emptyMap: "মানচিত্র দেখতে নমুনা খুলুন অথবা ভবনের JSON ফাইল আমদানি করুন।",
    room: "কক্ষ",
    junction: "সংযোগস্থল",
    exit: "বহির্গমন",
    blocked: "অবরুদ্ধ",
    closed: "বন্ধ",
    detailsEyebrow: "সারসংক্ষেপ",
    detailsHeading: "ভবনের বিবরণ",
    detailsEmpty: "বৈধ ফাইল লোড হলে ভবনের তথ্য এখানে দেখা যাবে।",
    messagesHeading: "বার্তা",
    messagesEmpty: "দেখানোর মতো কোনো ত্রুটি নেই।",
    initialEyebrow: "প্রাথমিক অবস্থা",
    initialHeading: "শুরুর অবস্থা",
    initialEmpty: "শুরুর অবস্থা দেখতে একটি বৈধ ভবন ফাইল লোড করুন।",
    footerText: "নিরাপত্তার প্রথম ধাপ হলো একটি স্পষ্ট মানচিত্র।",
    buildingName: "ভবন",
    nodeCount: "নোড",
    edgeCount: "সংযোগ",
    startLocation: "শুরুর কক্ষ",
    blockedLocations: "অবরুদ্ধ স্থান",
    closedExits: "বন্ধ বহির্গমন",
    none: "কোনোটিই নয়",
    nodesUnit: "টি নোড",
    edgesUnit: "টি সংযোগ",
    statusBlocked: "অবরুদ্ধ",
    statusClosed: "বন্ধ",
    mapLoaded: "ভবনের মানচিত্র লোড হয়েছে।",
    readFileError: "নির্বাচিত ফাইলটি পড়া যায়নি।",
    invalidJson: "নির্বাচিত ফাইলটি বৈধ JSON নয়।",
    sampleLoadError: "নমুনা ভবনটি লোড করা যায়নি।",
    errorBuildingName: "ভবনের নাম খালি রাখা যাবে না।",
    errorNodesArray: "নোডগুলো একটি অ্যারে হিসেবে দিতে হবে।",
    errorNodeCount: "ভবনে ২ থেকে ৬০টি নোড থাকতে হবে।",
    errorNodeObject: "প্রতিটি নোডে ID, ধরন, x এবং y স্থানাঙ্কসহ একটি অবজেক্ট দিতে হবে।",
    errorNodeId: "নোডের ID খালি রাখা যাবে না; এটি টেক্সট হতে হবে।",
    errorDuplicateNodeId: "“{id}” নোডের ID একাধিকবার ব্যবহার করা হয়েছে।",
    errorNodeType: "“{id}” নোডের ধরন room, junction অথবা exit হতে হবে।",
    errorNodeCoordinates: "“{id}” নোডের x এবং y স্থানাঙ্ক সংখ্যা হতে হবে।",
    errorNodeKinds: "অন্তত একটি কক্ষ বা সংযোগস্থল থাকতে হবে।",
    errorExitRequired: "অন্তত একটি বহির্গমন থাকতে হবে।",
    errorEdgesArray: "সংযোগগুলো একটি অ্যারে হিসেবে দিতে হবে।",
    errorEdgeCount: "ভবনে ১ থেকে ১৫০টি সংযোগ থাকতে হবে।",
    errorEdgeObject: "প্রতিটি সংযোগে from, to এবং cost-সহ একটি অবজেক্ট দিতে হবে।",
    errorEdgeEndpoint: "{from} → {to} সংযোগে এমন নোড আছে যা ভবনে নেই।",
    errorSelfLoop: "“{id}” সংযোগে একটি নোডকে নিজের সঙ্গে যুক্ত করা যাবে না।",
    errorRepeatedEdge: "“{from}” এবং “{to}”-এর সংযোগটি একাধিকবার দেওয়া হয়েছে।",
    errorEdgeCost: "{from} → {to} সংযোগের খরচ ধনাত্মক পূর্ণসংখ্যা হতে হবে।",
    errorInitialState: "প্রাথমিক অবস্থায় শুরুর কক্ষ, blocked_nodes এবং closed_exits দিতে হবে।",
    errorStartId: "প্রাথমিক শুরুর কক্ষ “{id}” ভবনে নেই।",
    errorStartCategory: "প্রাথমিক শুরুর স্থান “{id}” একটি কক্ষ হতে হবে।",
    errorBlockedArray: "initial_state.blocked_nodes একটি অ্যারে হতে হবে।",
    errorBlockedId: "“{id}” অবরুদ্ধ নোডটি ভবনে নেই।",
    errorBlockedCategory: "“{id}” অবরুদ্ধ নোডটি কক্ষ বা সংযোগস্থল হতে হবে।",
    errorClosedArray: "initial_state.closed_exits একটি অ্যারে হতে হবে।",
    errorClosedId: "“{id}” বন্ধ বহির্গমনটি ভবনে নেই।",
    errorClosedCategory: "“{id}” বন্ধ নোডটি বহির্গমন হতে হবে।",
    errorDuplicateInitialId: "{list}-এ “{id}” নোডটি একাধিকবার রয়েছে।",
    blockedListName: "blocked_nodes",
    closedListName: "closed_exits",
    accessibilityMap: "{name}-এর মানচিত্র",
    accessibilityNode: "{label}, {type}{state}",
    accessibilityBlockedSuffix: ", অবরুদ্ধ",
    accessibilityClosedSuffix: ", বন্ধ",
    accessibilityEdge: "{from} থেকে {to} সংযোগ, খরচ {cost}",
    accessibilityEdgeCost: "খরচ {cost}",
    importButtonLabel: "ভবনের JSON ফাইল নির্বাচন করুন",
  },
};

let currentLanguage = "en";

export function translate(key, params = {}) {
  const template = translations[currentLanguage][key] ?? translations.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match));
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  if (!Object.hasOwn(translations, language)) {
    throw new RangeError(`Unsupported language: ${language}`);
  }

  currentLanguage = language;
  localStorage.setItem("evacuation-map-language", language);
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAria));
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
}

export function initializeLanguage() {
  const savedLanguage = localStorage.getItem("evacuation-map-language");
  setLanguage(savedLanguage && Object.hasOwn(translations, savedLanguage) ? savedLanguage : "en");
}
