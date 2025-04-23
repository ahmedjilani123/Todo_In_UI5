sap.ui.define([
  "./BaseController",
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/date/UI5Date',
  'sap/ui/core/Fragment',
  'sap/m/MessageBox',
  "sap/ui/core/Messaging",
  "sap/ui/core/message/Message",
  "sap/ui/core/message/MessageType",
  'sap/ui/core/BusyIndicator'

], (BaseController, JSONModel, UI5Date, Fragment, MessageBox, Messaging, Message, MessageType,BusyIndicator) => {
  "use strict";

  return BaseController.extend("td.mastertodo.controller.MainDashboard", {
    onInit() {
      let oView = this.getView();
      oView.setModel(Messaging.getMessageModel(), "message");
      Messaging.registerObject(oView, true);
      // window.onpopstate =this.datachange.bind(this)
    },
    AdminTaskForUserPress(oEvent){
      sap.m.MessageToast.show("Admin Task For User Press " + oEvent.getSource().getBadgeCustomData().getValue());
    },
//     datachange(){
// debugger
//     },
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
    AvatarPress(oEvent) {
      var oButton = oEvent.getSource(),
      oView = this.getView();

    // open profile popover
    if (!this._pPopoverS) {
      this._pPopoverS = Fragment.load({
        id: oView.getId(),
        name: "td.mastertodo.fragments.Profile",
        controller: this
      }).then(function(oPopoverS) {
        oView.addDependent(oPopoverS);
        return oPopoverS;
      });
    }
    this._pPopoverS.then(function(oPopover) {
      oPopover.openBy(oButton);
    });
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
      
        oEvent.getSource().getParent().getParent().close();
        Messaging.removeAllMessages();
        var weekDAta = this.groupTasksByWeek(oData.allTask[0].task);
        this.MasterTileData(oData.allTask[0].task);
        var oModelChart = this.getView().getModel("ViewData");
        oModelChart.setData(weekDAta);
        oModelChart.refresh(true);
        oModelCreate.setData({ Category:"Health",
          Status:"Information", CategoryStatus:"Type02"});
          oModelCreate.refresh(true);
        this._Dialog = undefined;
      }
    },
    FilterDataChartPress() {
      let oView = this.getView();
      this._DialogF ??= new sap.ui.xmlfragment("td.mastertodo.fragments.ChartFilter", this);
      // oView.addDependent(this._DialogF.setModel("Main"));
      this._DialogF.open();
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
    
    CloseMasterDataDialogPress(oEvent) {
      oEvent.getSource().getParent().getParent().close();
      Messaging.removeAllMessages();
      var oModel = this.getView().getModel("CreateData");
      oModel.setData({ CategoryStatus:"Type02", Category:"Health",
        Status:"Information",});
      oModel.refresh(true);
      this._Dialog = undefined;
    },
    getWeekOfMonth(date) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const dayOfMonth = date.getDate();
      return Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
  },
  groupTasksByWeek(tasks) {
      let that = this;
      let weekData = [];
      var MainDataArr = Array.isArray(tasks) ? tasks : [tasks];
      MainDataArr.forEach(task => {
          let weekNumber = that.getWeekOfMonth(new Date(task.StartDate));
          let weekEntry = weekData.find(week => Number(week.Week.substring(5)) === weekNumber);
          if (!weekEntry) {
              weekEntry = { Week: 'Week '+weekNumber, Complete: 0, Initial: 0, Process: 0,Month:task.StartDate};
              weekData.push(weekEntry);
          }
          if (task.Status === "Success") {
              weekEntry.Complete += 1;
          } else if (task.Status === "Information") {
              weekEntry.Initial += 1;
          } else if (task.Status === "Warning") {
              weekEntry.Process += 1;
          }
      });
      return weekData;
  },
  HeaderItemDataPress(oEvent){
    var router = this.getOwnerComponent().getRouter();
    router.navTo("SubDetailsM",{
      Category:oEvent.getSource().getAggregation("content")[0].getAggregation("items")[0].getAggregation("items")[1].getAggregation("items")[1].getProperty("text")
    })
  }
  

  
  });
});