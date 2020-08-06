## Modules

<dl>
<dt><a href="#module_paperglider">paperglider</a></dt>
<dd><p>A module for communication between window objects.</p>
</dd>
<dt><a href="#module_{PaperGlider}">{PaperGlider}</a></dt>
<dd></dd>
</dl>

<a name="module_paperglider"></a>

## paperglider
A module for communication between window objects.

<a name="module_{PaperGlider}"></a>

## {PaperGlider}

* [{PaperGlider}](#module_{PaperGlider})
    * [~PaperGlider](#module_{PaperGlider}..PaperGlider)
        * [new PaperGlider(self)](#new_module_{PaperGlider}..PaperGlider_new)
        * _instance_
            * [.init(target, [targetOrigin])](#module_{PaperGlider}..PaperGlider+init)
            * [.isConnected()](#module_{PaperGlider}..PaperGlider+isConnected) ⇒ <code>boolean</code>
            * [.send(action, args)](#module_{PaperGlider}..PaperGlider+send)
            * [.receive(action, callback)](#module_{PaperGlider}..PaperGlider+receive) ⇒ <code>function</code>
            * [.replyOn(action, callback)](#module_{PaperGlider}..PaperGlider+replyOn) ⇒ <code>function</code>
            * [.request(action, args, callback)](#module_{PaperGlider}..PaperGlider+request)
            * [.dispose()](#module_{PaperGlider}..PaperGlider+dispose)
            * [.onConnect(callback)](#module_{PaperGlider}..PaperGlider+onConnect)
        * _static_
            * [.connect([self])](#module_{PaperGlider}..PaperGlider.connect) ⇒ <code>PaperGliderConnector</code>
    * [~PaperGliderConnector](#module_{PaperGlider}..PaperGliderConnector)
        * [new PaperGliderConnector(self)](#new_module_{PaperGlider}..PaperGliderConnector_new)
        * [.toWindow(other, [otherOrigin])](#module_{PaperGlider}..PaperGliderConnector+toWindow) ⇒ <code>PaperGlider</code>
        * [.toParent([parentOrigin])](#module_{PaperGlider}..PaperGliderConnector+toParent) ⇒ <code>PaperGlider</code>
        * [.toIframe(iframe, [iframeOrigin])](#module_{PaperGlider}..PaperGliderConnector+toIframe) ⇒ <code>PaperGlider</code>

<a name="module_{PaperGlider}..PaperGlider"></a>

### {PaperGlider}~PaperGlider
**Kind**: inner class of [<code>{PaperGlider}</code>](#module_{PaperGlider})  

* [~PaperGlider](#module_{PaperGlider}..PaperGlider)
    * [new PaperGlider(self)](#new_module_{PaperGlider}..PaperGlider_new)
    * _instance_
        * [.init(target, [targetOrigin])](#module_{PaperGlider}..PaperGlider+init)
        * [.isConnected()](#module_{PaperGlider}..PaperGlider+isConnected) ⇒ <code>boolean</code>
        * [.send(action, args)](#module_{PaperGlider}..PaperGlider+send)
        * [.receive(action, callback)](#module_{PaperGlider}..PaperGlider+receive) ⇒ <code>function</code>
        * [.replyOn(action, callback)](#module_{PaperGlider}..PaperGlider+replyOn) ⇒ <code>function</code>
        * [.request(action, args, callback)](#module_{PaperGlider}..PaperGlider+request)
        * [.dispose()](#module_{PaperGlider}..PaperGlider+dispose)
        * [.onConnect(callback)](#module_{PaperGlider}..PaperGlider+onConnect)
    * _static_
        * [.connect([self])](#module_{PaperGlider}..PaperGlider.connect) ⇒ <code>PaperGliderConnector</code>

<a name="new_module_{PaperGlider}..PaperGlider_new"></a>

#### new PaperGlider(self)
Creates an object to communicate with another windows.


| Param | Type |
| --- | --- |
| self | <code>Window</code> | 

<a name="module_{PaperGlider}..PaperGlider+init"></a>

#### paperGlider.init(target, [targetOrigin])
Sets up the communication to another window. The target origin can be omitted in which case it is set to `'*'`,  which normally should be avoided.

**Kind**: instance method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Default |
| --- | --- | --- |
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
Whenever the window receives the action, send back the data returned by the callback with the same associated actionidentifier.

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

<a name="module_{PaperGlider}..PaperGlider.connect"></a>

#### PaperGlider.connect([self]) ⇒ <code>PaperGliderConnector</code>
Helper to connect PaperGlider to another window

**Kind**: static method of [<code>PaperGlider</code>](#module_{PaperGlider}..PaperGlider)  

| Param | Type | Default |
| --- | --- | --- |
| [self] | <code>Window</code> | <code>window</code> | 

<a name="module_{PaperGlider}..PaperGliderConnector"></a>

### {PaperGlider}~PaperGliderConnector
**Kind**: inner class of [<code>{PaperGlider}</code>](#module_{PaperGlider})  

* [~PaperGliderConnector](#module_{PaperGlider}..PaperGliderConnector)
    * [new PaperGliderConnector(self)](#new_module_{PaperGlider}..PaperGliderConnector_new)
    * [.toWindow(other, [otherOrigin])](#module_{PaperGlider}..PaperGliderConnector+toWindow) ⇒ <code>PaperGlider</code>
    * [.toParent([parentOrigin])](#module_{PaperGlider}..PaperGliderConnector+toParent) ⇒ <code>PaperGlider</code>
    * [.toIframe(iframe, [iframeOrigin])](#module_{PaperGlider}..PaperGliderConnector+toIframe) ⇒ <code>PaperGlider</code>

<a name="new_module_{PaperGlider}..PaperGliderConnector_new"></a>

#### new PaperGliderConnector(self)
Helper class to connect PaperGlider to another window


| Param |
| --- |
| self | 

<a name="module_{PaperGlider}..PaperGliderConnector+toWindow"></a>

#### paperGliderConnector.toWindow(other, [otherOrigin]) ⇒ <code>PaperGlider</code>
This is a helper to connect to a window (iframe, window.open)

**Kind**: instance method of [<code>PaperGliderConnector</code>](#module_{PaperGlider}..PaperGliderConnector)  

| Param | Type | Default |
| --- | --- | --- |
| other | <code>Window</code> |  | 
| [otherOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

<a name="module_{PaperGlider}..PaperGliderConnector+toParent"></a>

#### paperGliderConnector.toParent([parentOrigin]) ⇒ <code>PaperGlider</code>
This is a helper to connect to a parent window (window.top or window.opener)

**Kind**: instance method of [<code>PaperGliderConnector</code>](#module_{PaperGlider}..PaperGliderConnector)  

| Param | Type | Default |
| --- | --- | --- |
| [parentOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

<a name="module_{PaperGlider}..PaperGliderConnector+toIframe"></a>

#### paperGliderConnector.toIframe(iframe, [iframeOrigin]) ⇒ <code>PaperGlider</code>
This is a helper to connect to a iframe. It waits for the contentWindow if neccessary.

**Kind**: instance method of [<code>PaperGliderConnector</code>](#module_{PaperGlider}..PaperGliderConnector)  

| Param | Type | Default |
| --- | --- | --- |
| iframe | <code>HTMLIFrameElement</code> |  | 
| [iframeOrigin] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | 

