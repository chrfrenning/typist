const typeSpeed = 40;
let typeQueue = [];

typeSomething = () => {
    if (typeQueue.length > 0) {

        if ( typeQueue[0].onfinal != undefined ) {

            typeQueue[0].onfinal();
            typeQueue.shift();

        } else if ( typeQueue[0].type === 'insert' ) {

            var {type, copy, target} = typeQueue[0];
            target.appendChild(copy);
            typeQueue.shift();
            typeSomething();

        } else {

            var {type, text, string} = typeQueue[0];

            var numLetters = Math.floor(Math.random() * 4) + 1;
            
            text.textContent += string.substring(0, numLetters);
            typeQueue[0].string = string.slice(numLetters);

            // find the computed font size for this element
            var computedStyle = window.getComputedStyle(text.parentNode);
            var fontSize = computedStyle.getPropertyValue('font-size');
            var lineHeight = computedStyle.getPropertyValue('line-height');
            var height = parseInt(lineHeight) || parseInt(fontSize);
            height = Math.floor(height * 0.8);
            console.log(height);

            if ( text.parentNode.querySelector("#cursor") == null ) {
                const dot = document.createElement("span");
                
                dot.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>';
                dot.id = "cursor";
                dot.className = "cursor";
                dot.style.width = `${height}px`;
                dot.style.height = `${height}px`;

                text.parentNode.appendChild(dot);
            }
            
            if (typeQueue[0].string.length === 0) {
                typeQueue.shift();

                // Remove the dot
                const dot = text.parentNode.querySelector("#cursor");
                if (dot) {
                    dot.parentNode.removeChild(dot);
                }
            }

            randomDelay = Math.abs(typeSpeed * (Math.cos(text.textContent.length)) + (typeSpeed ** Math.random()));
            setTimeout(typeSomething, randomDelay);

        }
    }
}

anyParentHasAttribute = (node, attr) => {
    if (node.hasAttribute != undefined && node.hasAttribute(attr)) {
        return true;
    }

    if (node.parentNode != null) {
        return anyParentHasAttribute(node.parentNode, attr);
    }

    return false;
}

duplicateNode = (node, target) => {
    var copy = node.cloneNode(false);
    
    if ( node.nodeName === '#text' && anyParentHasAttribute(node, 'typist') ) {
        var string = node.textContent;
        
        var text = document.createTextNode("");

        var type = "insert";
        var copy = text;
        typeQueue.push({type, copy, target});

        type = "type";
        typeQueue.push({type, text, string});
    }
    else {
        // make a copy of the child
        var type = "insert";
        typeQueue.push({type, copy, target});
        node.childNodes.forEach(function(child) {
            duplicateNode(child, copy);
        });
    }
}

var node = document.getElementById('capture');
node.childNodes.forEach(function(child) {
    var target = document.getElementById('target');
    duplicateNode(child, target);       
});

onfinal = () => {
    console.log("Done!");
}

typeQueue.push( {onfinal} );

typeSomething();