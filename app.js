let os;
let btnValue = 0;
let differential = 0;
let currentAlpha;

// DOM Content Loaded
window.addEventListener("DOMContentLoaded", init);

// Initialize
function init() {
    os = detectOSSimply();
    if (os == "iphone") {
        document.querySelector("#js-permitBtn").addEventListener("click", permitDeviceOrientationForSafari);
        window.addEventListener("deviceorientation", orientation, true);
    } else if (os == "android") {
        document.querySelector("#js-permitBtn").addEventListener("click", permitDeviceOrientationForAndroid);
    } else {
        window.alert("PC非対応です！");
    }
}

// Androidのセンサーの許可を要求
function permitDeviceOrientationForAndroid() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("deviceorientation", orientation, true);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener("deviceorientation", orientation, true);
    }
}

// 方位角を取得する関数
function orientation(event) {
    let alpha = event.alpha; // Z軸の回転（方位角）

    let degrees;
    if (os == "iphone") {
        // iPhoneの場合、SafariのwebkitCompassHeadingを使用
        degrees = event.webkitCompassHeading || alpha;
    } else {
        // Androidの場合、alpha値をそのまま使用（水平角度）
        degrees = alpha; // alphaが方位角を表している
    }

    currentAlpha = degrees;

    // ボタン押下時の角度との差分を計算
    differential = (currentAlpha - btnValue + 360) % 360;
    if (differential > 180) {
        differential -= 360;
    }

    // 角度差分を画面に表示
    document.querySelector("#differential").innerHTML = differential.toFixed(0); // 差分の角度を表示
}

// OSの簡易判定
function detectOSSimply() {
    let ret;
    if (navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0) {
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }
    return ret;
}

// Safariでセンサーの許可を要求
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", orientation, true);
            }
        })
        .catch(console.error);
}

// ボタンを押した時の角度を保存し、差分を計算
function setBtn() {
    btnValue = currentAlpha;
}
