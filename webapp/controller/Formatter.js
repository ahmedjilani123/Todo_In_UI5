sap.ui.define([],function(){
    "use strict";
    return {
        status(sStatus) {
            if (sStatus === "Success") {
                return "Success";
            } else if (sStatus === "Warning") {
                return "Warning";
            } else if (sStatus === "Information"){
                return "Information";
            } else {
                return "None";
            }
    }
    }
})