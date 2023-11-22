var BattleStorage = BattleBuilding.extend({
    _capacity: 0,

    ctor: function (level, id, posX, posY) {
        this._super(level, id, posX, posY);

        // init animation
        if (this._resourceType === RESOURCE_TYPE.GOLD) {
            this.actionGoldDrop = fr.createActionByFrames(res_map.SPRITE.COIN_DROP, {
                delayPerUnit: 0.1,
                restoreOriginalFrame: true
            });

            this.actionFaded = cc.sequence(cc.FadeIn.create(0.2), cc.delayTime(0.5), cc.FadeOut.create(0.3));

            this.actionGoldDrop.retain();
            this.actionFaded.retain();

            this.coins = [];
            const MAX_COIN_SPRITE = 15;
            for (let i = 0; i < MAX_COIN_SPRITE; i++) {
                let coin = new cc.Sprite();
                coin.setVisible(false);
                coin.setScale(0.5);
                this.addChild(coin, BATTLE_ZORDER_BUILDING_ANIMATION);
                this.coins.push(coin);
            }

        }
        if (this._resourceType === RESOURCE_TYPE.ELIXIR) {
            this.actionElixirDrop = fr.createActionByFrames(res_map.SPRITE.ELIXIR_DROP, {
                delayPerUnit: 0.2,
                restoreOriginalFrame: true
            });

            this.actionFaded = cc.sequence(cc.FadeIn.create(0.2), cc.delayTime(0.5), cc.FadeOut.create(0.3));

            this.actionElixirDrop.retain();
            this.actionFaded.retain();

            this.elixirs = [];
            const MAX_ELIXIR_SPRITE = 15;
            for (let i = 0; i < MAX_ELIXIR_SPRITE; i++) {
                let elixir = new cc.Sprite();
                elixir.setVisible(false);
                elixir.setScale(0.5);
                this.addChild(elixir, BATTLE_ZORDER_BUILDING_ANIMATION);
                this.elixirs.push(elixir);
            }
        }
    },

    setCapacity: function (capacity) {
        this._capacity = capacity;
        this._resourceLeft = capacity;
    },

    reduceResource: function (resource) {
        this._resourceLeft -= resource;
        BattleManager.getInstance().robResource(resource, this._resourceType)
    },

    onGainDamage: function (damage) {
        this._super(damage);
        const resource = Math.ceil(damage * this._capacity / this._maxHp);
        if (resource <= this._resourceLeft) {
            this.reduceResource(resource);
        }

        //run animation
        if (this._resourceType === RESOURCE_TYPE.GOLD) {
            let coin = null;
            for (let i = 0; i < this.coins.length; i++)
                if (!this.coins[i].isVisible()) {
                    coin = this.coins[i];
                    break;
                }

            if (!coin)
                return;

            let dx = Math.random() * 140 - 70;
            let dy = Math.random() * 100 + 80;
            coin.setPosition(this._body.x, this._body.y + 50);
            coin.setVisible(true);

            let controlPoints = [cc.p(dx / 2, dy),
                cc.p(dx, dy - 20), cc.p(dx, dy - 40)];

            let bezierForward = cc.bezierBy(1, controlPoints);

            coin.runAction(cc.sequence(
                cc.spawn(this.actionGoldDrop.clone(), bezierForward, this.actionFaded.clone()),
                cc.callFunc((function () {
                    coin.setVisible(false);
                }).bind(this)))
            );
        }
        if (this._resourceType === RESOURCE_TYPE.ELIXIR) {
            let elixir = null;
            for (let i = 0; i < this.elixirs.length; i++)
                if (!this.elixirs[i].isVisible()) {
                    elixir = this.elixirs[i];
                    break;
                }

            if (!elixir)
                return;

            let dx = Math.random() * 140 - 70;
            let dy = Math.random() * 100 + 80;
            elixir.setPosition(this._body.x, this._body.y + 50);
            elixir.setVisible(true);

            let controlPoints = [cc.p(dx / 2, dy),
                cc.p(dx, dy - 20), cc.p(dx, dy - 40)];

            let bezierForward = cc.bezierBy(1, controlPoints);

            elixir.runAction(cc.sequence(
                cc.spawn(this.actionElixirDrop.clone(), bezierForward, this.actionFaded.clone()),
                cc.callFunc((function () {
                    elixir.setVisible(false);
                }).bind(this)))
            );
        }
    },

    onDestroy: function () {
        if (this._resourceLeft > 0) {
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