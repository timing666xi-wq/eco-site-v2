# Timing Peace 環保行動（成品站 v2）

Timing Peace 環保行動新版網站，回收內容依台灣 EPA 規範建立，含管理後台照片上傳系統，無外相依賴：

- `index.html` — 單頁式：Hero（五色桶插畫）、五色回收指南、四位碼查詢、影響數據、活動行事曆、零廢棄挑戰、**照片牆**、志工 CTA、聯絡表單、四欄 footer
- `style.css` — 現站綠調設計系統（forest/leaf/mint/sage/earth + 五色分類色），斷點 860/560，focus 框 #b59326
- `script.js` — 行動版導覽、滾動高亮、進場動畫（尊重 prefers-reduced-motion）、四碼查詢、清單進度、表單演示、照片牆渲染（讀 `data/photos.json`）
- `admin.html` — **管理後台**：輸入你的 GitHub Token 登入，照片壓縮後上傳到 repo `images/`，自動更新照片牆
- `data/photos.json` — 照片清單（由後台增删；`index.html` 照片牆即時渲染）

## 本地預覽
直接雙擊 `index.html` 開啟，或在資料夾內执行：

```
python -m http.server 8080
```

然後到瀏覽器開 `http://localhost:8080`。四碼查詢即時可用：輸入 1Q73W、C90、G71、A51、AL81、T94、F94（未收錄的碼依首字母粗分）。

## 上傳照片（管理員）
1. 用 **repo 擁有者帳號（timing666xi-wq）** 登入 github.com
2. 建 Token：Settings → Developer settings → Fine-grained tokens → 只選 `eco-site-v2` 這個 repo、Contents 權限 Read and write
3. 打開網站 `/admin.html`（footer「管理員登入」），貼上 Token 登入
4. 選照片、填標題/分類/地點/日期 →「上傳並發佈」：照片存進 repo `images/`，清單寫入 `data/photos.json`，約 1 分鐘後全站照片牆更新
5. 登出即從瀏覽器移除 Token（Token 只存在這台瀏覽器，不送其他伺服器）

注意：照片牆要用 `http://` 服務開（雙擊 file:// 開啟時 fetch 會被瀏覽器封鎖）。

## 部署到 GitHub Pages
1. 把這 3 檔上傳到你的 repo（例如既有的 eco-site repo；**覆蓋現站前先備份**），或新建 repo `eco-site-v2`
2. Pages 設定為該分支根目錄，即得到 `https://timing666666.github.io/<repo>/`

## 內容依據與待接資料
- 五色桶：EPA 規範 紙白・塑膠黃・金屬藍・玻璃綠・**罐與瓶紫**（紫＝金屬罐＋玻璃瓶罐）
- 四位碼材質碼示範字典 15 碼（Q73W 塑膠、C90 紙容器、P41/P42 紙包裝、G71 玻璃、A51 金屬罐、AL81 鋁罐、T94 紡織、F94 木頭）
- 正式上線建議接：EPA 官方四位碼表、各市政府開放資料（清運路線、回收據點、村里收運日差異）
- 危害廢棄物（電池、日光燈管、省電燈泡、油漆罐、噴霧罐）由清潔隊不定時專收，不入五桶——已在指南與活動頁標注
- 聯絡表單為演示（無後端）；上線接 form 服務（表單服務）或 mailto

## 已驗證
Headless Chrome：四碼 1Q73W 查詢真實執行 OK、console 錯誤 0、桌面全頁 4982px（1280 寬）、行動版 420 寬全頁 7540px，截圖存於 `../eco-site-plan/shots2/`。
