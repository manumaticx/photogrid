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
    
    var index = _index || 0,
        thumbImage = item.thumb || item.image,
        thumbSize = _thumbSize || getThumbSize();
    
    if ('undefined' === typeof _index){
        data.push(item);
    }
    
    // TODO: itemView may be a separate controller
    
    var itemView = Ti.UI.createView({
        width: thumbSize,
        height: thumbSize,
        top: options.space,
        left: options.space,
        backgroundImage: thumbImage,
        _image: item.image,
        _index: index
    });
    
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
    
    itemView.addEventListener('click', onItemSelected);
    $.gridView.add(itemView);
};

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
    Ti.API.info('onItemSelected: ' + JSON.stringify(e.source));
    
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

// add orientation change listener and remove it when done
Ti.Gesture.addEventListener('orientationchange', onOrientationChange);
$.grid.addEventListener('close', function(){
    Ti.Gesture.removeEventListener('orientationchange', onOrientationChange);
});

// grid API
exports.setData = setData;
exports.addItem = addItem;
exports.clearGrid = clearGrid;
