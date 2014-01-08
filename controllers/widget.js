var gridView;

exports.createView = function(args){
    gridView = Widget.createController('grid', args);
    gridView.on('click', onClick);
    return gridView.getView();
};

exports.setData = function(args){
    gridView.setData(args);
};

function onClick(e){
    $.trigger('click', e);
}
