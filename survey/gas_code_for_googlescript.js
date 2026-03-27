// Google Apps Script用 アンケートデータ受信・商品＆評価リスト送信・LINE Messaging API送信スクリプト
// ==========================================
// 【初期設定】 LINE Messaging API
// ==========================================
const LINE_CHANNEL_ACCESS_TOKEN = '4fscNIxb3/s6AKw4pyZGlUoTEbpb0eCiQJfWhWDNIkEAoZw27WEJalHsqUQWE+KPAjJ2eYuG2PNKZ6NSfdD3VCDuTB2NH2QeCB/q9FZ1en8YAMFWQlihlZN15wwtS+AN5VdgH0q/0on4QG8ZNPQv7gdB04t89/1O/w1cDnyilFU=';

// 送信先のLINEユーザーID（店主様、奥様）
const LINE_USER_IDS = [
  'U05dad93ac65e1cdf5d1fe876da6583ea', // ID 1
  'U730ca49cfddbe1db10660ebaf5e46a2a'  // ID 2
];

// ----------------------------------------------------
// アンケートのデータ受信 (POSTメソッド)
// ----------------------------------------------------
function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.type === "text/plain") {
        data = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.type === "application/json") {
        data = JSON.parse(e.postData.contents);
    } else {
        data = JSON.parse(e.postData.contents || "{}");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("回答一覧");
    if (!sheet) {
        sheet = ss.insertSheet("回答一覧");
    }
    
    // シートが空の場合、自動でヘッダー行を作成
    if (sheet.getLastRow() === 0) {
      var headers = [
        "タイムスタンプ", "商品名", "性別", "年代", "ご購入のきっかけ"
      ];
      
      // 動的評価項目のヘッダーを追加
      if (data.ratings) {
        Object.keys(data.ratings).forEach(function(k) {
          headers.push(k + "(5-1)");
        });
      }
      
      headers.push(
        "次回シーン", "推奨度(10-0)", "他商品への興味",
        "食べるタイミング", "一緒に飲んだもの",
        "メッセージ"
      );
      
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    // スプレッドシートに追記する行データ
    var rowData = [
      new Date(),
      data.productName || "",
      data.gender || "",
      data.ageGroup || "",
      data.purchaseTrigger || ""
    ];
    
    // 動的評価項目のデータを追加
    if (data.ratings) {
      Object.keys(data.ratings).forEach(function(k) {
        rowData.push(data.ratings[k]);
      });
    }

    rowData.push(
      data.nextOccasion || "",
      data.recommendScore || "",
      data.interestOther || "",
      data.eatTiming || "",
      data.drinkPaired || "",
      data.message || ""
    );

    sheet.appendRow(rowData);
    sendToLinePush(data);

    var responseObj = { "status": "success", "message": "Data saved" };
    return ContentService.createTextOutput(JSON.stringify(responseObj))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errorObj = { "status": "error", "message": error.toString() };
    return ContentService.createTextOutput(JSON.stringify(errorObj))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------
// LINE Messaging APIでのPush通知処理 (2人へ同時配信)
// ----------------------------------------------------
function sendToLinePush(data) {
  var msg = "🍰 新規アンケート回答\n\n";
  msg += "【お客様情報】\n";
  msg += "商品: " + (data.productName || "未選択") + "\n";
  msg += "回答者: " + (data.gender || "-") + " / " + (data.ageGroup || "-") + "\n";
  msg += "きっかけ: " + (data.purchaseTrigger || "なし") + "\n\n";
  
  msg += "【満足度評価】(5〜1段階)\n";
  if (data.ratings && Object.keys(data.ratings).length > 0) {
    Object.keys(data.ratings).forEach(function(k) {
      msg += "・" + k + ": " + data.ratings[k] + "\n";
    });
  } else {
    msg += "評価データなし\n";
  }
  msg += "\n";
  
  msg += "【リピート・今後のご意向】\n";
  msg += "次回食べたいシーン: " + (data.nextOccasion || "未回答") + "\n";
  msg += "推奨度 (10〜0): " + (data.recommendScore || "未回答") + "\n";
  msg += "他に興味のある商品: " + (data.interestOther || "なし") + "\n\n";
  
  msg += "【利用シーン】\n";
  msg += "タイミング: " + (data.eatTiming || "なし") + "\n";
  msg += "一緒に飲んだもの: " + (data.drinkPaired || "なし") + "\n\n";
  
  msg += "【📝 メッセージ】\n";
  msg += (data.message || "なし");

  // Multicast (複数人送信API) のエンドポイント
  var url = "https://api.line.me/v2/bot/message/multicast";
  
  var payload = {
    "to": LINE_USER_IDS,
    "messages": [
      {
        "type": "text",
        "text": msg
      }
    ]
  };

  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
    },
    "payload": JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch(e) {
    console.error("LINE Push fetch error: " + e.toString());
  }
}

// ----------------------------------------------------
// CORS対応
// ----------------------------------------------------
function doOptions(e) {
  var response = ContentService.createTextOutput("");
  response.getHeaders = function() {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
  };
  return response;
}

// ----------------------------------------------------
// 「設定」シートから商品と評価項目を動的取得 (GETメソッド)
// ----------------------------------------------------
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("設定");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "「設定」シートを作成してください" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // データのある範囲をすべて取得
    var data = sheet.getDataRange().getValues();
    var products = [];
    var ratings = [];
    
    for (var i = 0; i < data.length; i++) {
        var p = data[i][0]; // A列：商品名
        var r = data[i][1]; // B列：評価項目
        
        if (p && p !== "商品名リスト" && p !== "商品名" && p !== "商品") {
            products.push(p.toString());
        }
        if (r && r !== "評価項目リスト" && r !== "評価項目" && r !== "項目") {
            ratings.push(r.toString());
        }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ products: products, ratings: ratings }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
