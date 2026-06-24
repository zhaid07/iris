const setupView      = document.getElementById("setup-view");
const successView    = document.getElementById("success-view");
const configuredView = document.getElementById("configured-view");

const canvasDomainInput = document.getElementById("canvas-domain");
const userIdInput       = document.getElementById("user-id");
const formError         = document.getElementById("form-error");
const saveBtn           = document.getElementById("save-btn");
const editBtn           = document.getElementById("edit-btn");
const syncNowBtn        = document.getElementById("sync-now-btn");
const showDomain        = document.getElementById("show-domain");
const showUserId        = document.getElementById("show-user-id");
const headerDot         = document.getElementById("header-dot");
const syncStatusText    = document.getElementById("sync-status-text");


function normalizeCanvasDomain(domain) {
  return domain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
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

function setHeaderDot(state) {
  headerDot.className = "status-dot" + (state ? " " + state : "");
}

function formatLastSync(ts) {
  if (!ts) return "Never synced";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Synced just now";
  if (mins < 60) return `Synced ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Synced ${hrs}h ago`;
  return `Synced ${Math.floor(hrs / 24)}d ago`;
}

async function loadSettings() {
  const { canvasDomain, userId, justSaved, lastSync, status } =
    await chrome.storage.local.get(["canvasDomain", "userId", "justSaved", "lastSync", "status"]);


  if (justSaved) {
    await chrome.storage.local.remove("justSaved");
    setHeaderDot("syncing");
    showView(successView);
    return;
  }

  if (canvasDomain && userId) {
    showDomain.textContent = canvasDomain;
    showUserId.textContent = userId.slice(0, 8) + "…" + userId.slice(-4);

    if (status === "error") {
      setHeaderDot("error");
      syncStatusText.textContent = "Sync error — try again";
    } else if (lastSync) {
      setHeaderDot("synced");
      syncStatusText.textContent = formatLastSync(lastSync);
    } else {
      setHeaderDot();
      syncStatusText.textContent = "Not yet synced";
    }

    showView(configuredView);
    return;
  }

  if (canvasDomain) canvasDomainInput.value = canvasDomain;
  if (userId)       userIdInput.value = userId;

  setHeaderDot();
  showView(setupView);
}

// Save
saveBtn.addEventListener("click", async () => {
  clearFormError();

  const canvasDomain = normalizeCanvasDomain(canvasDomainInput.value);
  const userId = userIdInput.value.trim();

  if (!canvasDomain) { showFormError("Enter your Canvas domain."); return; }
  if (!userId)       { showFormError("Enter your Iris User ID."); return; }

  saveBtn.disabled = true;
  saveBtn.textContent = "Connecting…";

  try {
    // Request permission for their specific Canvas domain
    const granted = await chrome.permissions.request({
      origins: [`https://${canvasDomain}/*`]
    });

    if (!granted) {
      showFormError("Canvas permission is required to sync.");
      return;
    }

    // Verify it's actually a Canvas instance and they're logged in
    let testRes;
    try {
      testRes = await fetch(`https://${canvasDomain}/api/v1/users/self`, {
        credentials: "include"
      });
    } catch {
      showFormError("Couldn't reach that domain. Check your Canvas URL.");
      return;
    }

    if (!testRes.ok) {
      showFormError("Couldn't verify Canvas. Make sure you're logged into Canvas first.");
      return;
    }

    await chrome.storage.local.set({ canvasDomain, userId, justSaved: true });
    chrome.runtime.sendMessage({ type: "sync-now" });
    setHeaderDot("syncing");
    showView(successView);
  } catch {
    showFormError("Failed to save. Please try again.");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Connect Canvas";
  }
});

// Edit
editBtn.addEventListener("click", async () => {
  const { canvasDomain, userId } = await chrome.storage.local.get(["canvasDomain", "userId"]);
  canvasDomainInput.value = canvasDomain ?? "";
  userIdInput.value       = userId ?? "";
  clearFormError();
  showView(setupView);
});

// Sync now
syncNowBtn.addEventListener("click", () => {
  syncNowBtn.disabled = true;
  syncNowBtn.textContent = "Syncing…";
  setHeaderDot("syncing");
  syncStatusText.textContent = "Syncing…";
  chrome.runtime.sendMessage({ type: "sync-now" });

  setTimeout(() => {
    syncNowBtn.disabled = false;
    syncNowBtn.textContent = "Sync now";
    loadSettings();
  }, 3000);
});


loadSettings();
