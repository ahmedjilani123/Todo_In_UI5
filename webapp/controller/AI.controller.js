sap.ui.define([
    "./BaseController"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("td.mastertodo.controller.AI", {
        onInit() {
          sap.ui.core.BusyIndicator.hide()
        },
        AIREsponsePress(oEvent){
            var model = this.getOwnerComponent().getModel("AIModel");
            var allData = model.getData().Data;

            oEvent.getSource().setBusy(true);
            var prompt = oEvent.getSource().getValue();
            oEvent.getSource().setEditable(false);
            fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDXzlFD2RniB0umi647X986V6FS-CMjmy0", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                "contents": [{
                  "parts":[{"text": `${prompt}`}]
                  }]
                 })
            }).then((res)=>res.json()).then(data=>{
                allData.push({"Request":`${prompt}`,"Response":data.candidates[0].content.parts[0].text,"Status":"Information","Category":"AI"});
              oEvent.getSource().setBusy(false);
              oEvent.getSource().setEditable(true);
              oEvent.getSource().setValue("");
              model.refresh(true);
      
            })
        }
       
    });
  });