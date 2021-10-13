/**
 * @author yibo.wei
 * @email 15594982127@163.com
 * @param {Object} options
 * @使用方法
 *     const pullObj = pullRefresh(options);
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

const parseTime = (timestamp) => {
    const a = new Date(timestamp);
    const h = a.getHours();
    const s = a.getMinutes();
    const double = t => t > 9 ? t : "0" + t;
    return double(h) + ":" + double(s);
}
const loadingIcon = "data:image/png;base64,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";
const defaultOptions = {
    parEl: document.body, // 父元素（不动的大盒子）
    tarEl: "app", // 目标元素（滑动的子盒子）
    pullCallback: () => { // 有效下拉回调，通常在内部获取数据并调用 finish() 方法
        window.location.reload();
    }
};
function pullRefresh(_options) {
    const options = {
        ...defaultOptions,
        ..._options
    };
    let lastUpdateTime = new Date().getTime();
    let { parEl, tarEl, pullCallback } = options;
    if(typeof parEl === "string") {
        parEl = document.getElementById(parEl);
    }
    if(typeof tarEl === "string") {
        tarEl = document.getElementById(tarEl);
    }
    const appStyleCache = tarEl.style;
    const tarElPosition = appStyleCache.position;
    const parTopDistance = parEl.getBoundingClientRect().top;
    if(!tarElPosition) {
        tarEl.style["position"] = "relative";
        appStyleCache["position"] = "relative";
    }
    const pullTextEl = document.createElement("p");

    pullTextEl.style = "width: 100%; text-align: center; position: absolute; z-index: 0; left: 0; top: -50px; font-size: 12px; line-height: 16px; color: #666; display: none;";
    const loadImg = document.createElement("i");
    loadImg.style = `display: inline-block; width: 15px; height: 15px; margin-right: 5px; background: url('${loadingIcon}'); background-size: 100% 100%; vertical-align: middle; animation: looprotate 2s linear infinite;`;
    const loadText = document.createElement("span");
    loadImg.style.opacity = 0;
    // 是否执行有效下拉回调标志位
    let refreshStatus = false;
    const isQBrowser = () => { // qq系浏览器
        const ua = navigator.userAgent.toLowerCase();
        return !!ua.match(/mqqbrowser|qzone|qqbrowser/i);
    };
    const finish = () => {
        if(isQBrowser()) return;
        lastUpdateTime = new Date().getTime();
        loadImg.style.opacity = 0;
        loadText.innerText = `刷新成功 \n最后更新：${parseTime(lastUpdateTime)}`;
        setTimeout(() => {
            tarEl.style["transition"] = "transform 0.2s";
            tarEl.style["transform"] = "translate(0, 0)";
            setTimeout(() => {
                pullTextEl.style["display"] = "none";
                // tarEl.style = appStyleCache;
            }, 400);
        }, 500);
    };
    const init = () => {
        if(isQBrowser()) return;
        tarEl.appendChild(pullTextEl);
        pullTextEl.appendChild(loadImg);
        pullTextEl.appendChild(loadText);
        let startP, moveLen;
        // 下拉处理
        const pullHandler = (moveLen) => {
            // 下拉元素距离视口顶部距离
            const tarTopDistance = tarEl.getBoundingClientRect().top;
            // 下拉元素距离父级顶部距离
            const toParTopDistance = tarTopDistance - parTopDistance;
            // 有效下拉才做处理
            if(toParTopDistance >= 0) {
                if(pullTextEl.style["display"] === "none") {
                    // 有效下拉时才展示提示文案
                    pullTextEl.style["display"] = "block";
                }
                // 下拉效果
                if(moveLen > 0 && moveLen < 50){
                    tarEl.style["transform"] = "translate(0, " + moveLen + "px)";
                } else if(moveLen >= 50 && moveLen < 100) { // 到刷新标志，下拉阻尼增大
                    const _moveLen = 50 + (moveLen - 50) * 0.6;
                    tarEl.style["transform"] = "translate(0, " + _moveLen + "px)";
                } else if(moveLen >= 100) { // 下拉超过 100，下拉阻尼再次增大
                    const _moveLen = (50 + ( 100 - 50)*0.6) + (moveLen - 100) * 0.2;
                    tarEl.style["transform"] = "translate(0, " + _moveLen + "px)";
                }
                // 下拉触发
                if(toParTopDistance < 55) {
                    loadText.innerText = `下拉可以刷新... \n最后更新：${parseTime(lastUpdateTime)}`;
                    refreshStatus = false;
                } else {
                    loadText.innerText = `松开立即刷新... \n最后更新：${parseTime(lastUpdateTime)}`;
                    refreshStatus = true;
                }
            }
        };
        tarEl.addEventListener("touchstart", (e) => {
            startP = e.touches[0].pageY;
            tarEl.style["transition"] = "transform 0s";
        });
        tarEl.addEventListener("touchmove", (e) => {
            moveLen = e.touches[0].pageY - startP;
            pullHandler(moveLen);
        });
        tarEl.addEventListener("touchend", () => {
            // 下拉元素距离视口顶部距离
            const tarTopDistance = tarEl.getBoundingClientRect().top;
            // 下拉元素距离父级顶部距离
            const toParTopDistance = tarTopDistance - parTopDistance;
            if(toParTopDistance > 0) { // 当有效下拉发生后动画归位，重置样式
                if(refreshStatus) {
                    loadImg.style.opacity = 1;
                    loadText.innerText = `正在刷新数据中... \n最后更新：${parseTime(lastUpdateTime)}`;
                    pullCallback && pullCallback();
                    tarEl.style["transition"] = "transform 0.4s";
                    tarEl.style["transform"] = "translate(0, 55px)";
                } else {
                    tarEl.style["transition"] = "transform 0.4s";
                    tarEl.style["transform"] = "translate(0, 0)";
                    setTimeout(() => {
                        pullTextEl.style["display"] = "none";
                        tarEl.style = appStyleCache;
                    }, 400);
                }
            } else { // 未发生有效下拉的直接重置样式
                pullTextEl.style["display"] = "none";
                tarEl.style = appStyleCache;
            }
        });
    };
    return {
        init,
        finish
    };
}