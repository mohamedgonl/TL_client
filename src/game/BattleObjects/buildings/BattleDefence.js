var BattleDefence = BattleBuilding.extend({
    targetQueue: [],
    attackCd: 0,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
        // var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        // this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },

    gameLoop: function (dt){
        if (this.attackCd > 0){
            this.attackCd -= dt;
            return;
        }
        if (this.targetQueue.length === 0)
            return;
        const target = this.targetQueue[0];
        this.attackCd = this.attackSpeed;
        this.attack(target);
    },

    addTarget: function (target){
        this.targetQueue.push(target);
    },

    removeAllTargets: function (){
      this.targetQueue = [];
    },

    attack: function (target){
    }
});
