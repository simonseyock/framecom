paperglider
========

Minimal library for common communication tasks between different window objects.

Installation
------------

```
npm install paperglider
```

The PaperGlider class can be included via AMD, commonjs or a script tag.

Example
------

We assume a main frame with origin `http://main.example.com` and a child frame with origin `http://child.example.com`. 

Main frame:

```javascript
    const PaperGlider = require('paperglider');
    
    const com = PaperGlider.connectIframe(iframe, 'http://child.example.com');

    com.replyOn('someaction', (a, b) => a === b);
```

Now everytime the paperglider object in the main frame receives a message with the action `'someaction'` with the proper targetOrigin, it responds by comparing both sent parameters.

Child frame: 

```javascript
    const PaperGlider = require('paperglider');
    
    const com = PaperGlider.connectParent('http://main.example.com');

    com.request('someaction', [2, 2], result => console.log(result));
```

More complete examples can be found in the examples folder. The files `iframe.html` and `window-open.html` can both be opened locally.

Documentation
-------------

An Api documentation lives the file APIDOC.md in this repository.
