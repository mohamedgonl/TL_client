
const RESOURCE_TYPE = {
    GOLD: 0,
    ELIXIR: 1,
    D_ELIXIR: 2,
    G: 3
}

const COLOR_SHOP_RED = cc.color(255,0,0)
const COLOR_SHOP_WHITE =  cc.color(255,255,255)

const ShopItemsData = {
    'category_ngankho' : [
        {
            cfgId: 'GOLD_10',
            name: "10% KHO",
            img: res_shop.GOLD_10,
            price_type: RESOURCE_TYPE.G,
            price: 128,
            time: 0,
            nganhko_percent: 0.1,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            cfgId: 'GOLD_50',
            name: "50% KHO",
            img: res_shop.GOLD_50,
            price_type: RESOURCE_TYPE.G,
            price: 349,
            time: 0,
            nganhko_percent: 0.5,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            cfgId: "GOLD_100",
            name: "ĐẦY KHO",
            img: res_shop.GOLD_100,
            price_type: RESOURCE_TYPE.G,
            price: 409,
            time: 0,
            nganhko_percent: 1,
            value_type: RESOURCE_TYPE.GOLD
        },
        {
            cfgId: "ELI_10",
            name: "10% KHO",
            img: res_shop.ELIXIR_10,
            price_type: RESOURCE_TYPE.G,
            price: 128,
            time: 0,
            nganhko_percent: 0.1,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        {
            cfgId: "ELI_50",
            name: "50% KHO",
            img: res_shop.ELIXIR_50,
            price_type: RESOURCE_TYPE.G,
            price: 349,
            time: 0,
            nganhko_percent: 0.5,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        {
            cfgId: "ELI_100",
            name: "ĐẦY KHO",
            img: res_shop.ELIXIR_100,
            price_type: RESOURCE_TYPE.G,
            price: 409,
            time: 0,
            nganhko_percent: 1,
            value_type: RESOURCE_TYPE.ELIXIR
        },
        // {
        //     cfgId: "DELI_10",
        //     name: "10% KHO",
        //     img: res_shop.D_ELIXIR_10,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 128,
        //     time: 0,
        //     nganhko_percent: 0.1,
        //     value_type: RESOURCE_TYPE.D_ELIXIR
        // },
        // {
        //     cfgId: "DELI_50",
        //     name: "50% KHO",
        //     img: res_shop.D_ELIXIR_50,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 349,
        //     time: 0,
        //     nganhko_percent: 0.5,
        //     value_type: RESOURCE_TYPE.D_ELIXIR
        // },
        // {
        //     cfgId: "DELI_100",
        //     name: "ĐẦY KHO",
        //     img: res_shop.D_ELIXIR_100,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 409,
        //     time: 0,
        //     nganhko_percent: 1,
        //     value_type: RESOURCE_TYPE.D_ELIXIR
        // },
    ],
    'category_trangtri' : [
        // {
        //     cfgId: "DEC_1",
        //     name: "Tượng cung thủ",
        //     img: res_shop.DEC_1,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 50,
        //     time: 0
        // },
        // {
        //     cfgId: "DEC_2",
        //     name: "Tượng chiến binh",
        //     img: res_shop.DEC_2,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 50,
        //     time: 0
        // },
        // {
        //     cfgId: "DEC_3",
        //     name: "Cờ hiệu 1",
        //     img: res_shop.DEC_3,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 60,
        //     time: 0
        // },
        // {
        //     cfgId: "DEC_4",
        //     name: "Cờ hiệu 2",
        //     img: res_shop.DEC_4,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 50,
        //     time: 0
        // },
        // {
        //     cfgId: "DEC_5",
        //     name: "Hoa đỏ",
        //     img: res_shop.DEC_5,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 40,
        //     time: 0
        // },
        // {
        //     cfgId: "DEC_6",
        //     name: "Hoa cúc",
        //     img: res_shop.DEC_6,
        //     price_type: RESOURCE_TYPE.G,
        //     price: 80,
        //     time: 0
        // },
    ],
    'category_quandoi' : [
        {
            cfgId:"AMC_1",
            name: "Trại lính",
            time: 300,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.AMC,
            price: 250,
            TH_require: 1,
            detail: {
                infoList : [
                    {
                        title: "Sức chứa: 0/80",
                        icon: res.ICON.TROOP_CAPACITY,
                        bar_percent: 0
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Trại lính là nơi sinh hoạt cua binh lính. Xây dựng nâng câp nhiêu Trại lính giúp " +
                    "tăng số lương binh lính của ban.\n"
            }
        },
        {
            cfgId:'BAR_1',
            name: "Nhà lính",
            time: 60,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.BAR_1,
            price: 200,
            TH_require: 1,
            detail: {
                infoList : [
                    {
                        title: "Máu: 250",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Nhà lính là nơi huấn luyện những binh lính tỉnh nhuệ cho vương quốc của bạn"+
                "giúp bạn mở mang bờ cõi, cướp được nhiều tài nguyên khoáng sản\n"+
                "Nâng cấp Nhà lính để mở khóa các loại lính cao cấp, đem về những chiến thắng" +
                    " rực rỡ và huy hoàng cũng là cách chứng tỏ đẳng cấp đấy."
            }
        }
        // {
        //     cfgId:"LAB_1",
        //     name: "Nhà nghiên cứu",
        //     time: 1800,
        //     price_type: RESOURCE_TYPE.ELIXIR,
        //     img: res_shop.LAB_1,
        //     price: 25000,
        //     TH_require: 3,
        //     detail: {
        //         infoList : [
        //             {
        //                 title: "Máu: 250",
        //                 icon: res.ICON.HEART
        //             }
        //         ],
        //         description: "Các nhà khoa học đang làm việc hết sức khẩn trương trong Nhà nghiên cứu. Họ " +
        //         "đang làm gì? Không ai rõ nhưng những nghiên cứu của họ khiến quân đội mạnh " +
        //         "hơn là điều ai cũng thấy."
        //
        //     }
        // },
        // {
        //     cfgId:'SPF_1',
        //     name: "Nhà phép thuật",
        //     time: 1800,
        //     price_type: RESOURCE_TYPE.ELIXIR,
        //     img: res_shop.SPF_1,
        //     price: 25000,
        //     detail: {
        //         infoList : [
        //             {
        //                 title: "Sức chứa: 0/2",
        //                 icon: res.ICON.SPELL_CAPACITY
        //             },
        //             {
        //                 title: "Máu: 200",
        //                 icon: res.ICON.HEART
        //             }
        //         ],
        //         description: "Đây là nơi những thầy phù thủy xuất chúng nhất của vương quốc chế tạo ra "+
        //         "những bình phép diệu kỳ. Nhờ chúng, những cuộc chỉnh phạt trở nên dễ dàng " +
        //         "hơn bao giờ hết."
        //
        //     }
        // },
    ],
    'category_phongthu' : [
        {
            cfgId:"DEF_1",
            name: "Pháo",
            time: 60,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.DEF_1,
            price: 250,
            TH_require: 1,
            detail: {
                infoList : [
                    {
                        title: "Sát thương: 7",
                        icon: res.ICON.DAMAGE,
                        bar_percent: 0.1
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Pháo là công trình phòng thủ cơ bản của bạn. Giá trị rõ ràng của mỗi phát đạn "+
                "sau mỗi lần nâng cấp khiến Pháo trở thành công trình không thể thiếu của "+
                "vương quốc."

            }
        },
        {
            cfgId:"WAL_1",
            name: "Tường",
            time: 0,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.WAL_1,
            price: 200,
            TH_require: 1,
            detail: {
                infoList : [
                    {
                        title: "Máu: 300",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Tường tăng cường sự an toàn cho vương quốc, giữ chân quân xâm lược để các "+
                "công trình phòng thủ tiêu diệt kẻ địch."
            }
        },
        {
            cfgId:"DEF_2",
            name: "Chòi cung",
            time: 900,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.DEF_2,
            price: 1000,
            TH_require: 2,
            detail: {
                infoList : [
                    {
                        title: "Sát thương: 11",
                        icon: res.ICON.DAMAGE,
                        bar_percent: 0.14
                    },
                    {
                        title: "Máu: 200",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Chòi cung là 1 trong những công trình phòng thủ có tầm bắn xa nhất của vương "+
                "quốc. Tấn công được cả các đơn vị bay chính là 1 ưu thế không thể bỏ qua so với "+
                "Pháo."

            }
        },
        {
            cfgId:"DEF_3",
            name: "Máy bắn đá",
            time: 28800,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.DEF_3,
            price: 8000,
            TH_require: 3,
            detail: {
                infoList : [
                    {
                        title: "Sát thương: 20",
                        icon: res.ICON.DAMAGE,
                        bar_percent: 0.2
                    },
                    {
                        title: "Máu: 200",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Với khả năng bắn lan, sức phá hủy lớn, tầm bắn xa thứ nhì chỉ sau Thần tiễn, "+
                "đây là công trình phòng thủ không thể thiếu nếu bạn muốn có 1 giấc ngủ ngon "+
                "lành."

            }
        },
        {
            cfgId:"DEF_5",
            name: "Pháo cao xạ",
            time: 18000,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.DEF_5,
            price: 22500,
            TH_require: 4,
            detail: {
                infoList : [
                    {
                        title: "Sát thương: 80",
                        icon: res.ICON.DAMAGE,
                        bar_percent: 0.3
                    },
                    {
                        title: "Máu: 200",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Cái tên nói lên tất cả. Pháo cao xạ là nỗi kinh hoàng của các đơn vị bay dám bén "+
                "mảng lại gần tầm bắn của mình" +
                "Còn bộ binh ư? Hãy để các công trình khác lo."

            }
        },

    ],
    'category_baove' : [
        // {
        //     cfgId:"SHIELD_1",
        //     name: "Bảo vệ 1 ngày",
        //     wait_time: 432000,
        //     price_type: RESOURCE_TYPE.G,
        //     img: res_shop.SHIELD_1,
        //     price: 100,
        // },
        // {
        //     cfgId:"SHIELD_2",
        //     name: "Bảo vệ 2 ngày",
        //     wait_time: 864000,
        //     price_type: RESOURCE_TYPE.G,
        //     img: res_shop.SHIELD_2,
        //     price: 150,
        // },
        // {
        //     cfgId:"SHIELD_3",
        //     name: "Bảo vệ 7 ngày",
        //     wait_time: 3024000,
        //     price_type: RESOURCE_TYPE.G,
        //     img: res_shop.SHIELD_3,
        //     price: 250,
        // },

    ],
    'category_tainguyen' : [
        {
            cfgId:"BDH_1",
            name: "Nhà thợ xây",
            time: 0,
            price_type: RESOURCE_TYPE.G,
            img: res_shop.BDH_1,
            price: 1000,
            detail: {
                infoList : [
                    {
                        title: "Máu: 250",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Có công trình nào quanh đây ko cần tới bóng dáng người thợ xây?\nCâu trả lời là không."
            }
        },
        {
            cfgId:"RES_1",
            name: "Mỏ vàng",
            time: 60,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.RES_1,
            price: 150,
            detail: {
                infoList : [
                    {
                        title: "Sức chứa: 0/500",
                        icon: res.ICON.GOLD_CAPACITY,
                        bar_percent : 0
                    },
                    {
                        title: "Sản lượng: 200/h",
                        icon: res.ICON.GOLD_PD_RATE
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Vàng là tài nguyên không thể thiếu để xây các công trình phòng thủ. Mỏ vàng " +
                    "sục sâu vào lòng đất mang lên những thỏi kim loại vàng óng ánh.\n" +
                    "Hãy nhớ nâng cấp các Mỏ vàng này nhé nếu bạn vẫn mang ước mơ giàu có bên " +
                    "mình."
            }
        },
        {
            cfgId:"RES_2",
            name: "Mỏ dầu",
            time: 60,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.RES_2,
            price: 150,
            detail: {
                infoList : [
                    {
                        title: "Sức chứa: 0/500",
                        icon: res.ICON.ELIXIR_CAPACITY,
                        bar_percent : 0
                    },
                    {
                        title: "Sản lượng: 200/h",
                        icon: res.ICON.ELIXIR_PD_RATE
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Những dòng Dầu chảy tự nhiên bên dưới vương quốc, Mỏ dầu giúp mang chúng " +
                    "lên tham gia vào quá trình xây dựng và nâng cấp quân đội\n" +
                    "Chạy đua vũ trang bất nguồn từ đâu? Chính từ những dòng Dầu chảy sóng sánh " +
                    "tuyệt đẹp này.\n"
            }
        },
        {
            cfgId:"STO_1",
            name: "Kho vàng",
            time: 900,
            price_type: RESOURCE_TYPE.ELIXIR,
            img: res_shop.STO_1,
            price: 300,
            detail: {
                infoList : [
                    {
                        title: "Sức chứa: 0/500",
                        icon: res.ICON.GOLD_CAPACITY,
                        bar_percent : 0
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    },


                ],
                description: "Kho vàng là nơi cất giữ gần như toàn bộ Vàng của vương quốc, hãy bảo vệ nơi " +
                    "đây nghiêm ngặt nếu không trắng tay sau 1 đêm thức dậy\n" +
                    "Nâng cấp Kho vàng sẽ tăng sức chưa và khả năng chống chịu trước những cuộc " +
                    "xâm lược quy mô lớn.\n"
            }
        },
        {
            cfgId:"STO_2",
            name: "Kho dầu",
            time: 900,
            price_type: RESOURCE_TYPE.GOLD,
            img: res_shop.STO_2,
            price: 300,
            detail: {
                infoList : [
                    {
                        title: "Sức chứa: 0/500",
                        icon: res.ICON.ELIXIR_CAPACITY,
                        bar_percent : 0
                    },
                    {
                        title: "Máu: 400",
                        icon: res.ICON.HEART
                    }
                ],
                description: "Cùng với Kho vàng, Kho dầu lưu trữ ky: nguyên quan trọng thứ 2 của vương " +
                    "quốc\n" +
                    "Hãy nâng cấp Kho dầu liên tục để trữ nhiều hơn những dòng Dầu sóng sánh do " +
                    "đoàn quân chiến thắng mang về nhé.\n"
            }
        },
        // {
        //     cfgId:"RES_3",
        //     name: "Mỏ dầu đen",
        //     time: 900,
        //     price_type: RESOURCE_TYPE.ELIXIR,
        //     img: res_shop.RES_3,
        //     price: 1000000,
        // },
        // {
        //     cfgId:"STO_3",
        //     name: "Kho dầu đen",
        //     time: 900,
        //     price_type: RESOURCE_TYPE.GOLD,
        //     img: res_shop.STO_3,
        //     price: 0,
        // },
    ],
}
const ITEM_MARGIN = 10;

const ITEM_INFO_PROCESS_BAR_SPACING = 10;

const BUTTON_TOUCH_SCALE_BIG = 1.1;
const BUTTON_TOUCH_SCALE_SMALL = 0.9;

const SHOP_ITEM_SCALE = 2;

const EVENT_NAMES = {
    RESOURCE_CHANGED: "res_changed",
    NEW_BUILDING_ADDED: "new_building"
}