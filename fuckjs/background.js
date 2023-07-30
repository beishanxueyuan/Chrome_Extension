
// 正则表达式
const secret_regex =
  /secret\w*\s*("|\'|`)?[:=]\s*["\'][0-9a-zA-Z_=]{20,}["\']|["\']akid|secret\w*\s*=[0-9a-zA-Z_=]{20,}/gi
const package_regex = /\^\d+\.\d+\.\d+/g
const url_regex =
  /(?:"|')(((?:[a-zA-Z]{1,10}:\/\/|\/\/)[^"\/]{1,}\.[a-zA-Z]{2,}[^"']{0,})|((?:\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\.\/|\.\/)\/[a-zA-Z0-9_\-\/]{1,}(?:\.(?:[a-zA-Z]{1,4}|action))(?:[\?|#][^"|']{0,}|))|([a-zA-Z0-9_\-\/]{1,}\/[a-zA-Z0-9_\-\/]{1,}\.(?:[a-zA-Z]{1,4}|action)(?:[\?|#][^"|']{0,}|))|([a-zA-Z0-9_\-\/]{1,}\/[a-zA-Z0-9_\-\/]{3,}(?:[\?|#][^"|']{0,}|))|([a-zA-Z0-9_\-]{1,}\.(?:php|asp|aspx|jsp|json|action|html|js|txt|xml)(?:[\?|#][^"|']{0,}|)))(?:"|')?/g

var previousHost = null
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // 如果URL发生变化
  if (tab.url) {
    // 获取当前页面的host信息
    var currentHost = new URL(tab.url).host

    // 在这里可以对当前host进行处理
    if (currentHost !== previousHost) {
      chrome.storage.local.clear(() => {})
      previousHost = currentHost
    }
  }
})

let isEnabled = true
let listenerAdded = false

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isEnabled !== undefined) {
    isEnabled = request.isEnabled
    if (request.isEnabled == true) {
      addListener()
    } else {
      removeListener()
    }
    // 在此处根据 isEnabled 的值来启用或禁用插件的功能
  }
})

function listener(details) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0] && typeof tabs[0].url == "string") {
      testURL = tabs[0].url
    } else {
      testURL = "https://cgggggggg.com/"
    }
    try {
      var urlObject = new URL(testURL)
      currentHost = urlObject.hostname
    } catch (err) {
      currentHost = "test"
    }
    if (
      (details.url.indexOf("http") == 0) &
      ((details.type === "script") |
        (details.type === "main_frame") |
        (details.type === "sub_frame"))
    ) {

fetch(details.url, {
  proxy: null
})
.then((response) => {
  const contentType = response.headers.get("content-type")
  if (
    contentType.includes("javascript") | contentType.includes("text/html")
  ) {
    fetch(details.url,{proxy: null})
      .then((response) => response.text())
      .then((text) => {
        const matches = text.match(secret_regex)
        if (matches) {
          chrome.storage.local.get("jsContent", function (result) {
            const jsContentArray = result.jsContent || []
            if (
              jsContentArray.findIndex(
                (item) => item.url === details.url
              ) == -1
            ) {
              jsContentArray.push({
                current_url: currentHost,
                url: details.url,
                data: matches,
              })
              chrome.storage.local.set({ jsContent: jsContentArray })
            }
          })
        }
        const matches2 = text.match(package_regex)
        if (matches2) {
          chrome.storage.local.get("package_content", function (result) {
            const package_contentArray = result.package_content || []
            if (
              package_contentArray.findIndex(
                (item) => item.url === details.url
              ) == -1
            ) {
              package_contentArray.push({
                current_url: currentHost,
                url: details.url,
                data: matches2,
              })
              chrome.storage.local.set({
                package_content: package_contentArray,
              })
            }
          })
        }
        const matches3 = text.match(url_regex)
        if (matches3) {
          chrome.storage.local.get("url_content", function (result) {
            const url_contentArray = result.url_content || []
            if (
              url_contentArray.findIndex(
                (item) => item.url === details.url
              ) == -1
            ) {
              url_contentArray.push({
                current_url: currentHost,
                url: details.url,
                data: matches3,
              })
              chrome.storage.local.set({
                url_content: url_contentArray,
              })
            }
          })
        }
      })
  }
})

    }
  })
}

function removeListener() {
  chrome.webRequest.onBeforeRequest.removeListener(listener)
  listenerAdded = false
}

function addListener() {
  if (!listenerAdded) {
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      { urls: ["<all_urls>"] },
      ["blocking"]
    )
    listenerAdded = true
  }
}
