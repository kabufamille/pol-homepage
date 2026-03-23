// お知らせを動的に読み込んで表示するスクリプト
const NEWS_STORAGE_KEY = 'pol_news_data';
const EVENT_STORAGE_KEY = 'pol_event_data';

const defaultNewsData = [
  {
    "date": "2026.02.18",
    "content": "お取り置きline通知の人数を増やす"
  },
  {
    "date": "2026.02.17",
    "content": "お取り置き項目で商品の追加・削除を簡易的にする"
  },
  {
    "date": "2026.01.28",
    "content": "お取り置き選択中の欄追加"
  },
  {
    "date": "2026.01.20",
    "content": "ロゴにリンク挿入"
  },
  {
    "date": "2026.01.19",
    "content": "インスタグラムのリンクのみ追加"
  },
  {
    "date": "2026.01.16",
    "content": "お取り置きバグ修正"
  },
  {
    "date": "2026.01.16",
    "content": "お取り置き複数追加機能追加"
  },
  {
    "date": "2026.01.16",
    "content": "機能更新"
  },
  {
    "date": "2026.01.15",
    "content": "お知らせ機能追加"
  }
];

const defaultEventData = [
  {
    "date": "2026.01.19",
    "content": "1月27日　9：30～14：00　アソビナリビング販売！"
  }
];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 更新履歴(News)の読み込み
    await loadAndRenderNews(
        '.news-list',
        NEWS_STORAGE_KEY,
        'news.json',
        '更新履歴'
    );

    // 2. イベント情報の読み込み
    await loadAndRenderNews(
        '.event-news-list',
        EVENT_STORAGE_KEY,
        'event_news.json',
        'イベント情報'
    );
});

// 汎用的なニュース読み込み・表示関数
async function loadAndRenderNews(selector, storageKey, jsonFile, label) {
    const listElement = document.querySelector(selector);
    if (!listElement) return;

    try {
        let data = [];
        const storedData = localStorage.getItem(storageKey);

        if (storedData) {
            data = JSON.parse(storedData);
        } else {
            try {
                const response = await fetch(jsonFile);
                if (response.ok) {
                    data = await response.json();
                } else {
                    console.warn(`[${label}] API response not ok. Using default data.`);
                    data = label === 'イベント情報' ? [...defaultEventData] : [...defaultNewsData];
                }
            } catch (fetchError) {
                console.warn(`[${label}] Fetch failed, possibly running locally. Using default data.`, fetchError);
                data = label === 'イベント情報' ? [...defaultEventData] : [...defaultNewsData];
            }
        }

        listElement.innerHTML = '';
        if (data.length === 0) {
            listElement.innerHTML = `
                <dl class="news-item">
                    <dt>-</dt>
                    <dd>現在${label}はありません。</dd>
                </dl>`;
            return;
        }

        data.forEach(item => {
            const row = document.createElement('dl');
            row.className = label === 'イベント情報' ? 'news-item event-item' : 'news-item';

            const dt = document.createElement('dt');
            dt.textContent = item.date;

            const dd = document.createElement('dd');
            dd.textContent = item.content;

            row.appendChild(dt);
            row.appendChild(dd);

            listElement.appendChild(row);
        });
    } catch (e) {
        console.error(`${label}の読み込みエラー:`, e);
        listElement.innerHTML = `
            <dl class="news-item">
                <dt>-</dt>
                <dd>読み込みに失敗しました。</dd>
            </dl>`;
    }
}

// お知らせを追加するヘルパー関数(管理者用: news.json作成サポート)
window.addNews = async function (content) {
    try {
        let newsData;

        // まずローカルストレージをチェック
        const storedData = localStorage.getItem(NEWS_STORAGE_KEY);

        if (storedData) {
            newsData = JSON.parse(storedData);
        } else {
            // ローカルストレージにデータがない場合はJSONファイルから読み込み
            try {
                const response = await fetch('news.json');
                if (response.ok) {
                    newsData = await response.json();
                } else {
                    newsData = [...defaultNewsData];
                }
            } catch (fetchError) {
                newsData = [...defaultNewsData];
            }
        }

        // 今日の日付を取得(YYYY.MM.DD形式)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}.${month}.${day}`;

        // 新しいお知らせを配列の先頭に追加
        const newNewsItem = {
            date: dateStr,
            content: content
        };
        newsData.unshift(newNewsItem);

        // ローカルストレージに保存
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsData));
        console.log('お知らせをローカルストレージに保存しました');

        // JSONデータをコンソールに出力(バックアップ用)
        console.log('=== 更新されたお知らせデータ ===');
        console.log(JSON.stringify(newsData, null, 2));
        console.log('================================');

        alert(`お知らせを追加しました:\n${dateStr} - ${content}\n\n変更は自動的に保存されています。\nページをリロードすると反映されます。`);

        // ページをリロードして変更を反映
        if (confirm('ページをリロードして変更を反映しますか？')) {
            location.reload();
        }

        return newNewsItem;
    } catch (error) {
        console.error('お知らせの追加エラー:', error);
        alert('お知らせの追加に失敗しました: ' + error.message);
        return null;
    }
};

// 使用例をコンソールに表示
console.log('%c📢 お知らせ管理', 'font-size: 16px; font-weight: bold; color: #4CAF50;');
console.log('お知らせはローカルストレージに保存されます。');
console.log('admin.htmlから管理するか、コンソールで以下のコマンドを実行してください:');
console.log('%caddNews("お知らせの内容");', 'font-size: 14px; background: #f0f0f0; padding: 5px;');
console.log('例: addNews("新商品「抹茶ケーキ」を追加しました。");');
