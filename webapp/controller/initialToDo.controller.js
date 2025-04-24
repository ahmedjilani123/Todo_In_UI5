sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("td.mastertodo.controller.initialToDo", {
        onInit() {
            var router = this.getOwnerComponent().getRouter();
            router
              .getRoute("SubDetailsM")
              .attachPatternMatched(this.ObjectRouterViewData, this);
          },
          ObjectRouterViewData: function (oEvent) {

            this.Category = oEvent.getParameter("arguments").Category;
            var oModelTodo = this.getView().getModel("TodoData");
            var AllData = oModelTodo.getData().AllData.filter(ele=>ele.Category === this.Category);
            console.log(AllData);
            oModelTodo.setProperty("/Todo", []);
            oModelTodo.setProperty("/Process", []);
            oModelTodo.setProperty("/Complete", []);
            AllData.forEach(org=>{
                if(org.Status === "Information"){
                    oModelTodo.getData().Todo.push(org);
                }else if(org.Status === "Warning"){
                    oModelTodo.getData().Process.push(org);
                }else if(org.Status === "Success"){
                    oModelTodo.getData().Complete.push(org);
                }

            })
            oModelTodo.refresh(true);

          },
        onAfterRendering(){
            let oModel = this.getView().getModel("ThemeModel"),theme;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme="sap_horizon_dark";
                oModel.setProperty("/isDarkMode", true);
            } else {
                theme ="sap_horizon";
                oModel.setProperty("/isDarkMode", false); 
            }
            sap.ui.getCore().applyTheme(theme);
          
        },
       
        OpenCreateTodoPress(){
            let oView = this.getView();
            this._Dialog ??= new sap.ui.xmlfragment("td.mastertodo.fragments.AddTodo",this);
            // oView.addDependent(this._Dialog.setModel("Main"));
            this._Dialog.open();      
        },
        CloseDialogPress(oEvent){
            oEvent.getSource().getParent().getParent().close();
            this._Dialog = undefined;
                    },
        SearchAllTaskPress(oEvent) {
            var ofilter = new Filter("Title", FilterOperator.Contains, oEvent.getParameter("query"));
            ["TodoCreateID","TodoProcessID","TodoCompleteID"].forEach(ele=>{
                this.getView().byId(ele).getBinding("items").filter([ofilter]);
            });
        },
        InitialTodoTaskPress(oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext("TodoData");
            var oModel = this.getView().getModel("TodoData");
          
                let DataObject = oDraggedItemContext.getObject();
                    DataObject.Status = 'Information';
                    let index = oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].findIndex(ele=>ele.ID === DataObject.ID);
                    oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].splice(index,1);
                    oModel.getData().Todo.push(DataObject);
                    oModel.refresh(true);
         },
        ProcessTaskPress(oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext("TodoData");
            var oModel = this.getView().getModel("TodoData");
          
                let DataObject = oDraggedItemContext.getObject();
                    DataObject.Status = 'Warning';
                    let index = oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].findIndex(ele=>ele.ID === DataObject.ID);
                    oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].splice(index,1);
                    oModel.getData().Process.push(DataObject);
                    oModel.refresh(true);
        },
        onDropToInProgress3(oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext("TodoData");
            var oModel = this.getView().getModel("TodoData");
          
                let DataObject = oDraggedItemContext.getObject();
                    DataObject.Status = 'Success';
                    let index = oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].findIndex(ele=>ele.ID === DataObject.ID);
                    oModel.getData()[oDraggedItemContext.getPath().split("/")[1]].splice(index,1);
                    oModel.getData().Complete.push(DataObject);
                    oModel.refresh(true);
        }
    });
});