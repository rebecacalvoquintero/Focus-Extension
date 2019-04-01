let count = {};

const extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (!url) {
    return '';
  }
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

// user goes to a new tab
// and can see the previous tabs stored with the seconds
const getAnotherTabs = () => {

}

const trackWebsites = () => {

  const { host } = window.location;

  chrome.tabs.query({
    "active": true,
    "lastFocusedWindow": true
  }, (tabs) => {
    // let url = tabs[0].url;
    if (tabs[0]) {
      const host = extractHostname(tabs[0].url);
      count[host] = (count[host] || 0) + 1;

      chrome.storage.sync.set({count}, () => {
        console.log(`Value is set to ${count[host]}`);
      });

      chrome.storage.sync.get(['count'], ({count}) => {
        let countString = Object.keys(count).map(key => `${key}: ${count[host]} seconds`);
        document.getElementById("log").innerHTML = countString;
      });
    }
  })

}
setInterval(trackWebsites, 1000);
