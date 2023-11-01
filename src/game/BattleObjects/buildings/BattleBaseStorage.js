var BattleBaseStorage = BattleBuilding.extend({
    _capacity: 0,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);
    },

    setCapacity: function (capacity) {
        this._capacity = capacity;
        this._resourceLeft = capacity;
    },

    reduceResource: function (resource){
        this._resourceLeft -= resource;
        BattleManager.getInstance().robResource(resource, this._resourceType)
    },

    onGainDamage: function (damage) {
        this._super(damage);
        const resource = Math.ceil(damage * this._capacity / this._maxHp);
        if (resource <= this._resourceLeft){
            this.reduceResource(resource);
        }
    },

    onDestroy: function (){
        if (this._resourceLeft > 0){
            this.reduceResource(this._resourceLeft);
        }
        this._super();
    }
});