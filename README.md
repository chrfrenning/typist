# Typist

Javascript library to type with the same effect as ChatGPT (and possibly making a video file of it).

## Overview

Include in your file, mark sections with typist and type-effect, and your HTML fill will automagically use the ChatGPT-similar typing effect.

## Use

* Include `typist.css` and `typist.js` in your html file
```
    <head>
        <link rel="stylesheet" href="typist.css">
        <script src="typist.js"></script> 
        ...
```
* Mark an element, e.g. a `div` with the attribute `typist`
```
    <div id="capture" typist>
    ...</div>
```
* Mark elements you want to be typed with the `type-effect` attribute
```
    <div type-effect>
        <p>Creating metadata tags...</p>
        <ul>
            <li>Subject..
```
* Listen for `typist-ready` event and call `startTypist()`
```
    <script>
        document.addEventListener('typist-ready', function (e) {
            startTypist();
        });
    </script>
```
* To see a sample implementation, view `typist.html`

## Record it for use in e.g. presentations

* Follow instructions above
* Include `recorder.js` in your html
```
    <head>
        <script src="recorder.js"></script>
        ...
```
* Include the following script at the end of your page
```
    <script>
        document.addEventListener('typist-start', function (e) {
            startRecording();
        });
        
        document.addEventListener('typist-update', function (e) {
            document.dispatchEvent( new Event('frame-update') );
        });
        
        document.addEventListener('typist-done', function (e) {
            stopRecording();
        });
        
        document.addEventListener('recorder-ready', function (e) {
            startTypist();
        });
    </script>
```
* When typist is done, after two secs, a video will be downloaded

