sap.ui.define([
    "./BaseController",
"./Formatter"
  ], (BaseController,Formatter) => {
    "use strict";
  
    return BaseController.extend("td.mastertodo.controller.TotalTask", {
        formatter: Formatter,
        onInit() {},
      
       
    });
  });