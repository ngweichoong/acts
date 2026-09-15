恩聚共行｜完整活動流程 v6

固定流程：
首頁（既有 live UI，不是 screenshot）
→ 我要報名
→ 第1頁 活動概覽（按鈕：了解詳情）
→ 第2頁 Tému Stay 場地介紹 + 12 張官方網站不同照片 + 活動意義
→ 第3頁 預算說明
→ 第4頁 報名表
→ 第5頁 報名成功
→ 第6頁 活動資訊 & FAQ

首頁新增：
- 「留言同行」區塊
- 留言資料使用 GitHub Issue #2
- 首頁透過 GitHub 公開 API 顯示最近留言
- 「我要留言」會直接開啟 GitHub 留言頁
- 不需要 Python 後端，可直接在 GitHub Pages 使用

執行：
  py server.py
開啟：
  http://127.0.0.1:5000

重要：
- 網站留言需要 GitHub 帳號。
- 留言儲存在公開 GitHub Issue，因此不要張貼電話、地址或其他敏感個人資料。
- GitHub 公開 API 有匿名請求頻率限制；小組網站一般使用量足夠。
- 程式沒有把任何六頁 screenshot、PDF 頁面或 screen capture 當作網頁。
- 首頁沿用之前已確認的 live HTML/CSS 與乾淨素材。
- Gallery 12 張全部是 Tému Stay 官方 Gallery 的不同圖片 URL，不再用同圖 crop。
- 因 Gallery 使用 Tému Stay 官方網站圖片，瀏覽第2頁時需要網路連線。
- Prototype 報名表目前不儲存姓名、電話等個資。
