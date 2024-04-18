// Recorder.js

const mimetype = 'video/webm';
const fileextension = ".webm";
const recorders = [];

startRecording = function() {
    recorders.forEach(function(recorder) {
        recorder.start();
    });
}

stopRecording = function() {
    recorders.forEach(function(recorder) {
        setInterval(function() {
            recorder.stop();
        }, 2000);
    });
}

setupRecorder = function(element) {
    let capture = element;

    // find computed width and height
    var style = window.getComputedStyle(element);
    var width = parseInt(style.getPropertyValue('width'));
    var height = parseInt(style.getPropertyValue('height'));
    // console.log("Recording: ", element);
    // console.log("Size: ", width, height);

    let target = document.createElement('canvas');
    target.width = width;
    target.height = height;

    const stream = target.captureStream(30); // 30 FPS

    let chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: mimetype });
    recorders.push( recorder );

    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimetype });
        const videoURL = URL.createObjectURL(blob);

        // You can download the video or embed it in the page
        const downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'typist-animation' + fileextension;
        downloadLink.click();
    };

    document.addEventListener("frame-update", function() {

        htmlToImage.toCanvas(capture, { quality: 1.0, pixelRatio: 1 })
            .then(function (canvas) {
    
                let ctx = target.getContext('2d');
                ctx.drawImage(canvas, 0, 0, 640, 320);

            });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/html-to-image';
    script.onload = function() {
        var elements = document.querySelectorAll("[record]");
        elements.forEach(function(element) {
            setupRecorder(element);
        });
        document.dispatchEvent(new Event("recorder-ready"));
    }
    document.head.appendChild(script);
});
