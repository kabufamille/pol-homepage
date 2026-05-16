// お知らせをタイムライン形式で表示するスクリプト

document.addEventListener('DOMContentLoaded', async () => {
    await loadTimeline();
});

async function loadTimeline() {
    const timelineEl = document.getElementById('news-timeline');
    if (!timelineEl) return;

    try {
        // news.json を取得
        let newsData = [];
        try {
            const res = await fetch('news.json');
            newsData = res.ok ? await res.json() : [];
        } catch {
            newsData = [];
        }

        // event_news.json を取得
        let eventData = [];
        try {
            const res = await fetch('event_news.json');
            eventData = res.ok ? await res.json() : [];
        } catch {
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

        allItems.forEach(item => {
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
