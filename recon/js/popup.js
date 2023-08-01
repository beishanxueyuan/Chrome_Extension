function getIP(domain, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.uutool.cn/dns/nslookup/?domain=" + domain);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.status === 1 && response.data.a.length > 0) {
        var ip = response.data.a[0];
        console.log("IP address for " + domain + " is " + ip);
        callback(ip); // 调用回调函数并将IP地址传递给它
      } else {
        console.log("No IP address found for " + domain);
        callback(null); // 如果未找到IP地址，则将null传递给回调函数
      }
    } else {
      console.log("Error");
      callback(null); // 如果发生错误，则将null传递给回调函数
    }
  };
  xhr.send();
}




chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  var myInput = document.getElementById("myInput")
    var url = new URL(tabs[0].url);
    let hostname = url.hostname
    var pageTitle = tabs[0].title;
    function SearchTitle() {
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=' + pageTitle, active: false });
    }
    document.getElementById("domain").innerHTML = "<a>"+pageTitle+"</a>";

    function SearchDomain() {
      if (myInput.value != "") {
        hostname = myInput.value
      }
        query = hostname;
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.bing.com/search?q=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.google.com/search?q=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://github.com/search?q=' + query + "&type=code", active: false });
        chrome.tabs.create({ url: "https://fofa.info/result?qbase64=" + btoa("host=\"" + query + "\""), active: false });
    }
    function SearchIP() {
      if (myInput.value != "") {
        hostname = myInput.value
      }

      // 调用getIP函数并传递一个回调函数作为第二个参数
        getIP(hostname, function(ipAddress) {
          host_ip=ipAddress;
          if(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)){
            host_ip=hostname;
      }
          
          chrome.tabs.create({ url: 'https://fofa.info/result?qbase64=' + btoa("ip=\"" + host_ip + "/24\""), active: false });
        let serch_ipIndex = host_ip.lastIndexOf(".");
        let serch_ip = host_ip.slice(0, serch_ipIndex) + ".*";
        chrome.tabs.create({ url: 'https://www.google.com/search?q=site:' + serch_ip, active: false });
        });
        
    }
    function SearchAll() {
      if (myInput.value != "") {
        hostname = myInput.value
      }
        query = hostname;
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=' + pageTitle, active: false });
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.bing.com/search?q=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.google.com/search?q=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://github.com/search?q=' + query + "&type=code", active: false });
        chrome.tabs.create({ url: "https://fofa.info/result?qbase64=" + btoa("host=\"" + query + "\""), active: false });
        chrome.tabs.create({ url: 'https://fofa.info/result?qbase64=' + btoa("ip=\"" + host.ip_str + "/24\""), active: false });
        let serch_ipIndex = host.ip_str.lastIndexOf(".");
        let serch_ip = host.ip_str.slice(0, serch_ipIndex) + ".*";
        chrome.tabs.create({ url: 'https://www.google.com/search?q=site:' + serch_ip, active: false });
    }
    let btnSearchDomain = document.getElementById('btnSearchDomain');
    btnSearchDomain.onclick = SearchDomain;
    let btnSearchIP = document.getElementById('btnSearchIP');
    btnSearchIP.onclick = SearchIP;
    let btnSearchAll = document.getElementById('btnSearchAll');
    btnSearchAll.onclick = SearchAll;
    let btnSearchTitle = document.getElementById('domain');
    btnSearchTitle.onclick = SearchTitle;
    document.body.classList.remove('hidden')
    
});