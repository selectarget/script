/*************************************
 * 彩云天气 Pro - 去广告 / 去弹窗
 * 适配：ColorfulCloudsPro 7.61.x（cyapi）
 * 说明：仅净化广告与运营弹窗，不做会员解锁
 *************************************/

const url = $request.url || "";
const isReq = typeof $response === "undefined";

// ---------- 请求阶段：拦广告上报 ----------
if (isReq) {
  if (/ad\.cyapi\.cn|ad\.caiyunapp\.com|gather\.colorfulclouds\.net/i.test(url)) {
    $done({ response: { status: 200, headers: { "Content-Type": "application/json" }, body: '{"status":"ok"}' } });
  } else {
    $done({});
  }
}

// ---------- 响应阶段 ----------
let body = $response.body;
if (!body) $done({});

const headers = Object.fromEntries(
  Object.entries($request.headers || {}).map(([k, v]) => [k.toLowerCase(), v])
);

try {
  // 1) 运营活动 / 弹窗 / 引导卡
  // 例: https://wrapper.cyapi.cn/v1/activity?app_name=weather&os_type=ios_pro&type_id=...
  if (/\/v1\/activity\?/i.test(url) || /activity\?app_name=/i.test(url)) {
    // 新版常见结构
    body = JSON.stringify({ status: "ok", activities: [], interval: 999999 });
    $done({ body });
  }

  // 2) 页面条件弹窗（首页/个人页等）
  // 例: starplucker.cyapi.cn/v3/config/cypage/.../conditions/local
  if (/\/config\/cypage\/.+\/conditions/i.test(url)) {
    body = JSON.stringify({ popups: [], actions: [] });
    $done({ body });
  }

  // 3) 旧版广告位 / 试用卡 / 运营入口类
  if (
    /banners|friend_cards|trial_card\/info|operation\/banners|operation\/homefeatures|req\?app_name=weather/i.test(
      url
    )
  ) {
    body = "{}";
    $done({ body });
  }

  // 4) entries / features：去掉明显广告位，保留功能入口
  if (/\/operation\/(entries|features)/i.test(url) || /\/v\d\/entries/i.test(url)) {
    let obj = JSON.parse(body);
    const drop = (item) => {
      const t = JSON.stringify(item || {}).toLowerCase();
      return /ad|ads|advert|banner|promo|运营|广告|svip|会员|开通|trial|invite/.test(t);
    };
    if (Array.isArray(obj.data)) obj.data = obj.data.filter((x) => !drop(x));
    if (Array.isArray(obj.result)) obj.result = obj.result.filter((x) => !drop(x));
    if (Array.isArray(obj.entries)) obj.entries = obj.entries.filter((x) => !drop(x));
    body = JSON.stringify(obj);
    $done({ body });
  }

  // 5) 全局 config：去掉 AD* 卡片位（首页/地图广告槽）
  if (/starplucker\.cyapi\.cn\/v3\/config(?:\?|$)/i.test(url)) {
    let obj = JSON.parse(body);
    const stripAd = (arr) =>
      Array.isArray(arr) ? arr.filter((x) => !/^AD\d+/i.test(String(x && x.name))) : arr;
    if (obj.pic_page_card_orders) obj.pic_page_card_orders = stripAd(obj.pic_page_card_orders);
    if (obj.map_page_card_orders) obj.map_page_card_orders = stripAd(obj.map_page_card_orders);
    if (obj.home_page_card_orders) obj.home_page_card_orders = stripAd(obj.home_page_card_orders);
    body = JSON.stringify(obj);
    $done({ body });
  }

  // 6) 广告日志响应直接 ok
  if (/ad\.(cyapi|caiyunapp)\./i.test(url)) {
    body = '{"status":"ok"}';
    $done({ body });
  }
} catch (e) {
  // 解析失败则原样返回
}

$done({ body });
