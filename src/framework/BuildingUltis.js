
var BuildingUltis = {
    getBuildingByConfigId: function (configId) {
        // cc.log("GET BUILDING FROM ID :::::", configId)
        // let [buildingType, pos] = configId.split('_');
        // switch (buildingType) {
        //     case "BDH": {
        //         let builderHut = new BuilderHut(1);
        //         return builderHut;
        //     }
        //     case "AMC" : {
        //         let amc = new ArmyCamp(1);
        //         return amc;
        //     }
        //     case "RES": {
        //         let resource = pos == 1 ? new GoldMine("RES_1",1) : new ElixirMine("RES_2",1);
        //         return  resource;
        //     }
        //     case "STO": {
        //         let storage = pos == 1 ? new GoldStorage("STO_1",1) : new ElixirStorage("STO_2",1);
        //         return  storage;
        //     }
        //     case "BAR" : {
        //         return new Barrack(1);
        //     }
        //     case "DEF": {
        //         // mới chỉ có canon
        //         let def = pos === 1 ? new Cannon(1,1,1) : new  Cannon(1);
        //         return def
        //     }
        //     case "WAL" : {
        //         return new Wall(1);
        //     }
        //     default : {
        //         return new BuilderHut(1);
        //     }
        // }
        return getBuildingFromType(configId,1);

    }
}
