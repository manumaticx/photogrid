var args = arguments[0] || {},
    data = [];


if (_.has(args, 'data')){
    _.each(args.data, function(photo){
        var photoView = Ti.UI.createImageView({
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE,
            image: photo.image
        });
        data.push(photoView);
    });
    
    $.photos.setViews(data);
    
    _.has(args, 'index') && $.photos.setCurrentPage(args.index);
}
