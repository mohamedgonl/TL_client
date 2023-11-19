var BattleBaseMine = BattleBuilding.extend({
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
    },

    toString: function (type) {
        return "BattleBuilding{" +
            "id=" + this._id +
            ", posX=" + this._posX +
            ", posY=" + this._posY +
            ", hp=" + this._hp +
            ", type='" + this._type + '\'' +
            ", level=" + this._level +
            ", width=" + this._width +
            ", height=" + this._height +
            ", maxHp=" + this._maxHp +
            ", resourceLeft=" + this._resourceLeft +
            ", capacity=" + this._capacity +
            '}';
    },
});