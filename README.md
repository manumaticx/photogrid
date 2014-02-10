# Photogrid [![Appcelerator Titanium](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/)

Alloy Widget for showing photos with thumbnail grid

![demo](https://raw2.github.com/manumaticx/demos/master/photogrid/screenshots/android_02_framed.png)

## Features
* different columns in portrait and landscape
* handles orientaion change
* scrollable fullscreen detail view

## Usage

```javascript
var photogrid = Alloy.createWidget("de.manumaticx.photogrid");

var gridWindow = photogrid.createWindow({
    data: data
});

gridWindow.open();
```
__data__ (Array) is a list of __item__s (Object) with these properties:
- image _(required)_
- thumb _(optional)_
- title _(optional)_
 
See a demo [here](https://github.com/manumaticx/demos/tree/master/photogrid)

## License

<pre>
Copyright 2014 Manuel Lehner

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
