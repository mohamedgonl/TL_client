var Archer = BaseTroop.extend({
    ctor: function (posX,posY) {
        this._type = "ARM_2";
        this._super(posX,posY);
    },
    attack: function(){
        TroopBullet.createBullet("ARM_2",this._target, {x: this._posX, y: this._posY}, this._damage);

    },


})