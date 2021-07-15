要在窗口关闭时发起请求，只能是在 window.unload 事件中执行。但根据 mdn 中的描述：

> 

所以不能直接写

```text
window.onunload = () => {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
}
```

不过可以用同步的 XMLHttpRequest：

```text
request.open('GET', url, false);
```

这个方案的问题在于关闭窗口时要等待服务器返回，导致用户操作时会有明显卡顿。所以这时就需要请出 navigator.sendBeacon()。

navigator.sendBeacon() 该方法主要是提供给开发人员埋点，在用户离开页面时发送收集用户的统计和诊断数据。

但该方法只在比较新的浏览器中，尤其 IE，完全不支持。为了兼容浏览器，最终代码为：

```javascrpit
if (navigator.sendBeacon) {
    let data = new FormData();
    data.append('hello', 'world');
    navigator.sendBeacon(url, data);
} else {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send({hello: 'world'});
}

```

上面例子中没有针对请求失败的处理，不过 unload 事件中无法被停止，所以请求失败好像也没办法，这方面还需要研究。

## 补充

因为 navigator.sendBeacon 只能使用 post 方法去发送请求，但接口方法是 delete, 因此我尝试了使用其他的两种方法：

```javascrpit
// fetch
function send() {
    let data = new FormData();
    data.append('hello', 'world');

    fetch('/users', {
        method: 'delete',
        body: data,
        headers: {
            type: 'application/json'
        },
        credentials: 'include',
        keepalive: true,
    })
}
// 同步 XMLHttpRequest
function resquest() {
    var request = new XMLHttpRequest();
    request.open('delete', '/users', false);
    request.setRequestHeader('type', 'application/json');
    request.send(JSON.stringify({hello: 'world'}));
}
```

首先 fetch 是依据 w3c 规范中关于 sendBeacon `What sendBeacon() does not do and is not intended to solve` 词条的说明 [链接](https://w3c.github.io/beacon/#sec-sendBeacon-method)

> The sendBeacon() method does not provide ability to customize the request method, provide custom request headers, or change other processing properties of the request and response. Applications that require non-default settings for such requests should use the [FETCH] API with keep-alive flag set to true.

注：我用express起了一个简单的server，接口请求会延迟5秒才会返回，在edge下执行表现怪异，似乎未到5秒就直接中止。

然后同步的 XMLHttpRequest，MDN [__文档__](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests) 有写到：

> **注意：**从Gecko 30.0 (Firefox 30.0 / Thunderbird 30.0 / SeaMonkey 2.27)，Blink 39.0和Edge 13开始，主线程上的同步请求由于对用户体验的负面影响而被弃用。

因此在高版本的浏览器中无法使用，因我的电脑中没有低版本浏览器，未对此做过实验，目前电脑中的浏览器确认都无法使用。