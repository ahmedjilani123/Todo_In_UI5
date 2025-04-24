sap.ui.define([
  "./BaseController",
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/date/UI5Date',
  'sap/ui/core/Fragment',
  'sap/m/MessageBox',
  "sap/ui/core/Messaging",
  "sap/ui/core/message/Message",
  "sap/ui/core/message/MessageType",
  'sap/ui/core/BusyIndicator',
  'sap/ui/core/IconPool',
	'sap/ui/core/library',
	'sap/m/Link',
	'sap/m/MessageItem',
	'sap/m/MessageView',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Bar',
	'sap/m/Title'

], (BaseController, JSONModel, UI5Date, Fragment, MessageBox, Messaging, Message, MessageType,BusyIndicator, IconPool, coreLibrary, Link, MessageItem, MessageView, Button, Dialog, Bar, Title) => {
  "use strict";
  var TitleLevel = coreLibrary.TitleLevel;
  return BaseController.extend("td.mastertodo.controller.MainDashboard", {
    onInit() {
      sap.ui.core.BusyIndicator.hide()
      let oView = this.getView();
      oView.setModel(Messaging.getMessageModel(), "message");
      Messaging.registerObject(oView, true);
      // window.onpopstate =this.datachange.bind(this)

      var that = this;

			var	oLink = new Link({
				text: "Created By Ahmed ",
				href: "https://ahmedshaikhcv.netlify.app/",
				target: "_blank"
			});

			var oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: '{markupDescription}',
				link: oLink
			});

			var aMockMessages = [{
				type: 'Error',
				title: 'Error message',
				description: 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Error',
				title: 'Error message',
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}];

			var oModel = new JSONModel();

			oModel.setData(aMockMessages);

			this.oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});

			var oBackButton = new Button({
					icon: IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});



			this.oMessageView.setModel(oModel);

			this.oDialog = new Dialog({
				resizable: true,
				content: this.oMessageView,
				state: 'Error',
				beginButton: new Button({
					press: function () {
						this.getParent().close();
					},
					text: "Close"
				}),
				customHeader: new Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new Title({
							text: "Message Center",
							level: TitleLevel.H1
						})
					]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false
			});
    },
   
    AdminTaskForUserPress(oEvent){
      this.oMessageView.navigateBack();
			this.oDialog.open();
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
        var TodoMoldel = this.getView().getModel("TodoData");
        TodoMoldel.getData().AllData.push(finalData);
        TodoMoldel.refresh(true);
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