# GitHub Pages 部署指南

## 📋 部署前檢查清單

### ✅ 必要檔案確認

- [x] `index.html` - 主頁面
- [x] `app.js` - 核心 JavaScript 邏輯
- [x] `styles.css` - 樣式表
- [x] `README.md` - 專案說明
- [x] `.gitignore` - Git 忽略檔案
- [x] `404.html` - 錯誤頁面
- [x] `_config.yml` - Jekyll 配置
- [x] `CNAME` - 自訂網域配置

### 🔧 技術配置檢查

- [x] CORS 設定已優化
- [x] API 端點配置正確
- [x] 響應式設計測試通過
- [x] 外部資源載入正常

## 🚀 部署步驟

### 1. 初始化 Git 儲存庫

```bash
# 在專案根目錄執行
git init
git add .
git commit -m "Initial commit: AquaSync Taiwan Reservoir Monitor"
```

### 2. 建立 GitHub 儲存庫

1. 前往 [GitHub](https://github.com) 建立新儲存庫
2. 儲存庫名稱建議：`AquaSync`
3. 設定為公開儲存庫
4. 不要初始化 README（已有現有檔案）

### 3. 推送程式碼

```bash
# 添加遠端儲存庫
git remote add origin https://github.com/ericthegoatskr/AquaSync.git

# 推送程式碼
git branch -M main
git push -u origin main
```

### 4. 啟用 GitHub Pages

1. 前往儲存庫的 **Settings** 頁面
2. 滾動到 **Pages** 區段
3. 在 **Source** 選擇 **Deploy from a branch**
4. 選擇 **main** 分支和 **/ (root)** 資料夾
5. 點擊 **Save**

### 5. 等待部署完成

- 部署通常需要 5-10 分鐘
- 可以在 **Actions** 頁面查看部署狀態
- 部署完成後，網站將在 `https://ericthegoatskr.github.io/AquaSync` 上線

## 🔍 部署後檢查

### 功能測試

- [ ] 頁面載入正常
- [ ] API 資料獲取成功
- [ ] 圖表顯示正確
- [ ] 搜尋功能運作
- [ ] 響應式設計正常
- [ ] 載入動畫顯示

### 效能檢查

- [ ] 頁面載入速度 < 3 秒
- [ ] 行動裝置體驗良好
- [ ] 無 JavaScript 錯誤
- [ ] 外部資源載入正常

## 🛠️ 常見問題排除

### CORS 錯誤

如果遇到 CORS 錯誤，檢查：
1. API 端點是否支援跨域請求
2. 瀏覽器開發者工具的 Network 標籤
3. 考慮使用 CORS 代理服務

### 404 錯誤

如果頁面顯示 404：
1. 確認檔案路徑正確
2. 檢查 `_config.yml` 配置
3. 確認 GitHub Pages 已正確啟用

### 樣式問題

如果樣式顯示異常：
1. 檢查 CSS 檔案路徑
2. 確認外部字體載入正常
3. 檢查瀏覽器相容性

## 📊 監控與維護

### 定期檢查

- 每週檢查網站可用性
- 監控 API 回應狀態
- 檢查載入效能

### 更新流程

1. 本地修改程式碼
2. 測試功能正常
3. 提交變更到 Git
4. 推送到 GitHub
5. 等待自動部署

## 🔒 安全考量

- 所有資料處理在客戶端進行
- 不收集使用者個人資訊
- 使用 HTTPS 加密傳輸
- 定期更新依賴套件

## 📞 技術支援

如遇到部署問題，請：
1. 檢查 GitHub Actions 日誌
2. 查看瀏覽器開發者工具
3. 參考 GitHub Pages 官方文件
4. 提交 Issue 到專案儲存庫
