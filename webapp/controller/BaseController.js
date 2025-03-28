sap.ui.define([
    "sap/ui/core/mvc/Controller"
],function(Controller){
    "use strict";
    return Controller.extend("td.mastertodo.controller.BaseController", {
      MasterTileData(data){
        var MasterTile =[];
        data.forEach(ele=>{
            let TileEntry = MasterTile.find(main => main.Category === ele.Category);
            if (!TileEntry) {
                TileEntry = { Total:0,Category: ele.Category, Complete: 0, Initial: 0, Process: 0};
                MasterTile.push(TileEntry);
            }
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
      }
    })
})