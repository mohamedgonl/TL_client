
var BuildingUltis = {
    getBuildingByConfigId: function (configId) {
        let [buildingType, level] = configId.split('_');

        switch (buildingType) {
            case "BDH": {
                return new BuilderHut();
            }

            default : {
                return new BuilderHut();
            }
        }

    }
}
