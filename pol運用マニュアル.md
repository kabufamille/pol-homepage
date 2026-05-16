# pol ホームページ 運用マニュアル

最終更新：2026年5月15日

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| サイト名 | pol cake&bread ホームページ |
| 公開URL | https://kabufamille.github.io/pol-homepage/ |
| ホスティング | GitHub Pages（kabufamille/pol-homepage リポジトリ・mainブランチ） |
| 素材フォルダ | Google Drive `cake_site`（ID: `18_nJwtI-VvZwOOELs6NeeGYDfqYUTJw3`） |
| スクリプト保存先 | Google Drive `pol-homepege`フォルダ（ID: `1zvri1eTpBIbJobBwlUdjhAYglka6hZCS`） |

---

## GitHub自動アップロード（★重要・必ずこれを使う）

### 仕組み

`push_to_github.sh`スクリプトを使うことで、**Chrome不要・数秒でGitHubにpush**できる。

- **保存場所**：Google Drive `pol-homepege`フォルダ内（`push_to_github.sh`）
- **認証情報**：同フォルダ内の`.github_config`（GitHub PATを格納）
- **Pillow**（Python画像ライブラリ）が必要。Claudeのbash環境には導入済み。

### セッション開始時の準備（別PCや新セッションのとき）

Claudeに以下を依頼する：

```
DriveのpushスクリプトをセットアップしてGitHubの動作確認をしてください
```

Claudeが自動で下記を実行する：
1. DriveからpushスクリプトとGitHub設定ファイルを取得
2. outputsフォルダに配置
3. 動作確認

### 使い方

| やりたいこと | Claudeへの指示例 |
|---|---|
| JSONを更新してアップ | 「news.jsonを更新してアップロードしてください」 |
| 画像を追加 | 「この画像をアップロードしてください」（WebP自動変換） |
| HTMLを修正してアップ | 「index.htmlの○○を修正してアップロードしてください」 |

### 画像アップロードについて

PNG・JPG・JPEG等の画像ファイルを渡すと、**自動でWebPに変換**してから`images/`フォルダへpushする。ファイル名はそのままで拡張子だけ`.webp`になる。HTMLの参照先も合わせて更新が必要な場合はClaudeに依頼する。

---

## コンテンツ更新フロー

### お知らせ・イベント情報（news.json）

**ファイル**：`cake_site`フォルダ内 `news.json`

**フォーマット**：

```json
[
 { "date": "2026.05.01", "type": "event", "content": "イベント名・内容" },
 { "date": "2026.04.20", "type": "update", "content": "更新内容" }
]
```

- `type: "event"` → オレンジ色でEVENT表示
- `type: "update"` → 通常色でUPDATE表示
- 日付降順に自動ソートされる

**更新手順**：Claudeに「news.jsonに○○を追加してアップロードしてください」と依頼するだけ。

### 商品情報（products.json）

**ファイル**：`cake_site`フォルダ内 `products.json`

カテゴリごとに商品名・価格を管理。オンラインショップページに反映される。

---

## HTMLファイル変更フロー

1. Claudeに変更内容を伝える
2. ClaudeがDriveからファイルを取得して修正
3. `push_to_github.sh`でGitHubへpush（自動）
4. 1〜2分でサイトに反映

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

## Claudeへの作業依頼ルール

- `cake_site`フォルダが素材の基準。「アップロードして」と言えばここから取得してGitHubにpushする。
- Drive上のHTMLファイル変更は「DL→修正→Drive上書き→GitHub push」の順で自動実行。
- 画像は必ずWebP変換してからpushする。
- **別PCや新セッション開始時**：まず「DriveからpushスクリプトをセットアップしてGitHubの動作確認をして」と依頼する。
- GitHubへのpushはbashから直接行う（Claude in Chrome不要）。
- Claude in Chromeは Drive上のファイル削除・名前変更が必要なときのみ使用。Chromeは起動してサインイン済みである必要がある。

---

## Claudeが大きなファイルを書き込むときのルール（★トラブル防止）

### base64をbashのechoで渡してはいけない

大きなファイル（数KB以上）をbashの`echo`コマンドでbase64エンコードして渡すと、シェルのバッファ制限により**データが途中で切れる・ループする**バグが発生する。

**正しい手順：**

1. ClaudeのWrite/Editツールでファイルをoutputsフォルダに直接書き込む
2. bashでは`python3 -c "import base64; ..."` を使ってデコードする（ファイル経由）
3. echoで長い文字列をパイプに渡すのは禁止

**Claudeへの依頼例：**
```
大きなファイルの書き込みはWrite/Editツールを使ってください。bashのechoでbase64を渡さないでください。
```

