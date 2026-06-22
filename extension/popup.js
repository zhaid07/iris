const setupView = document.getElementById("setup-view");
const successView = document.getElementById("success-view");
const configuredView = document.getElementById("configured-view");
const setupForm = document.getElementById("setup-form");
const canvasDomainInput = document.getElementById("canvas-domain");
const userIdInput = document.getElementById("user-id");
const formError = document.getElementById("form-error");
const saveBtn = document.getElementById("save-btn");
const editBtn = document.getElementById("edit-btn");
const showDomain = document.getElementById("show-domain");
const showUserId = document.getElementById("show-user-id");

function normalizeCanvasDomain(domain) {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function showView(view) {
  setupView.classList.add("hidden");
  successView.classList.add("hidden");
  configuredView.classList.add("hidden");
  view.classList.remove("hidden");
}

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function clearFormError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

async function loadSettings() {
  const { canvasDomain, userId, justSaved } = await chrome.storage.local.get([
    "canvasDomain",
    "userId",
    "justSaved",
  ]);

  if (justSaved) {
    await chrome.storage.local.remove("justSaved");
    showView(successView);
    return;
  }

  if (canvasDomain && userId) {
    showDomain.textContent = canvasDomain;
    showUserId.textContent = userId;
    showView(configuredView);
    return;
  }

  if (canvasDomain) {
    canvasDomainInput.value = canvasDomain;
  }

  if (userId) {
    userIdInput.value = userId;
  }

  showView(setupView);
}

setupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormError();

  const canvasDomain = normalizeCanvasDomain(canvasDomainInput.value);
  const userId = userIdInput.value.trim();

  if (!canvasDomain || !userId) {
    showFormError("Canvas domain and Iris User ID are required.");
    return;
  }

  saveBtn.disabled = true;

  try {
    await chrome.storage.local.set({ canvasDomain, userId, justSaved: true });
    chrome.runtime.sendMessage({ type: "sync-now" });
    showView(successView);
  } catch {
    showFormError("Failed to save settings. Please try again.");
  } finally {
    saveBtn.disabled = false;
  }
});

editBtn.addEventListener("click", async () => {
  const { canvasDomain, userId } = await chrome.storage.local.get([
    "canvasDomain",
    "userId",
  ]);

  canvasDomainInput.value = canvasDomain ?? "";
  userIdInput.value = userId ?? "";
  clearFormError();
  showView(setupView);
});

loadSettings();
