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
    
    const com = new PaperGlider(window, iframe.contentWindow, 'http://main.example.com',
      'http://child.example.com');

    com.replyOn('someaction', (a, b) => a === b);
```

Now everytime the paperglider object in the main frame receives a message with the action `'someaction'` with the proper targetOrigin, it responds by comparing both sent parameters.

Child frame: 

```javascript
    const PaperGlider = require('paperglider');
    
    const com = new PaperGlider(window, window.parent, 'http://child.example.com',
      'http://main.example.com');

    com.request('someaction', [2, 2], result => console.log(result));
```

More complete examples can be found in the examples folder. The files `iframe.html` and `window-open.html` can both be opened locally.

Documentation
-------------

## paperglider
A module for communication between window objects.

<a name="module_{PaperGlider}"></a>

## {PaperGlider}

* [{PaperGlider}](#module_{PaperGlider})
    * [~PaperGlider](#module_{PaperGlider}..PaperGlider)
        * [new PaperGlider(self, target, [targetOrigin])](#new_module_{PaperGlider}..PaperGlider_new)
        * _instance_
            * [.isConnected()](#module_{PaperGlider}..PaperGlider+isConnected) ⇒ <code>boolean</code>
            * [.send(action, args)](#module_{PaperGlider}..PaperGlider+send)
            * [.receive(action, callback)](#module_{PaperGlider}..PaperGlider+receive) ⇒ <code>function</code>
            * [.replyOn(action, callback)](#module_{PaperGlider}..PaperGlider+replyOn) ⇒ <code>function</code>
            * [.request(action, args, callback)](#module_{PaperGlider}..PaperGlider+request)
            * [.dispose()](#module_{PaperGlider}..PaperGlider+dispose)
            * [.onConnect(callback)](#module_{PaperGlider}..PaperGlider+onConnect)
        * _static_
            * [.connectChild(child, [childOrigin])](#module_{PaperGlider}..PaperGlider.connectChild) ⇒ <code>PaperGlider</code>
            * [.connectParent(parent, [parentOrigin])](#module_{PaperGlider}..PaperGlider.connectParent) ⇒ <code>PaperGlider</code>

<a name="module_{PaperGlider}..PaperGlider"></a>

### {PaperGlider}~PaperGlider
**Kind**: inner class of [<code>{PaperGlider}</code>](#module_{PaperGlider})  

* [~PaperGlider](#module_{PaperGlider}..PaperGlider)
    * [new PaperGlider(self, target, [targetOrigin])](#new_module_{PaperGlider}..PaperGlider_new)
    * _instance_
        * [.isConnected()](#module_{PaperGlider}..PaperGlider+isConnected) ⇒ <code>boolean</code>
        * [.send(action, args)](#module_{PaperGlider}..PaperGlider+send)
        * [.receive(action, callback)](#module_{PaperGlider}..PaperGlider+receive) ⇒ <code>function</code>
        * [.replyOn(action, callback)](#module_{PaperGlider}..PaperGlider+replyOn) ⇒ <code>function</code>
        * [.request(action, args, callback)](#module_{PaperGlider}..PaperGlider+request)
        * [.dispose()](#module_{PaperGlider}..PaperGlider+dispose)
        * [.onConnect(callback)](#module_{PaperGlider}..PaperGlider+onConnect)
    * _static_
        * [.connectChild(child, [childOrigin])](#module_{PaperGlider}..PaperGlider.connectChild) ⇒ <code>PaperGlider</code>
        * [.connectParent(parent, [parentOrigin])](#module_{PaperGlider}..PaperGlider.connectParent) ⇒ <code>PaperGlider</code>

<a name="new_module_{PaperGlider}..PaperGlider_new"></a>

#### new PaperGlider(self, target, [targetOrigin])
Sets up the communication between two window objects. The target origin can be omitted in which case it is set to `'*'`,
  which normally should be avoided.


| Param | Type | Default |
| --- | --- | --- |
| self | <code>Window</code> |  | 
| target | <code>Window</code> |  | 
| [targetOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

<a name="module_{PaperGlider}..PaperGlider+isConnected"></a>

#### paperGlider.isConnected() ⇒ <code>boolean</code>
Returns true if a connection was established.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  
<a name="module_{PaperGlider}..PaperGlider+send"></a>

#### paperGlider.send(action, args)
Sends the action and the given arguments to the other window.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | identifier |
| args | <code>Array.&lt;any&gt;</code> | arguments that get passed to the receiving callback. Should not contain functions or DOM elements. |

<a name="module_{PaperGlider}..PaperGlider+receive"></a>

#### paperGlider.receive(action, callback) ⇒ <code>function</code>
Whenever the window receives the given action, the callback is executed with the sent arguments.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  
**Returns**: <code>function</code> - end will end receiving the action.  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | identifier |
| callback | <code>function</code> | will receive all sent arguments as arguments to the call. |

<a name="module_{PaperGlider}..PaperGlider+replyOn"></a>

#### paperGlider.replyOn(action, callback) ⇒ <code>function</code>
Whenever the window receives the action, send back the data returned by the callback with the same associated action
identifier.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  
**Returns**: <code>function</code> - end will end replying to the action.  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> |  |
| callback | <code>function</code> | will receive all sent arguments as arguments to the call. |

<a name="module_{PaperGlider}..PaperGlider+request"></a>

#### paperGlider.request(action, args, callback)
Sends the action to the other window and waits for the same action and executes the callback once with the returned data.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | identifier |
| args | <code>Array.&lt;any&gt;</code> | arguments that get passed to the receiving callback. Should not contain functions or DOM elements. |
| callback | <code>function</code> | gets passed the (single) answer to the request. |

<a name="module_{PaperGlider}..PaperGlider+dispose"></a>

#### paperGlider.dispose()
Removes all pending event listeners from the window object.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  
<a name="module_{PaperGlider}..PaperGlider+onConnect"></a>

#### paperGlider.onConnect(callback)
The given callback will be executed as soon as PaperGlider has connected.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param |
| --- |
| callback | 

<a name="module_{PaperGlider}..PaperGlider.connectChild"></a>

#### PaperGlider.connectChild(child, [childOrigin]) ⇒ <code>PaperGlider</code>
This is a simple helper to connect to a child window (iframe, window.open)

**Kind**: static method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Default |
| --- | --- | --- |
| child | <code>Window</code> |  | 
| [childOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

<a name="module_{PaperGlider}..PaperGlider.connectParent"></a>

#### PaperGlider.connectParent(parent, [parentOrigin]) ⇒ <code>PaperGlider</code>
This is a simple helper to connect to a parent window (window.parent, window.opener)

**Kind**: static method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Default |
| --- | --- | --- |
| parent | <code>Window</code> |  | 
| [parentOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

