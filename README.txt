恩聚共行｜完整活動流程 v5

固定流程：
首頁（既有 live UI，不是 screenshot）
→ 我要報名
→ 第1頁 活動概覽（按鈕：了解詳情）
→ 第2頁 Tému Stay 場地介紹 + 12 張官方網站不同照片 + 活動意義
→ 第3頁 預算說明
→ 第4頁 報名表
→ 第5頁 報名成功
→ 第6頁 活動資訊 & FAQ

執行：
  py server.py
開啟：
  http://127.0.0.1:5000

重要：
- 程式沒有把任何六頁 screenshot、PDF 頁面或 screen capture 當作網頁。
- 首頁沿用之前已確認的 live HTML/CSS 與乾淨素材。
- Gallery 12 張全部是 Tému Stay 官方 Gallery 的不同圖片 URL，不再用同圖 crop。
- 因 Gallery 使用 Tému Stay 官方網站圖片，瀏覽第2頁時需要網路連線。
- Prototype 報名表目前不儲存姓名、電話等個資。
