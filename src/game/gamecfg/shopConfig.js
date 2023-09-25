
const RESOURCE_TYPE = {
    GOLD: 0,
    ELIXIR: 1,
    D_ELIXIR: 2,
    G: 3
}

const ShopItemsData = {
    'category_ngankho' : [
        {
            id: 'GOLD_10',
            name: "10% KHO",
            img: res_shop.GOLD_10,
            price_type: RESOURCE_TYPE.G,
            price: 128,
            time: 0,
            nganhko_percent: 0.1,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            id: 'GOLD_50',
            name: "50% KHO",
            img: res_shop.GOLD_50,
            price_type: RESOURCE_TYPE.G,
            price: 349,
            time: 0,
            nganhko_percent: 0.5,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            id: "GOLD_100",
            name: "ĐẦY KHO",
            img: res_shop.GOLD_100,
            price_type: RESOURCE_TYPE.G,
            price: 409,
            time: 0,
            nganhko_percent: 1,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            id: "ELI_10",
            name: "10% KHO",
            img: res_shop.ELIXIR_10,
            price_type: RESOURCE_TYPE.G,
            price: 128,
            time: 0,
            nganhko_percent: 0.1,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        {
            id: "ELI_50",
            name: "50% KHO",
            img: res_shop.ELIXIR_50,
            price_type: RESOURCE_TYPE.G,
            price: 349,
            time: 0,
            nganhko_percent: 0.5,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        {
            id: "ELI_100",
            name: "ĐẦY KHO",
            img: res_shop.ELIXIR_100,
            price_type: RESOURCE_TYPE.G,
            price: 409,
            time: 0,
            nganhko_percent: 1,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        {
            id: "DELI_10",
            name: "10% KHO",
            img: res_shop.D_ELIXIR_10,
            price_type: RESOURCE_TYPE.G,
            price: 128,
            time: 0,
            nganhko_percent: 0.1,
            value_type: RESOURCE_TYPE.D_ELIXIR
        },
        {
            id: "DELI_50",
            name: "50% KHO",
            img: res_shop.D_ELIXIR_50,
            price_type: RESOURCE_TYPE.G,
            price: 349,
            time: 0,
            nganhko_percent: 0.5,
            value_type: RESOURCE_TYPE.D_ELIXIR
        },
        {
            id: "DELI_100",
            name: "ĐẦY KHO",
            img: res_shop.D_ELIXIR_100,
            price_type: RESOURCE_TYPE.G,
            price: 409,
            time: 0,
            nganhko_percent: 1,
            value_type: RESOURCE_TYPE.D_ELIXIR
        },
    ],
    'category_trangtri' : [
        {
            id: "DEC_1",
            name: "Tượng cung thủ",
            img: res_shop.DEC_1,
            price_type: RESOURCE_TYPE.G,
            price: 50,
            time: 0
        },
        {
            id: "DEC_2",
            name: "Tượng chiến binh",
            img: res_shop.DEC_2,
            price_type: RESOURCE_TYPE.G,
            price: 50,
            time: 0
        },
        {
            id: "DEC_3",
            name: "Cờ hiệu 1",
            img: res_shop.DEC_3,
            price_type: RESOURCE_TYPE.G,
            price: 60,
            time: 0
        },
        {
            id: "DEC_4",
            name: "Cờ hiệu 2",
            img: res_shop.DEC_4,
            price_type: RESOURCE_TYPE.G,
            price: 50,
            time: 0
        },
        {
            id: "DEC_5",
            name: "Hoa đỏ",
            img: res_shop.DEC_5,
            price_type: RESOURCE_TYPE.G,
            price: 40,
            time: 0
        },
        {
            id: "DEC_6",
            name: "Hoa cúc",
            img: res_shop.DEC_6,
            price_type: RESOURCE_TYPE.G,
            price: 80,
            time: 0
        },
    ],
    'category_quandoi' : [
        {
            id:"AMC_1",
            name: "Trại lính",
            time: 300,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.AMC,
            price: 250,
            TH_require: 1
        },
        {
            id:'BAR_1',
            name: "Nhà lính",
            time: 60,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.BAR_1,
            price: 200,
            TH_require: 1
        },
        {
            id:"LAB_1",
            name: "Nhà nghiên cứu",
            time: 1800,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.LAB_1,
            price: 25000,
            TH_require: 3
        },
        {
            id:'SPF_1',
            name: "Nhà phép thuật",
            time: 1800,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.SPF_1,
            price: 25000,
        },

        {
            id: "KQB_1",
            name: "Hoàng đế",
            time: 0,
            price: 10000,
            img: res_shop.KQB_1,
            price_type: RESOURCE_TYPE.D_ELIXIR,
            TH_require: 7
        },
        {
            id: "KQB_2",
            name: "Nữ hoàng",
            time: 0,
            price: 40000,
            img: res_shop.KQB_2,
            price_type: RESOURCE_TYPE.D_ELIXIR,
            TH_require: 9
        },

    ],
    'category_phongthu' : [
        {
            id:"DEF_1",
            name: "Pháo",
            time: 60,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.DEF_1,
            price: 250,
            TH_require: 1
        },


    ],
    'category_baove' : [
        {
            id:"SHIELD_1",
            name: "Bảo vệ 1 ngày",
            wait_time: 432000,
            price_type: RESOURCE_TYPE.G,
            img: res_shop.SHIELD_1,
            price: 100,
        },
        {
            id:"SHIELD_2",
            name: "Bảo vệ 2 ngày",
            wait_time: 864000,
            price_type: RESOURCE_TYPE.G,
            img: res_shop.SHIELD_2,
            price: 150,
        },
        {
            id:"SHIELD_3",
            name: "Bảo vệ 7 ngày",
            wait_time: 3024000,
            price_type: RESOURCE_TYPE.G,
            img: res_shop.SHIELD_3,
            price: 250,
        },

    ],
    'category_tainguyen' : [
        {
            id:"BDH_1",
            name: "Nhà thợ xây",
            time: 0,
            price_type: RESOURCE_TYPE.G,
            img: res_shop.BDH_1,
            price: 1000,
        },
        {
            id:"RES_1",
            name: "Mỏ vàng",
            time: 60,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.RES_1,
            price: 150,
        },
        {
            id:"RES_2",
            name: "Mỏ dầu",
            time: 60,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.RES_2,
            price: 150,
        },
        {
            id:"STO_1",
            name: "Kho vàng",
            time: 900,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.STO_1,
            price: 300,
        },
        {
            id:"STO_2",
            name: "Kho dầu",
            time: 900,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.STO_2,
            price: 300,
        },
        {
            id:"RES_3",
            name: "Mỏ dầu đen",
            time: 900,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.RES_3,
            price: 1000000,
        },
        {
            id:"STO_3",
            name: "Kho dầu đen",
            time: 900,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.STO_3,
            price: 0,
        },
    ],
}
const ItemsMargin = 10;

const BUTTON_TOUCH_SCALE = 1.2