sap.ui.define([
    "sap/ui/core/UIComponent",
    "td/mastertodo/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("td.mastertodo.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            let oModel = this.getModel("CreateData"); // Create A Task Model First Used --
            oModel.setData({
                ID:NaN,
                Title:"",
                Description:"",
                Category:"Health",
                Status:"Information",
                StartDate:"",
                EndDate:"",
                CategoryStatus:"Type02"
            })
            oModel.refresh(true);
            var omdeol =this.getModel("ColumnLayout");
            omdeol.setData({FLayout:"OneColumn"})
            omdeol.refresh(true);
            var modelAI = this.getModel("AIModel");
            var modelAI = this.getModel("AIModel");
            modelAI.setData({"Data":[]});
            modelAI.refresh(true);
            // enable routing
            this.getRouter().initialize();
        }
    });
});