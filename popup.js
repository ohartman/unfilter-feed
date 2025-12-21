// Reddit Robocop - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const enableToggle = document.getElementById('enableToggle');
  const postsToggle = document.getElementById('postsToggle');
  const commentsToggle = document.getElementById('commentsToggle');
  const thresholdSlider = document.getElementById('thresholdSlider');
  const thresholdValue = document.getElementById('thresholdValue');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const scannedCount = document.getElementById('scannedCount');
  const flaggedCount = document.getElementById('flaggedCount');

  // Load saved settings
  const settings = await chrome.storage.sync.get({
    enabled: true,
    showOnPosts: true,
    showOnComments: true,
    threshold: 40,
    stats: { scanned: 0, flagged: 0 }
  });

  // Apply settings to UI
  enableToggle.checked = settings.enabled;
  postsToggle.checked = settings.showOnPosts;
  commentsToggle.checked = settings.showOnComments;
  thresholdSlider.value = settings.threshold;
  thresholdValue.textContent = settings.threshold;
  
  // Update status display
  updateStatus(settings.enabled);
  
  // Update stats
  scannedCount.textContent = settings.stats.scanned;
  flaggedCount.textContent = settings.stats.flagged;

  // Event listeners
  enableToggle.addEventListener('change', async () => {
    const enabled = enableToggle.checked;
    await chrome.storage.sync.set({ enabled });
    updateStatus(enabled);
    notifyContentScript({ type: 'settingsChanged', enabled });
  });

  postsToggle.addEventListener('change', async () => {
    await chrome.storage.sync.set({ showOnPosts: postsToggle.checked });
    notifyContentScript({ type: 'settingsChanged', showOnPosts: postsToggle.checked });
  });

  commentsToggle.addEventListener('change', async () => {
    await chrome.storage.sync.set({ showOnComments: commentsToggle.checked });
    notifyContentScript({ type: 'settingsChanged', showOnComments: commentsToggle.checked });
  });

  thresholdSlider.addEventListener('input', () => {
    thresholdValue.textContent = thresholdSlider.value;
  });

  thresholdSlider.addEventListener('change', async () => {
    await chrome.storage.sync.set({ threshold: parseInt(thresholdSlider.value) });
    notifyContentScript({ type: 'settingsChanged', threshold: parseInt(thresholdSlider.value) });
  });

  function updateStatus(enabled) {
    if (enabled) {
      statusDot.classList.remove('inactive');
      statusText.classList.remove('inactive');
      statusText.textContent = 'Active';
    } else {
      statusDot.classList.add('inactive');
      statusText.classList.add('inactive');
      statusText.textContent = 'Inactive';
    }
  }

  async function notifyContentScript(message) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('reddit.com')) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    } catch (e) {
      console.log('Could not notify content script:', e);
    }
  }

  // Listen for stats updates from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'statsUpdate') {
      scannedCount.textContent = message.stats.scanned;
      flaggedCount.textContent = message.stats.flagged;
    }
  });
});

