# AquaSync - 全台水庫水情即時同步系統

<div align="center">

![AquaSync Logo](https://img.shields.io/badge/AquaSync-水庫監控系統-009FFD?style=for-the-badge&logo=water&logoColor=white)

**Taiwan Reservoir Real-time Sync Platform**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ericthegoatskr/AquaSync)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/ericthegoatskr/AquaSync)

</div>

## 📋 專案概述

AquaSync 是一個專為台灣設計的水庫水情即時監控系統，提供全台各大水庫的即時蓄水狀況、水位變化趨勢以及詳細的統計分析。系統採用現代化的響應式設計，確保在任何裝置上都能提供優質的使用體驗。

### 🎯 核心功能

- **即時監控** - 每5分鐘自動更新全台水庫資料
- **視覺化圖表** - 使用 Chart.js 呈現蓄水率趨勢分析
- **智能篩選** - 支援地區、水庫名稱搜尋與多種排序方式
- **響應式設計** - 完美適配桌面、平板、手機等各種裝置
- **狀態統計** - 即時統計水位充足、正常、需關注的水庫數量

## 🚀 快速開始

### 線上體驗

🌐 **立即體驗**: [https://ericthegoatskr.github.io/AquaSync](https://ericthegoatskr.github.io/AquaSync)

### 系統需求

- 現代瀏覽器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
- 網路連線（用於獲取即時資料）

### 本地開發

1. **下載專案**
   ```bash
   git clone https://github.com/ericthegoatskr/AquaSync.git
   cd AquaSync
   ```

2. **直接開啟**
   ```bash
   # 使用任何 HTTP 伺服器開啟 index.html
   # 或直接雙擊 index.html 檔案
   ```

3. **使用 Live Server（推薦）**
   ```bash
   # 如果使用 VS Code，安裝 Live Server 擴充功能
   # 右鍵點擊 index.html 選擇 "Open with Live Server"
   ```

### GitHub Pages 部署

本專案已配置 GitHub Pages，自動部署到：
- **主要網址**: `https://ericthegoatskr.github.io/AquaSync`
- **自訂網域**: `https://aquasync.github.io` (如已設定)

## 🏗️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **HTML5** | - | 語義化結構與無障礙設計 |
| **CSS3** | - | 響應式佈局與動畫效果 |
| **JavaScript ES6+** | - | 核心邏輯與資料處理 |
| **Chart.js** | 4.x | 資料視覺化與圖表呈現 |
| **Bootstrap Icons** | 1.11.3 | 圖示系統 |

### 資料來源

- **經濟部水利署 FHY API** - 即時水庫資料
- **自動更新機制** - 每5分鐘同步最新資料
- **本地快取** - 提升載入速度與離線體驗

### 系統特色

- **模組化架構** - 清晰的程式碼組織與維護性
- **錯誤處理** - 完善的異常處理與使用者提示
- **效能優化** - 防抖動搜尋、虛擬滾動、圖片延遲載入
- **無障礙設計** - 符合 WCAG 2.1 AA 標準

## 📊 功能詳解

### 主要介面

1. **統計儀表板**
   - 水庫總數統計
   - 平均蓄水率計算
   - 水位狀態分類統計

2. **圖表分析**
   - 全台水庫蓄水率橫向條狀圖
   - 點擊圖表項目可快速定位對應水庫
   - 顏色編碼：綠色（充足）、橙色（正常）、紅色（需關注）

3. **水庫卡片**
   - 詳細的水庫資訊展示
   - 動態水位條與水滴動畫
   - 有效容量、目前水量、蓄水率等關鍵指標

4. **搜尋與篩選**
   - 即時搜尋水庫名稱或代碼
   - 地區篩選（北部、中部、南部、東部）
   - 多種排序方式（蓄水率、有效蓄水量）

### 互動功能

- **自動更新** - 背景自動同步最新資料
- **手動刷新** - 點擊重新整理按鈕立即更新
- **平滑滾動** - 點擊圖表項目自動滾動至對應水庫
- **響應式導航** - 回到頂部按鈕與狀態指示器

## 🎨 設計理念

### 視覺設計

- **色彩系統** - 以藍色系為主調，象徵水資源的純淨與科技感
- **動畫效果** - 流暢的過場動畫與微互動，提升使用者體驗
- **字體選擇** - Montserrat（英文）與 Noto Sans TC（中文）確保最佳可讀性

### 使用者體驗

- **載入動畫** - 精美的初始化載入畫面
- **狀態回饋** - 即時的載入狀態與錯誤提示
- **無障礙支援** - 鍵盤導航與螢幕閱讀器相容

## 📱 響應式設計

系統採用 Mobile-First 設計理念，確保在各種裝置上都能提供最佳體驗：

- **桌面版** (1200px+) - 完整功能與多欄佈局
- **平板版** (768px-1199px) - 適配觸控操作的介面調整
- **手機版** (<768px) - 單欄佈局與優化的觸控體驗

## 🔧 開發指南

### 專案結構

```
AquaSync/
├── index.html          # 主頁面
├── app.js             # 核心 JavaScript 邏輯
├── styles.css         # 樣式表
└── README.md          # 專案說明
```

### 程式碼組織

- **配置管理** - 集中管理 API 端點與系統參數
- **資料處理** - 標準化水庫資料格式與統計計算
- **UI 組件** - 模組化的介面更新與事件處理
- **工具函數** - 可重用的格式化與輔助功能

### 自訂開發

如需擴展功能，建議遵循現有的模組化架構：

1. **新增 API 端點** - 在 `CONFIG.API_URLS` 中定義
2. **擴展資料處理** - 在 `dataProcessor` 模組中新增邏輯
3. **自訂 UI 組件** - 在 `ui` 模組中實作新功能

## 📈 效能優化

- **防抖動搜尋** - 300ms 延遲避免過度 API 呼叫
- **虛擬化渲染** - 大量資料的高效顯示
- **圖片優化** - SVG 圖示與壓縮的視覺資源
- **快取策略** - 本地儲存減少重複請求

## 🔒 隱私與安全

- **本地處理** - 所有資料處理均在瀏覽器端完成
- **無追蹤** - 不收集任何使用者個人資訊
- **HTTPS 支援** - 建議在 HTTPS 環境下使用
- **資料來源** - 直接使用官方 API，確保資料準確性

## 🤝 貢獻指南

歡迎提交 Issue 與 Pull Request 來改善這個專案：

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

- **開發者** - ericthegoatskr
- **Email** - tsaieric15@gmail.com
- **GitHub** - [@ericthegoatskr](https://github.com/ericthegoatskr)

## 🙏 致謝

- 經濟部水利署提供開放資料 API
- Chart.js 團隊提供優秀的圖表庫
- Bootstrap Icons 提供完整的圖示系統
- 所有為台灣水資源監控貢獻的開發者

---

<div align="center">

**讓科技守護台灣的水資源** 💧

Designed by Eric

</div>
