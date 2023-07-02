document.addEventListener('DOMContentLoaded', function() {
  var toggleButton = document.getElementById('toggleButton');
  chrome.storage.sync.get('isEnabled', function(data) {
    var isEnabled = data.isEnabled !== false;
    toggleButton.innerText = isEnabled ? '关闭' : '开启';
    toggleButton.addEventListener('click', function() {
      isEnabled = !isEnabled;
      chrome.storage.sync.set({'isEnabled': isEnabled});
      toggleButton.innerText = isEnabled ? '关闭' : '开启';
      chrome.runtime.sendMessage({isEnabled: isEnabled});
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get("jsContent", function(data) {
    if (Array.isArray(data.jsContent) && data.jsContent.length > 0) {
      const contentList = document.getElementById("content-list");
      for (const item of data.jsContent) {
        if(document.getElementById("content-list").outerHTML.indexOf(item.data)==-1){
            chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            chrome.browserAction.setBadgeText({ text: "1" })
            const dataElement = document.createElement("a");
            dataElement.textContent = item.data;
            dataElement.href=item.url;
            dataElement.target="_blank";
            contentList.appendChild(dataElement);
            contentList.appendChild(document.createElement("br"));
        }
        
      }
    } else {
      document.getElementById("content-list").textContent = "没有匹配到secret内容";
    }
  });


  chrome.storage.local.get("package_content", function(data) {
    if (Array.isArray(data.package_content) && data.package_content.length > 0) {
      const contentList = document.getElementById("content-list2");
      for (const item of data.package_content) {
        if(document.getElementById("content-list2").outerHTML.indexOf(item.data)==-1){
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: "1" });
        const dataElement = document.createElement("a");
        dataElement.href=item.url;
        dataElement.target="_blank";
        dataElement.textContent = item.data;
        contentList.appendChild(dataElement);
        contentList.appendChild(document.createElement("br"));
      }
      }
    } else {
      document.getElementById("content-list2").textContent = "没有匹配到package内容";
    }
  });

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
testURL = tabs[0].url;
try {
  var urlObject = new URL(testURL);
currentHost = urlObject.hostname;
}
catch(err){
  currentHost="test";
}
if(currentHost==undefined){
  currentHost="test";
}
chrome.storage.local.get("url_content", function(data) {
    if (Array.isArray(data.url_content) && data.url_content.length > 0) {
      const contentList = document.getElementById("content-list3");
      for (const item of data.url_content) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: "1" });
        for (const url_str of item.data) {
          const newStr = url_str.substring(1, url_str.length - 1);
          if(item.current_url==currentHost&document.getElementById("content-list3").outerHTML.indexOf(">"+newStr+"<")==-1){
          const dataElement = document.createElement("a");
          if(/^application\/[^\/]+$|^.*\.(?:png|jpg|vue|svg|css)$|^text\/[^\/]+$|w3\.org|^multipart\/[^\/]+$|image\/png|YYYY\/|\/YYYY|\/YYY|YYY\/|aegis\.qq\.com/.test(newStr)){
            continue;
          }
          dataElement.href=item.url;
          dataElement.target="_blank";
          dataElement.textContent = newStr;
          contentList.appendChild(dataElement);
          contentList.appendChild(document.createElement("br"));
        }
      }
      
      }
    } else {
      document.getElementById("content-list3").textContent = "没有匹配到url内容";
    }
  });
});


const copyBtn = document.getElementById('copy-btn');
copyBtn.addEventListener('click', () => {
  const ul = document.getElementById('content-list3');
  const links = ul.getElementsByTagName('a');
  let output = '';
  for (let i = 0; i < links.length; i++) {
    output += links[i].textContent + '\n';
  }
  const textToCopy = output;
  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  copyBtn.innerText = '已复制';
});

const filterBtn = document.getElementById('filter-btn');
filterBtn.addEventListener('click', () => {
  const inputValue = document.getElementById("in").value;
  // 遍历所有的ul元素
// 检查页面是否包含id为'aaa'的ul元素
const ul = document.querySelector('#content-list3');
if (ul) {
  // 遍历当前id为'aaa'的ul元素中的所有a元素
  ul.querySelectorAll('a').forEach((a) => {
    // 检查当前a元素的文本是否包含'aaa'
    if (!a.innerText.includes(inputValue)) {
      // 如果不包含，则将当前a元素从DOM中删除
      a.remove();
    }
  });
}
// 遍历DOM树中的所有元素
document.querySelectorAll('*').forEach((el) => {
  // 检查当前元素是否为br标签
  if (el.tagName === 'BR') {
    // 检查当前元素前一个兄弟元素是否也是br标签
    const prevSibling = el.previousSibling;
    if (prevSibling && prevSibling.tagName === 'BR') {
      // 如果前一个兄弟元素也是br标签，则将当前元素从DOM树中删除
      el.remove();
    }
  }
});

});

  let clear = document.getElementById('clear');
  clear.onclick=clearit;
  function clearit(){
    document.getElementById("content-list").textContent = "没有匹配到secret内容";
    document.getElementById("content-list2").textContent = "没有匹配到package内容";
    document.getElementById("content-list3").textContent = "没有匹配到url内容";
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.storage.local.clear(() => {
  });
  }
});