// お知らせをタイムライン形式で表示するスクリプト

// お知らせの最大表示件数（イベント・キャンペーン＋営業情報の合計、新しい順）
// 表示する数を変えたいときはこの数字だけ変更してください。
const MAX_NEWS_ITEMS = 6;

document.addEventListener('DOMContentLoaded', async () => {
    await loadTimeline();
});

async function fetchJsonNoCache(filename) {
    const res = await fetch(`${filename}?t=${Date.now()}`, { cache: 'no-store' });
    return res.ok ? await res.json() : [];
}

async function loadTimeline() {
    const timelineEl = document.getElementById('news-timeline');
    if (!timelineEl) return;

    try {
        let newsData = [];
        let eventData = [];
        try {
            [newsData, eventData] = await Promise.all([
                fetchJsonNoCache('news.json'),
                fetchJsonNoCache('event_news.json')
            ]);
        } catch {
            newsData = [];
            eventData = [];
        }

        // タイプを付けてマージ
        const allItems = [
            ...eventData.map(item => ({ ...item, type: 'event' })),
            ...newsData.map(item => ({ ...item, type: 'update' }))
        ];

        // 日付降順にソート（YYYY.MM.DD形式）
        allItems.sort((a, b) => {
            const da = a.date.replace(/\./g, '');
            const db = b.date.replace(/\./g, '');
            return db.localeCompare(da);
        });

        timelineEl.innerHTML = '';

        if (allItems.length === 0) {
            timelineEl.innerHTML = `
                <div class="tl-item">
                    <div class="tl-dot"></div>
                    <div class="tl-body">
                        <div class="tl-text">現在お知らせはありません。</div>
                    </div>
                </div>`;
            return;
        }

        // 新しい順に最大 MAX_NEWS_ITEMS 件だけ表示する
        allItems.slice(0, MAX_NEWS_ITEMS).forEach(item => {
            const isEvent = item.type === 'event';
            const el = document.createElement('div');
            el.className = 'tl-item';
            el.innerHTML = `
                <div class="tl-dot${isEvent ? ' event' : ''}"></div>
                <div class="tl-body">
                    <div class="tl-cat${isEvent ? '' : ' update'}">${isEvent ? 'EVENT' : 'UPDATE'}</div>
                    <div class="tl-date">${item.date}</div>
                    <div class="tl-text">${item.content}</div>
                </div>`;
            timelineEl.appendChild(el);
        });

    } catch (e) {
        console.error('タイムライン読み込みエラー:', e);
        timelineEl.innerHTML = `
            <div class="tl-item">
                <div class="tl-dot"></div>
                <div class="tl-body">
                    <div class="tl-text">読み込みに失敗しました。</div>
                </div>
            </div>`;
    }
}

console.log('%c📢 お知らせ管理', 'font-size: 16px; font-weight: bold; color: #8E6E53;');
console.log('news.jsonを直接編集してお知らせを更新してください。');
