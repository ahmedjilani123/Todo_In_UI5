sap.ui.define([
  "sap/ui/core/mvc/Controller",
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/date/UI5Date',
  'sap/ui/core/Fragment',
  'sap/m/MessageBox',
  "sap/ui/core/Messaging",
  "sap/ui/core/message/Message",
  "sap/ui/core/message/MessageType",
  'sap/ui/core/BusyIndicator'

], (Controller, JSONModel, UI5Date, Fragment, MessageBox, Messaging, Message, MessageType,BusyIndicator) => {
  "use strict";

  return Controller.extend("td.mastertodo.controller.MainDashboard", {
    onInit() {
      let oView = this.getView();
      oView.setModel(Messaging.getMessageModel(), "message");
      Messaging.registerObject(oView, true);
    },
    SearchTaskValuePress(oEvent){
      oEvent.getSource().getParent().getParent().getContent()[0].setBusy(true);
      var prompt = `Title : ${oEvent.getSource().getValue()} , Decription : i want description for this title`
      oEvent.getSource().setEditable(false);
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "qwen/qwen2.5-vl-32b-instruct:free",
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": `${prompt}`
                }
              ]
            }
          ]
        })
      }).then((res)=>res.json()).then(data=>{
        oEvent.getSource().getParent().getParent().getContent()[0].setBusy(false);
        oEvent.getSource().getParent().getParent().getContent()[0].getAggregation("items")[0].setProperty("text",data.choices[0].message.content)
        oEvent.getSource().setEditable(true);
        oEvent.getSource().setValue("");

      })
    },
    AIresponsePRess(oEvent){
    	var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "td.mastertodo.fragments.AI",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
    },
    AvatarPress() {

    },
    SelectionChangePress(oEvent) {
      var oModel = this.getView().getModel("CreateData");
      oModel.getData().Category = oEvent.getParameter("selectedItem").getProperty("text"),
        oModel.getData().CategoryStatus = oEvent.getParameter("selectedItem").getProperty("key")
    },
    InputErrorStatusChangePress(oEvent) {
      oEvent.getSource().setValueState("None");
    },
    MasterDataSavePress(oEvent) {
      Messaging.removeAllMessages();
      var oView = this.getView();
      var oModelCreate = oView.getModel("CreateData");
      ["Title", "Description", "StartDate", "EndDate"].forEach(key => {
        if (!oModelCreate.getData()[key]) {
          const oMessage = new Message({
            message: `Please fill in the required ${key}`,
            type: MessageType.Error,
            target: `/${key}`,
            processor: oModelCreate
          });
          Messaging.addMessages(oMessage);
        }
      });

      if (Messaging.getMessageModel().getData().length > 0) {
        sap.m.MessageToast.show("Please correct the errors before submitting.");
        return;
      } else {
        let finalData = oModelCreate.getData();
        finalData.ID = Math.floor(Math.random() * 100 + 999);
        finalData.StartDate =UI5Date.getInstance( finalData.StartDate.getFullYear(),finalData.StartDate.getMonth(),finalData.StartDate.getDate() , "0", "0");
        finalData.EndDate =UI5Date.getInstance( finalData.EndDate.getFullYear(),finalData.EndDate.getMonth(),finalData.EndDate.getDate() , "23", "59");
        var oModel = this.getView().getModel("ViewTask");
        oModel.getData().allTask[0].task.push(finalData);
        var oData = oModel.getData()
        oModel.setData(oData);
       
        oModel.refresh(true);
        oModel.propertyChange(function(){
          console.log("model")
        })
        oEvent.getSource().getParent().getParent().close();
        Messaging.removeAllMessages();
        oModelCreate.setData({ Category:"Health",
          Status:"Information", CategoryStatus:"Type02"});
          oModelCreate.refresh(true);
        this._Dialog = undefined;
      }
    },
    FilterDataChartPress() {
      let oView = this.getView();
      this._Dialog ??= new sap.ui.xmlfragment("td.mastertodo.fragments.ChartFilter", this);
      // oView.addDependent(this._Dialog.setModel("Main"));
      this._Dialog.open();
    },
    onAfterRendering() {
      var oModel = this.getOwnerComponent().getModel("ViewTask");
      var dateYear = new Date();
      oModel.setData({
        startDate: UI5Date.getInstance(dateYear.getFullYear().toString(), "1", "01", "0", "0"),
        allTask: [{
          task: []
        }]
      });
      this.getView().setModel(oModel, "ViewTask");
    },

    handleAppointmentSelect(oEvent) {
     // show detail about task code 
    },
    OpenCreateTodoPress() {
      let oView = this.getView();
      this._Dialog ??= new sap.ui.xmlfragment("td.mastertodo.fragments.AddTodo", this);
      oView.addDependent(this._Dialog.setModel("CreateData"));
      this._Dialog.open();
    },
    CloseMasterDataDialogPress(oEvent) {
      oEvent.getSource().getParent().getParent().close();
      Messaging.removeAllMessages();
      var oModel = this.getView().getModel("CreateData");
      oModel.setData({ CategoryStatus:"Type02", Category:"Health",
        Status:"Information",});
      oModel.refresh(true);
      this._Dialog = undefined;
    },
    groupTasksByWeek(tasks) {
      let weekData = {};
  
      tasks.forEach(task => {
          let weekNumber = getWeekNumber(task.StartDate);
          let year = new Date(task.StartDate).getFullYear();
          let weekKey = `Week ${weekNumber}, ${year}`;
  
          if (!weekData[weekKey]) {
              weekData[weekKey] = { Week: weekKey, Initial: 0, Process: 0, Complete: 0 };
          }
  
          if (task.Status === "Initial") {
              weekData[weekKey].Initial++;
          } else if (task.Status === "Process") {
              weekData[weekKey].Process++;
          } else if (task.Status === "Complete") {
              weekData[weekKey].Complete++;
          }
      });
  
      return Object.values(weekData); 
  },
  getWeekNumber(dateString) {
    let date = new Date(dateString);
    let firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    let pastDays = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
}

  
  });
});