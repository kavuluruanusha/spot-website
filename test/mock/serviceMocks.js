var modalInstanceMock = {
  result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback;
        this.cancelCallback = cancelCallback;
      }
  },
  close: function( item ) {
      this.result.closeItem = item;
  },
  dismiss: function( type ) {
      this.result.dismissItem = type;
    }
};

var modalMock = {
  open: function(config){
    return modalInstanceMock;
  }
};

var uiGoogleMapMock = {
  then: function(uiMapCallback){
    this.uiMapCallback = uiMapCallback;
    return this;
  }
}