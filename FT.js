/******************************
FT中文网 外区
[rewrite_local]
^https:\/\/dqbam2jv6gg9m\.cloudfront\.net\/index\.php\/jsapi\/paywall url script-response-body https://raw.githubusercontent.com/Yu9191/Rewrite/main/FTzhongwenwang.js
[mitm] 
hostname = dqbam2jv6gg9m.cloudfront.net

*******************************/
var baby = JSON.parse($response.body);

baby = {
  "paywall": 0,
  "premium": 1,
  "expire": "4092599349",
  "standard": 1,
  "v": 2099,
  "campaign_code": "",
  "latest_duration": "yearly",
  "addon": 0
};

$done({ body: JSON.stringify(baby) });