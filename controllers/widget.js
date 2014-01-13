var gridView;

exports.createWindow = function(args){
    gridWindow = Widget.createController('grid', args);
    gridWindow.on('click', onClick);
    return gridWindow.getView();
};

exports.setData = function(args){
    gridView.setData(args);
};

function onClick(e){
    $.trigger('click', e);
}
