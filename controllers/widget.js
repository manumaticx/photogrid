var args = arguments[0] || {},

    // default grid configuration
    defaults = {
        // column count in portrait mode
        portraitColumns: 3,
        // column count in landscape mode
        landscapeColumns: 5,
        // space between thumbs
        space: 0,
        // wether title should show up on thumbs or not
        showTitle: false,
        //scroll interval to automatically scroll through the photos
        interval: 0
    },

    // grid data
    data = [],
    
    // passed args + defaults
    options = _.defaults(args, defaults);

// apply properties of Ti.UI.View that can be applied to paging control view
[
    "backgroundColor",
    "backgroundImage",
    "backgroundLeftCap",
    "backgroundRepeat",
    "backgroundTopCap",
    "borderRadius",
    "borderWidth",
    "bottom",
    "height",
    "horizontalWrap",
    "left",
    "opacity",
    "right",
    "top",
    "visible",
    "width",
    "zIndex"
].forEach(function(prop){ _.has(args, prop) && ($.gridView[prop] = args[prop]); });

if (_.has(args, 'data')){
    data = args.data;
    setData(data);
}

/**
 * set items to the grid
 * @param {Array} List of items (item is an {Object} containing image, thumb and title)
 */
function setData(_data){
    
    data = _data;
    clearGrid();
    
    var thumbSize = getThumbSize();
    
    for (var i = 0; i < data.length; i++){
        addItem(data[i], i, thumbSize);
        
    }
};

/**
 * adds a single item to the grid
 */
function addItem(item, _index, _thumbSize){
    var index = _index || data.length,
        thumbImage = item.thumb || item.image,
        thumbSize = _thumbSize || getThumbSize();
    
    if ('undefined' === typeof _index){
        data.push(item);
    }
    
    var itemViewOpts = {
        width: thumbSize,
        height: thumbSize,
        top: options.space,
        left: options.space,
        _image: item.image,
        _index: index
    };
    // iOS seems to not support remote background Images on Views, so change it to ImageView
    // Tested in iOS and Android, working
    var itemView = (
        typeof thumbImage !== "string" && 
        _.has(thumbImage, 'apiName') && 
        thumbImage.apiName === "Ti.UI.View"
    ) ? thumbImage : Ti.UI.createImageView({image: thumbImage});
    
    itemView.applyProperties(itemViewOpts);
    
    if (options.showTitle){
        
        var titleView = Ti.UI.createView({
            width: Ti.UI.FILL,
            height: thumbSize * 0.2,
            backgroundColor: '#000',
            opacity: 0.7,
            bottom: 0
        });
        
        var titleLabel = Ti.UI.createLabel({
            text: item.title,
            width: Ti.UI.FILL,
            height: (thumbSize * 0.2) - 6,
            left: 4,
            font: {
                fontSize: 14
            },
            ellipsize: true,
            color: '#fff',
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
        });
        
        titleView.add(titleLabel);
        itemView.add(titleView);
    }
    
    itemView.addEventListener('click', item.type === 'button' ? item.callback : onItemSelected);
    $.gridView.add(itemView);
    
    return index;
};

function removeItem(_index){
  
  var itemView = $.gridView.getChildren()[_index];
  
  if (!!itemView){
    itemView.removeEventListener('click', onItemSelected);
    $.gridView.remove(itemView);
    itemView = null;
    
    console.log('photogrid: item removed');
  }else{
    console.log('photogrid: item does not exist');
  }
}

/**
 * removes data from grid
 */
function clearGrid(){
    
    if ($.gridView.children.length > 0){
        
        _.each($.gridView.getChildren, function(itemView){
            itemView.removeEventListener('click', onItemSelected);
            $.gridView.remove(itemView);
            itemView = null;
        });
        
        $.gridView.removeAllChildren();
    }
};

/**
 * removes last item from grid
 */
function removeLastItem(){
    data.splice(data.length -1, 1);
    var itemView = _.last($.gridView.getChildren());
    itemView.removeEventListener('click', onItemSelected);
    $.gridView.remove(itemView);
    itemView = null;
};

/**
 * calculate thumb size
 * @return {Number} width / height in dp 
 */
function getThumbSize(){
    
    var orientation = Ti.Gesture.orientation,
        screenWidth = Ti.Platform.displayCaps.getPlatformWidth(),
        thumbSize,
        columns = 0;

    OS_ANDROID && (screenWidth /= Ti.Platform.displayCaps.logicalDensityFactor);
    
    if (orientation == Ti.UI.LANDSCAPE_LEFT || orientation == Ti.UI.LANDSCAPE_RIGHT){
        columns = options.landscapeColumns;
    }else{
        columns = options.portraitColumns;
    }
    
    thumbSize = (screenWidth - ( (columns+1) * options.space )) / columns;
    return Math.floor(thumbSize);
};

/**
 * thumbnail click-listener callback
 * @param {Object} e
 */
function onItemSelected(e){
    Ti.API.info('onItemSelected: ' + e.source);
    
    var detailWindow = Widget.createController('photoview', {
        data: data,
        index: e.source._index,
        interval: options.interval
    });
    
    detailWindow.getView().open();
};

/**
 * resize thumbnails on orientation change
 * @param {Object} e
 */
function onOrientationChange(e){
    
    var newSize = getThumbSize();
    
    _.each($.gridView.getChildren(), function(itemView){
        itemView.setWidth(newSize);
        itemView.setHeight(newSize);
    });
};

/**
 * remove EventListener
 */
function cleanUp(){
  Ti.Gesture.removeEventListener('orientationchange', onOrientationChange);
}

/**
 * initialzation
 */
function init(){
  Ti.Gesture.addEventListener('orientationchange', onOrientationChange);
}

// grid API
exports.setData = setData;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.removeLastItem = removeLastItem;
exports.getThumbSize = getThumbSize;
exports.clearGrid = clearGrid;
exports.cleanUp = cleanUp;
exports.init = init;
