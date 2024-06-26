const typeSpeed = 40;
let typeQueue = [];

doType = () => {
    if (typeQueue.length > 0) {

        if ( typeQueue[0].onfinal != undefined ) {

            typeQueue[0].onfinal();
            typeQueue.shift();

            const event = new Event('typist-done');
            document.dispatchEvent(event);

        } else if ( typeQueue[0].type === 'insert' ) {

            var {type, copy, target} = typeQueue[0];
            target.appendChild(copy);
            typeQueue.shift();

            const event = new Event('typist-update');
            document.dispatchEvent(event);

            doType();

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

            const event = new Event('typist-update');
            document.dispatchEvent(event);

            randomDelay = Math.abs(typeSpeed * (Math.cos(text.textContent.length)) + (typeSpeed ** Math.random()));
            setTimeout(doType, randomDelay);

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
    
    if ( node.nodeName === '#text' && anyParentHasAttribute(node, 'type-effect') ) {
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

setupTypist = (node) => {
    node.childNodes.forEach(function(child) {
        duplicateNode(child, node);       
    });
    node.replaceChildren();
    
    
    onfinal = () => {
        // console.log("Done!");
    }
    
    typeQueue.push( {onfinal} );
}

startTypist = () => {
    const event = new Event('typist-start');
    document.dispatchEvent(event);

    doType();
}

// Start the typist on all elements attributed typist
// and type all elements marked with type-effect attribute

document.addEventListener("DOMContentLoaded", function() {
    var elements = document.querySelectorAll("[typist]");
    elements.forEach(function(element) {
        setupTypist(element);
        document.dispatchEvent(new Event("typist-ready"));
    });
});
