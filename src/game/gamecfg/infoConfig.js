const BuildingInfo = {
    "TOW_1":{
        name:"Nhà chính",
        max_level : 6,
        dataInfo:["capacityGold","capacityElixir","hitpoints"],
        description:"Nhà chính là trái tim của vương quốc, nâng cấp Nhà chính giúp mở khóa các công trình mới"
    },
    "BDH_1":{
        name:"Nhà Thợ xây",
        dataInfo: ["hitpoints"],
        description: "Có công trình nào quanh đây ko cần tới bóng dáng người thợ xây?\nCâu trả lời là không."
    },
    "AMC_1":{
        name: "Trại lính",
        dataInfo: ["army","hitpoints"],
        description: "Trại lính là nơi sinh hoạt cua binh lính. Xây dựng nâng câp nhiêu Trại lính giúp " +
            "tăng số lương binh lính của ban.\n"
    },
    "DEF_1":{
        name: "Pháo",
        dataInfo: ["damage","hitpoints"],
        description: "Pháo là công trình phòng thủ cơ bản của bạn. Giá trị rõ ràng của mỗi phát đạn "+
            "sau mỗi lần nâng cấp khiến Pháo trở thành công trình không thể thiếu của "+
            "vương quốc."
    },
    "DEF_2":{
        name: "Chòi cung",
        dataInfo: ["damage","hitpoints"],
        description: "Chòi cung là công trình phòng thủ cơ bản của bạn. Giá trị rõ ràng của mỗi phát đạn "+
            "sau mỗi lần nâng cấp khiến Chòi cung trở thành công trình không thể thiếu của "+
            "vương quốc."
    },
    "DEF_3":{
        name: "Máy bắn đá",
        dataInfo: ["damage","hitpoints"],
        description: "Máy bắn đá là công trình phòng thủ cơ bản của bạn. Giá trị rõ ràng của mỗi phát đạn "+
            "sau mỗi lần nâng cấp khiến Máy bắn đá trở thành công trình không thể thiếu của "+
            "vương quốc."
    },
    "RES_1":{
        name: "Mỏ vàng",
        // sức chua, sản lượng, máu
        dataInfo: ["capacityGold","productionGold","hitpoints"],
        description: "Vàng là tài nguyên không thể thiếu để xây các công trình phòng thủ. Mỏ vàng " +
            "sục sâu vào lòng đất mang lên những thỏi kim loại vàng óng ánh.\n" +
            "Hãy nhớ nâng cấp các Mỏ vàng này nhé nếu bạn vẫn mang ước mơ giàu có bên " +
            "mình."
    },
    "RES_2":{
        name: "Mỏ dầu",
        dataInfo: ["capacityElixir","productionElixir","hitpoints"],
        description: "Những dòng Dầu chảy tự nhiên bên dưới vương quốc, Mỏ dầu giúp mang chúng " +
            "lên tham gia vào quá trình xây dựng và nâng cấp quân đội\n" +
            "Chạy đua vũ trang bất nguồn từ đâu? Chính từ những dòng Dầu chảy sóng sánh " +
            "tuyệt đẹp này.\n"
    },
    "STO_1":{
        name: "Kho vàng",
        dataInfo: ["capacityGold","hitpoints"],
        description: "Kho vàng là nơi cất giữ gần như toàn bộ Vàng của vương quốc, hãy bảo vệ nơi " +
            "đây nghiêm ngặt nếu không trắng tay sau 1 đêm thức dậy\n" +
            "Nâng cấp Kho vàng sẽ tăng sức chưa và khả năng chống chịu trước những cuộc " +
            "xâm lược quy mô lớn.\n"
    },
    "STO_2":{
        name: "Kho dầu",
        dataInfo: ["capacityElixir","hitpoints"],
        description: "Cùng với Kho vàng, Kho dầu lưu trữ ky: nguyên quan trọng thứ 2 của vương " +
            "quốc\n" +
            "Hãy nâng cấp Kho dầu liên tục để trữ nhiều hơn những dòng Dầu sóng sánh do " +
            "đoàn quân chiến thắng mang về nhé.\n"
    },
    "WAL_1":{
        name: "Tường",
        dataInfo: ["hitpoints"],
        description: "Tường tăng cường sự an toàn cho vương quốc, giữ chân quân xâm lược để các "+
            "công trình phòng thủ tiêu diệt kẻ địch."
    },
    "BAR_1":{
        name: "Nhà lính",
        dataInfo: ["hitpoints"],
        description: "Nhà lính là nơi huấn luyện những binh lính tỉnh nhuệ cho vương quốc của bạn"+
            "giúp bạn mở mang bờ cõi, cướp được nhiều tài nguyên khoáng sản\n"+
            "Nâng cấp Nhà lính để mở khóa các loại lính cao cấp, đem về những chiến thắng" +
            " rực rỡ và huy hoàng cũng là cách chứng tỏ đẳng cấp đấy."
    },
    "OBS":{
        name: "Cây cối",
    }
}