#### 介绍
该下拉方法适用于移动端下拉刷新（自定义回调方法）场景
#### 使用方法
es6 下直接引用 pullRefresh_es6.js 文件即可 import 引用
其他情况可引用 pullRefresh.js，即可通过 require 方式引用或直接使用 window 全局变量 pullRefresh 

具体使用：  
配置  
var pullObj = pullRefresh({
    parEl: document.body, // id 或 dom元素
    tarEl: "app", // id 或 dom元素
    pullCallback: function() {  
        // 下拉回调处理 your code  
        handler();  
        // 结束  
        pullObj.finish();  
    }
});  
初始化  
pullObj.init();  