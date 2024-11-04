
var baby = JSON.parse($response.body);

baby = {
    
        "status": 200,
        "message": "OK",
        "data": {
          "id": 4497049,
          "nick": "金十网友",
          "country_code": "CN",
          "mobile_masked": "176***5",
          "avatar": "https://images.jin10.com/avatar/2d5a12cb-f7c7-47f7-9d4c-4dc6781c56b7.png/lite",
          "update_time": "2024-11-04 17:28:32",
          "create_time": "2024-11-04 17:27:26",
          "last_login_time": "2024-11-04 17:27:26",
          "reg_from": 2,
          "level": 0,
          "intro": "",
          "email": "",
          "third_party": {
            "wx": true,
            "wb": false,
            "qq": false
          },
            "location": "河南",
            "vip_info": {
              "vip_level": 3,
              "vip_benefits": [
              ]
            },
            "vip_str": "钻石会员",
            "vip_level": 3,
            "vip_expiration": "2025-12-31"
          }
};

$done({ body: JSON.stringify(baby) });