---

## Driveの重複ファイル削除手順

### なぜ手動が必要か

Google Drive APIでは同名ファイルを上書きできず、同じフォルダに同名ファイルが複数存在する状態になる。古いファイルの削除はAPIで可能だが、**誤って最新版を消すリスク**があるため、手動で確認してから削除する運用にしている。

### 削除手順（手動）

1. Google Driveをブラウザで開く
2. 対象フォルダ（`pol-homepege`等）を開く
3. 同名ファイルが複数ある場合、**更新日時が古いほうを右クリック→削除**
4. ゴミ箱を空にする（任意）

### Claudeに頼める場合

Claude in Chromeが使える状態（Chromeが起動・Googleサインイン済み）であれば、「Driveの重複ファイルを削除して」と依頼することで自動実行できる。

---

## 参照URL

- ホームページ：https://kabufamille.github.io/pol-homepage/
- GitHubリポジトリ：https://github.com/kabufamille/pol-homepage
- Google Drive cake_site：https://drive.google.com/drive/folders/18_nJwtI-VvZwOOELs6NeeGYDfqYUTJw3

---

## 変更履歴

### 2026-05-15
- `style.css`：`.gallery-item img`の過剰フィルター（contrast 1.15/saturate 1.3/brightness 1.02）を`filter: none`に変更。商品紹介の写真色合いをオンラインショップと統一・自然な色味に。
- `style.css`：`.yeast-bubble`の視認性向上（白90%＋茶色境界＋影で立体感）。職人のこだわり(About)の酵母泡が背景クリームに溶けて見えなくなっていた問題を解消。
- `online_shop.html`：商品カード画像の`bg-gray-50`＋`opacity-0`onloadフェードを除去（`bg-white`に）。読み込み失敗時に灰色く見える問題を回避し、index商品紹介と表示挙動を統一。
- ★Drive側`style.css`はGitHub のフィルター追加コミット前の状態だったため、GitHub側を編集して整合。Drive↔GitHub 差部は今後随時禨認。

### 2026-05-14（第2版）
- base64ループ問題の教訓を追記
- Driveの重複ファイル削除手順を追記

### 2026-05-14（初版）
- `news.json`：開発膏ゲメヱど+ネるしが[]に変更
- `index.html`：favicon MIMEタイプ `image/png` → `image/jpeg` に修正
- `index.html`：フッター著作権年 `2024` → `2026` に更新
- 未使用画像14点をGitHubから削除（約10MB削減）
- `hero_sweets_bread.png`・`pol_logo.JPG`・`store/`配下7点をWebPに変換（合計約13MB削減）
- `index.html`・`reservation.html`・`online_shop.html`：画像参照をWebPに更新
- Googleマップをレスポンシブ化（width固定 → width:100%）
- Googleフォント読み込みウェイットを最適化（不要ウェイットを削除）
- `news.json`と`event_news.json`を統合（`type`フィールドで区別）
- `news.js`：localStorage依存・開発者メモを削除、常にJSONから最新取得に変更
- SEO追加：meta description・canonical URL・robots.txt・sitemap.xml・titleタグ最適化
- GitHub自動pushスクリプト（`push_to_github.sh`）を整備・Driveに保存

### 2026-05-16

**ホームページ全体をDriveの`cake_site`配下から`pol-homepege`直下へ移動**

- 旧構成：素材ファイルは`cake_site`フォルダ内、`pol-homepege`にはpushスクリプトのみ
- 新構成：全ファイルを`pol-homepege`直下に統合（`cake_site`は空に）
- 移動時に発生した問題と修正：
  1. ファイル名末尾の半角スペース（`news .js` / `online_shop .html` / `reservation .html` / `news .json`）→ 手動でリネーム
  2. `index.html`が古い版に戻り画像参照が`.JPG`/`.png`/`.jpg`のまま → GitHub上はWebP化済みのため404発生
  3. **修正**：`index.html`・`online_shop.html`・`reservation.html`の画像参照を`.webp`に書き換え
     - `images/store/*.jpg` → `images/*.webp`（push_to_github.shが平坦化変換するため`store/`プレフィックスを除去）
     - `images/pol_logo.JPG` → `images/pol_logo.webp`
     - `images/hero_sweets_bread.png` → `images/hero_sweets_bread.webp`
     - faviconの`type="image/jpeg"` → `type="image/webp"`
  4. 修正箇所合計：index.html 9件、online_shop.html 11件、reservation.html 3件

**今後の注意**：Drive上でフォルダ移動・整理する際は、移動後にHTMLの画像参照が`.webp`になっているか確認すること。
