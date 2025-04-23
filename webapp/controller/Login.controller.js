sap.ui.define([
    "./BaseController"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("td.mastertodo.controller.Login", {
        onInit() {
          sap.ui.core.BusyIndicator.hide()

        },
        onAfterRendering(){
            // let oView = this.getView();
            // this._DialogL??= new sap.ui.xmlfragment("td.mastertodo.fragments.LoginD", this);
            // // oView.addDependent(this._DialogF.setModel("Main"));
            // this._DialogL.open();
        },
        onPress(oEvent){
          if(oEvent.getSource().getProperty("text") === "Register"){
            this.getView().byId("RegisterFormID").setVisible(true);
            this.getView().byId("segmentedButtonID").setEnabled(false);
            this.getView().byId("LoginTFormID").setVisible(false);
this.getView().byId("LoginFormIDM").setVisible(false);
this.getView().byId("login").setTitle("Register");
                      }else{
                        this.getView().byId("login").setTitle("Login");
                        this.getView().byId("segmentedButtonID").setEnabled(true);
                        this.getView().byId("LoginTFormID").setVisible(false);
            this.getView().byId("LoginFormIDM").setVisible(true);
            this.getView().byId("RegisterFormID").setVisible(false);
                      }
        },
        SelectedGuestPress(oEvent){
          if(oEvent.getParameter("item").getProperty("text") === "Teacher"){
this.getView().byId("LoginTFormID").setVisible(true);
this.getView().byId("LoginFormIDM").setVisible(false);
          }else{
            this.getView().byId("LoginFormIDM").setVisible(true);
            this.getView().byId("LoginTFormID").setVisible(false);
          }
        },
        SubmitDataPress(oEvent){
          var router = this.getOwnerComponent().getRouter();
          router.navTo("RouteMainDashboard");
        }
       
    });
  });