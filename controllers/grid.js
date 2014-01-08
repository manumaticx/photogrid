var args = arguments[0] || {},
    defaults = {
        columns: 3,
        space: 0,
        showTitle: false
    },
    options = _.defaults(args, defaults),
    screenWidth,
    thumbSize;

screenWidth = Ti.Platform.displayCaps.getPlatformWidth();
OS_ANDROID && (screenWidth /= Ti.Platform.displayCaps.logicalDensityFactor);

thumbSize = (screenWidth - ( (options.columns+1) * options.space )) / options.columns;

exports.setData = function(data){
    for (var i = 0; i < data.length; i++){
        var itemView = Ti.UI.createView({
            width: thumbSize,
            height: thumbSize,
            top: options.space,
            left: options.space,
            backgroundImage: data[i].thumb,
            _image: data[i].image
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
                text: data[i].title,
                width: Ti.UI.FILL,
                height: Ti.UI.FILL,
                color: '#fff',
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
            });
            
            titleView.add(titleLabel);
            itemView.add(titleView);
        }
        
        $.grid.add(itemView);
    }
};