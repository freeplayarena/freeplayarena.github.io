const container = document.querySelector('#unity-container');
const canvas = document.querySelector('#unity-canvas');
const loadingBar = document.querySelector("#unity-loading-bar");
const progressBarFull = document.querySelector("#unity-progress-bar-full");
const progressValue = document.querySelector('#unity-progress-value');
const progressText = document.querySelector('#unity-progress-text');
const loaderUrl = "Build/8.0.7.10.loader.js";

const config = {
    dataUrl: "Build/8.0.7.10.data",
    frameworkUrl: "Build/8.0.7.10.framework.js",
    codeUrl: "Build/8.0.7.10.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DigitalWill",
    productName: "Trash Factory",
    productVersion: "8.0.7.10",
    // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";
    // To lower canvas resolution on mobile devices to gain some
    // performance, uncomment the following line:
    config.devicePixelRatio = 1;
};


//////////////////////////////////////////
// Loading bar and progress text
//////////////////////////////////////////

loadingBar.style.display = "block";

let dotCount = 0;
var dots = "";

var dotInterval = setInterval(() => {
    if (dotCount > 3) {
        dotCount = 0;
    }
    dotCount++;
    dots = new Array(dotCount % 10).join('.');
}, 500);

const progressTexts = {
    // If you want to display different texts while loading, add them here and then
    // reference them in updateLoadingText().
    default: "Loading game",
};

function updateProgressText(value) {
    // You can add different value ranges here to display different text to the player during the loading process.
    if (value < 100) {
        progressText.innerText = progressTexts.default + dots;
    }
}

//////////////////////////////////////////
// Unity loader
//////////////////////////////////////////

// Wortal SDK has an isInitialized property that we would normally check before accessing the SDK, but
// in the jslib we use gameInstance.Module to return data to the WASM module, which may not be available
// yet even if the SDK is initialized. So we use this flag instead of Wortal.isInitialized.
window.isUnitySDKInitialized = false;

let platform = "";
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    window.Wortal.initializeAsync().then(() => {
        createUnityInstance(canvas, config, (progress) => {
            window.Wortal.setLoadingProgress(100 * progress);
            let value = Math.round(progress * 100);
            updateProgressText(value);

            progressValue.innerText = value + '%';
            progressBarFull.style.width = value + '%';
        }).then((unityInstance) => {
            loadingBar.style.display = 'none';
            clearInterval(dotInterval);

            window.Wortal.setLoadingProgress(100);
            window.Wortal.startGameAsync().catch(error => {
                console.error(error);
        });

            gameInstance = unityInstance;
            window.isUnitySDKInitialized = true;
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(error);
    });
}

document.body.appendChild(script);
