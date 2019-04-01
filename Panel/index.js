const getCountFromStorage = (cb) =>
  chrome.storage.sync.get(['count'], (result) => cb(result.count));

// SETUP
// try to get "count" from storage and default it to an empty object
getCountFromStorage((count) => {
  count = count || {};

  const trackWebsites = () => {

    const { host } = window.location;

    chrome.tabs.query({"active": true}, (tabs) => {
      console.log("tabs", tabs);
      // let url = tabs[0].url;
      if (tabs[0]) {
        const host = extractHostname(tabs[0].url);
        count[host] = (count[host] || 0) + 1;

        chrome.storage.sync.set({count}, () => {
          console.log(`Value is set to ${count[host]}`);
        });
      }
    })
  }

  const updateUi = () => {
    getCountFromStorage(count => {
      let countString = Object.keys(count).map(key => `${key}: ${count[key]} seconds`);
      document.getElementById("log").innerHTML = countString;
    });
  }

  // on a loop update website count` with current website
  setInterval(trackWebsites, 1000);
  // on a loop update ui with count
  setInterval(updateUi, 1000);
});

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
