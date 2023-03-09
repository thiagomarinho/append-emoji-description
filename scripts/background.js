async function toggleAppender() {
  const enabled = !((await chrome.storage.local.get('enabled')).enabled);
  const path = `/images/${enabled ? 'on' : 'off'}.png`;
  chrome.action.setIcon({path});
  await chrome.storage.local.set({ enabled });
}

async function setInitialAppenderState() {
  const enabled = ((await chrome.storage.local.get('enabled')).enabled);
  const path = `/images/${enabled ? 'on' : 'off'}.png`;
  chrome.action.setIcon({path});
}

setInitialAppenderState();

chrome.action.onClicked.addListener(async () => {
  toggleAppender();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-appender-status') {
    getAppenderStatus().then(sendResponse);

    return true;
  }
});

async function getAppenderStatus() {
  return ((await chrome.storage.local.get('enabled')).enabled);
}
