sap.ui.define([
    "./BaseController"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("td.mastertodo.controller.AI", {
        onInit() {
          sap.ui.core.BusyIndicator.hide()
        }
       
    });
  });