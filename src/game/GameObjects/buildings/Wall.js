var Wall = Building.extend({
    _upper: null,
    _type: "WAL_1",

    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        //schedule load sprite
        // this.schedule(this.loadSpriteByLevel, 5);
    },
    loadSpriteByLevel: function (level) {
        if(level == null)
            level = this._level;

        let wallState =0;
        if(this._posX && this._posY ){
            let RightBuilding = MapManager.Instance().getBuildingByGrid(this._posX+1,this._posY);
            let UpperBuilding = MapManager.Instance().getBuildingByGrid(this._posX,this._posY+1);
            if(RightBuilding && RightBuilding._type === "WAL_1")
            {
                if(UpperBuilding && UpperBuilding._type === "WAL_1")
                {
                    wallState = 3;
                }
                else
                {
                    wallState = 1;
                }
            }
            else if(UpperBuilding && UpperBuilding._type === "WAL_1")
                wallState = 2;
            else wallState = 0;
        }
        this.loadSprite(res_map.SPRITE.BODY.WALL[level][wallState],null,0);
    },
    reloadSprite:function ()
    {
        this.loadSprite(res_map.SPRITE.BODY.WALL[this._level][wallState],null,0);
    }

});