sap.ui.define([
    "./BaseController"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("td.mastertodo.controller.Profile", {
        onInit() {
         
        },
        Status(sts){
        return sts;
        },
        CloseInformationPress(oEvent){
            var model = this.getOwnerComponent().getModel("ColumnLayout");
        model.setData({FLayout:"OneColumn"})
        model.refresh(true);  
        }
       
    });
  });