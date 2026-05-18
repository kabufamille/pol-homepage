# pol ホームページ 運用マニュアル

最終更新：2026年5月18日

---

## プロジェクトの基本ツール構成（★新体制）

現在の制作・運用は、以下の3つのツールを連携させて行っています。

1. **Obsidian（情報管理）**：このマニュアル（`POL運用マニュアル.md`）と、日々の作業ログ（`POL現在の進捗.md`）を蓄積・管理する。
2. **Claude Pro（頭脳・ナビゲート）**：「Projects」機能を使用。Obsidianのノートを読み込ませることで、状況を正確に把握したAIアシスタントとして活用する。
3. **Cursor（エディタ・公開）**：コードの実際の編集と、GitHubへのアップロード（push）を行う。

---

## ★重要：毎日の作業開始・引き継ぎ手順（Obsidian × Claude連携）

毎回新しいチャットでも昨日の続きからスムーズに始められるよう、以下のルーティンで作業を行います。（※旧Coworkセッションは廃止）

### 【初回準備】Claudeの「脳」をセットアップ
Claude Proの「POLホームページ制作」プロジェクトの **Project Knowledge（知識ベース）** に、Obsidianの `POL運用マニュアル.md` をアップロードしておく。
※マニュアルのルールを更新した際は、Obsidianの最新版を再度アップロードして差し替えること。

### 【退勤時】1日の終わりにやること
1. 作業終了時、Claudeに「今日完了したことと、明日やるべきタスクをまとめてください」と依頼する。
2. 出力された内容をコピーし、Obsidianの **`POL現在の進捗.md`** に上書き保存する。

### 【始業時】朝一番にやること
1. Claudeの同プロジェクトを開き、Project Knowledgeに、先ほどObsidianで保存した最新の **`POL現在の進捗.md`** をドラッグ＆ドロップで追加（上書き）する。
2. 新しいチャットを立ち上げ、以下のように指示する。
   `「おはよう。更新した『POL現在の進捗.md』を読んで状況を把握し、マニュアルに沿って今日一番最初にやるべき具体的な作業を提案して」`
3. Claudeの提案に従い、Cursorを開いて本日の作業を開始する。

---

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | メインページ |
| `online_shop.html` | オンラインショップ |
| `reservation.html` | お取り置きページ |
| `style.css` | 全体スタイル |
| `timeline.css` | お知らせタイムライン用スタイル |
| `main.js` | スクロールアニメーション・モバイルメニュー等 |
| `news.js` | お知らせタイムライン表示（news.jsonを読み込む） |
| `news.json` | お知らせ・イベント情報（typeフィールドで区別） |
| `products.json` | 商品一覧データ |
| `images/` | 画像フォルダ（WebP形式） |
| `images/store/` | 商品写真（WebP形式） |
| `robots.txt` | 検索エンジン向けクロール設定 |
| `sitemap.xml` | サイトマップ |

---

## 画像の取り扱いについて（WebP変換）

画像の追加や変更を行う場合、**必ずWebP形式（.webp）に変換してから** Cursor経由で `images/` フォルダへ配置・pushしてください。
HTMLの参照先も合わせて `.webp` に更新する必要があります。

---

## 参照URL

- ホームページ：https://kabufamille.github.io/pol-homepage/
- GitHubリポジトリ：https://github.com/kabufamille/pol-homepage
- Google Drive cake_site：https://drive.google.com/drive/folders/18_nJwtI-VvZwOOELs6NeeGYDfqYUTJw3

---

## 変更履歴

### 2026-05-18
- **ワークフローの刷新**：旧Coworkセッションを廃止。Obsidian（マニュアル・進捗管理）とClaude Pro（Projects機能）を連携させる新体制に記述を変更。
- 不要になった旧体制の記述（自動pushスクリプト、base64回避ルール等）を整理・削除。

### 2026-05-17
- `index.html`：トップページの営業カレンダー幅を380px→580pxに拡大（日付フォントも拡大）
- `admin.html`：営業カレンダー管理UIを追加
  - 日付クリックで臨時休業・臨時営業を設定・解除
  - 定休日曜日をチェックボックスで管理
  - 「calendar.json を書き出す」ボタンで保存→GitHubにpushすると反映
- `index.html`：「職人のこだわり」(About)セクションの文章を全面書き直し
  - フルーツ酵母（自家製）をパンの核心として前面に打ち出す内容に変更
  - ケーキ・焼き菓子は繰り返し研究・試作を重ねているという姿勢を強調
  - 北海道産小麦・無添加・当日焼きについても明記

### 2026-05-16
**ホームページ全体をDriveの`cake_site`配下から`pol-homepege`直下へ移動**
- 旧構成：素材ファイルは`cake_site`フォルダ内、`pol-homepege`にはpushスクリプトのみ
- 新構成：全ファイルを`pol-homepege`直下に統合（`cake_site`は空に）
- 移動時に発生した問題と修正：
  1. ファイル名末尾の半角スペース（`news .js` / `online_shop .html` / `reservation .html` / `news .json`）→ 手動でリネーム
  2. `index.html`が古い版に戻り画像参照が`.JPG`/`.png`/`.jpg`のまま → GitHub上はWebP化済みのため404発生
  3. **修正**：`index.html`・`online_shop.html`・`reservation.html`の画像参照を`.webp`に書き換え
     - `images/store/*.jpg` → `images/*.webp`
     - `images/pol_logo.JPG` → `images/pol_logo.webp`
     - `images/hero_sweets_bread.png` → `images/hero_sweets_bread.webp`
     - faviconの`type="image/jpeg"` → `type="image/webp"`
  4. 修正箇所合計：index.html 9件、online_shop.html 11件、reservation.html 3件

### 2026-05-15
- `style.css`：`.gallery-item img`の過剰フィルター（contrast 1.15/saturate 1.3/brightness 1.02）を`filter: none`に変更。商品紹介の写真色合いをオンラインショップと統一・自然な色味に。
- `style.css`：`.yeast-bubble`の視認性向上（白90%＋茶色境界＋影で立体感）。職人のこだわり(About)の酵母泡が背景クリームに溶けて見えなくなっていた問題を解消。
- `online_shop.html`：商品カード画像の`bg-gray-50`＋`opacity-0`onloadフェードを除去（`bg-white`に）。読み込み失敗時に灰色く見える問題を回避し、index商品紹介と表示挙動を統一。

### 2026-05-14（第2版・初版）
- base64ループ問題の教訓・Driveの重複ファイル削除手順を追記
- `news.json`統合、画像WebP化（約23MB削減）、SEO追加、pushスクリプト整備など