sap.ui.define([
    "sap/ui/core/mvc/Controller"
],function(Controller){
    "use strict";
    return Controller.extend("td.mastertodo.controller.BaseController", {
        SWitchThemePress: function (data) {
            var DesignModel = data.getParameter("state") ? "sap_horizon_dark" : "sap_horizon";
            sap.ui.getCore().applyTheme(DesignModel);
            var oModel = this.getView().getModel("ThemeModel");
            oModel.setProperty("/isDarkMode", data.getParameter("state"));
        },
        OpenCreateTodoPress() {
            let oView = this.getView();
            this._Dialog ??= new sap.ui.xmlfragment("td.mastertodo.fragments.AddTodo", this);
            oView.addDependent(this._Dialog.setModel("CreateData"));
            this._Dialog.open();
          },
          SignOutpress(){
            var router = this.getOwnerComponent().getRouter();
            router.navTo("Login");
          },
      MasterTileData(data){
        var MasterTile =[];
        ["Health","Mental Health","Works","Others"].forEach(ele1=>{
               const TileEntry = { Total:0,Category: ele1, Complete: 0, Initial: 0, Process: 0};
                MasterTile.push(TileEntry);
        })
        data.forEach(ele=>{
            let TileEntry = MasterTile.find(main => main.Category === ele.Category);
           
            if(ele.Category === TileEntry.Category){
                TileEntry.Total += 1;   
            }
            if (ele.Status === "Success") {
                TileEntry.Complete += 1;
            } else if (ele.Status === "Information") {
                TileEntry.Initial += 1;
            } else if (ele.Status === "Warning") {
                TileEntry.Process += 1;
            }
            var AcutalData =["Complete","Initial","Process"].reduce((acc,final)=>{
                if(TileEntry[acc]>TileEntry[final]){
                    return acc;
                }else{
                    return final;
                }
            })
            TileEntry.Actual =TileEntry[AcutalData];
            TileEntry.ActualStatus = AcutalData;
        })
        return MasterTile;
      },
      onTodoItemPress(oEvent){
        var model = this.getOwnerComponent().getModel("ColumnLayout");
        model.setData({FLayout:"TwoColumnsBeginExpanded","data":oEvent.getSource().getBindingContext("TodoData").getObject()})
        model.refresh(true);
    },
    MasterProfilePress(oEvent){
        var router = this.getOwnerComponent().getRouter();
        router.navTo("MasterProfile");
    },
    TotalTaskPress(){
        var router = this.getOwnerComponent().getRouter();
        router.navTo("TotalTaskView");
    },
    ClassroomPress(){
        var router = this.getOwnerComponent().getRouter();
        router.navTo("Classroom");
    }
    })
})