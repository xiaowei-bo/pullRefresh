/**
 * @param {Function}pullCallback
 * @author yibo.wei
 * @email 15594982127@163.com
 * 下拉回调，不传默认为 reload();
 * 有效下拉：指页面被下拉至文档顶部离开视口顶部
 * 暂不支持 微信等 q系浏览器
 * @使用方法
 *     var pullObj = pullRefresh(() => {
 *         // 刷数据接口
 *         // 刷新完成之后调用 pullObj.finish(); 顶部刷新区归位
 *     });
 *     pullObj.init(); 初始化
 */
(function() {
    if(typeof module === "object" && typeof module.exports === "object") {
        module.exports = pullRefresh;
    }
    if(typeof window !== "undefined") {
        window.pullRefresh = pullRefresh;
    }
})();


function pullRefresh(pullCallback) {
    var body = document.body;
    var app = document.getElementById('app');
    var app_style_cache = app.style;
    var pullTextEl = document.createElement('p');

    pullTextEl.style = "width: 100%; text-align: center; position: fixed; z-index: -1; left: 0; top: 0; font-size: 12px; line-height: 40px; color: #999; display: none;";
    var loadText = document.createElement('span');
    // 是否执行有效下拉回调标志位
    var refreshStatus = false;
    var isQBrowser = () => { // qq系浏览器
        var ua = navigator.userAgent.toLowerCase();
        return !!ua.match(/mqqbrowser|qzone|qqbrowser/i);
    };
    var finish = () => {
        if(isQBrowser()) return;
        loadText.innerText = '刷新成功';
        setTimeout(() => {
            app.style['transition'] = 'transform 0.2s';
            app.style['transform'] = 'translate(0, 0)';
            setTimeout(() => {
                pullTextEl.style['display'] = 'none';
                app.style = app_style_cache;
            }, 400);
        }, 500);
    };
    var init = () => {
        if(isQBrowser()) return;
        body.appendChild(pullTextEl);
        pullTextEl.appendChild(loadText);
        var startP, moveLen;
        // 默认有效下拉回调
        var _pullCallback = () => {
            window.location.reload();
        };
        // 下拉处理
        var _pullHandler = (moveLen) => {
            // 下拉元素距离视口顶部距离
            var top_distance = app.getBoundingClientRect().top;
            // 有效下拉才做处理
            if(top_distance >= 0) {
                if(pullTextEl.style['display'] === 'none') {
                    // 有效下拉时才展示提示文案
                    pullTextEl.style['display'] = 'block';
                }
                // 下拉效果
                if(moveLen > 0 && moveLen < 50){
                    app.style['transform'] = 'translate(0, ' + moveLen + 'px)';
                } else if(moveLen >= 50 && moveLen < 100) { // 到刷新标志，下拉阻尼增大
                    var _moveLen = 50 + (moveLen - 50) * 0.6;
                    app.style['transform'] = 'translate(0, ' + _moveLen + 'px)';
                } else if(moveLen >= 100) { // 下拉超过 100，下拉阻尼再次增大
                    var _moveLen = 80 + (moveLen - 100) * 0.2;
                    app.style['transform'] = 'translate(0, ' + _moveLen + 'px)';
                }
                // 下拉触发
                if(top_distance < 50) {
                    loadText.innerText = '下拉即可刷新...';
                    refreshStatus = false;
                } else {
                    loadText.innerText = '松开立即刷新...';
                    refreshStatus = true;
                }
            }
        };
        app.addEventListener('touchstart', (e) => {
            startP = e.touches[0].pageY;
            app.style['transition'] = 'transform 0s';
        });
        app.addEventListener('touchmove', (e) => {
            moveLen = e.touches[0].pageY - startP;
            _pullHandler(moveLen);
        });
        app.addEventListener('touchend', (e) => {
            // 下拉元素距离视口顶部距离
            var top_distance = app.getBoundingClientRect().top;
            if(top_distance > 0) { // 当有效下拉发生后动画归位，重置样式
                if(refreshStatus) {
                    loadText.innerText = '数据加载中...';
                    pullCallback ? pullCallback() : _pullCallback();
                    app.style['transition'] = 'transform 0.4s';
                    app.style['transform'] = 'translate(0, 40px)';
                } else {
                    app.style['transition'] = 'transform 0.4s';
                    app.style['transform'] = 'translate(0, 0)';
                    setTimeout(() => {
                        pullTextEl.style['display'] = 'none';
                        app.style = app_style_cache;
                    }, 400);
                }
            } else { // 未发生有效下拉的直接重置样式
                pullTextEl.style['display'] = 'none';
                app.style = app_style_cache;
            }
        })
    };
    return {
        init,
        finish
    }
}
