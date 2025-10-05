// ===== Configuration =====
const CONFIG = {
    API_URLS: {
        REALTIME: 'https://fhy.wra.gov.tw/WraApi/v1/Reservoir/RealTimeInfo',
        STATION: 'https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station',
        DAILY: 'https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily',
        WARNING: 'https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Warning'
    },
    AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
    CHART_OPTIONS: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    }
};

// ===== Global State =====
let appState = {
    reservoirs: [],
    filteredReservoirs: [],
    statistics: {
        total: 0,
        averageStorageRate: 0,
        waterLevelFull: 0,
        waterLevelNormal: 0,
        needsAttention: 0
    },
    chart: null,
    autoRefreshTimer: null
};

// ===== DOM References =====
let domElements = {};

// ===== Loading Animation State =====
let loadingState = {
    isInitialLoading: true,
    progress: 0,
    currentStep: 0,
    steps: [
        { text: '正在初始化系統...', progress: 20 },
        { text: '載入介面組件...', progress: 40 },
        { text: '連線至資料庫...', progress: 60 },
        { text: '獲取水庫資料...', progress: 80 },
        { text: '完成載入！', progress: 100 }
    ]
};

// ===== Utility Functions =====
const utils = {
    // Format number with locale
    formatNumber(num, decimals = 2) {
        if (num === null || num === undefined || isNaN(num)) return '--';
        return Number(num).toLocaleString('zh-TW', {
            maximumFractionDigits: decimals
        });
    },

    // Format percentage
    formatPercentage(num) {
        if (num === null || num === undefined || isNaN(num)) return '--%';
        return `${this.formatNumber(num, 1)}%`;
    },

    // Format time
    formatTime(timeStr) {
        try {
            const date = new Date(timeStr);
            if (isNaN(date.getTime())) return '--';
            return date.toLocaleString('zh-TW', { hour12: false });
        } catch {
            return '--';
        }
    },

    // Get water level status class
    getWaterLevelClass(percentage) {
        if (percentage === null || percentage === undefined) return 'danger';
        if (percentage >= 80) return 'success';
        if (percentage >= 50) return 'warning';
        return 'danger';
    },

    // Get water level status text
    getWaterLevelStatus(percentage) {
        if (percentage === null || percentage === undefined) return '無資料';
        if (percentage >= 80) return '水位充足';
        if (percentage >= 50) return '水位正常';
        return '需要關注';
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===== Reservoir Name Mapping =====
const RESERVOIR_NAMES = {
  '10201': '石門水庫',
  '10203': '西勢水庫',
  '10204': '新山水庫',
  '10205': '翡翠水庫',
  '10206': '榮華壩',
  '10207': '鳶山堰',
  '10208': '六堵攔河堰',
  '10209': '桂山壩',
  '10210': '三峽攔河堰',
  '10211': '青潭堰',
  '10212': '直潭壩',
  '10213': '羅好壩',
  '10214': '阿玉壩',
  '10215': '木瓜壩',
  '10216': '中庄調整池',
  '10401': '寶山水庫',
  '10402': '青草湖',
  '10404': '隆恩堰',
  '10405': '寶山第二水庫',
  '10501': '永和山水庫',
  '10503': '大埔水庫',
  '10601': '明德水庫',
  '10801': '粗坑溪攔河堰',
  '10802': '羅東攔河堰',
  '20101': '鯉魚潭水庫',
  '20201': '德基水庫',
  '20202': '石岡壩',
  '20203': '谷關壩',
  '20204': '八寶攔河堰',
  '20205': '天輪壩',
  '20206': '馬鞍壩',
  '20207': '青山壩',
  '20405': '士林攔河堰',
  '20501': '霧社水庫',
  '20502': '日月潭水庫',
  '20503': '集集攔河堰',
  '20504': '頭社水庫',
  '20505': '明潭下池水庫',
  '20506': '銃櫃壩',
  '20507': '武界壩',
  '20508': '明湖下池水庫',
  '20509': '湖山水庫',
  '20510': '劍潭水庫',
  '30301': '仁義潭水庫',
  '30302': '蘭潭水庫',
  '30303': '鹿寮溪水庫',
  '30304': '東口攔河堰',
  '30305': '隘寮堰',
  '30306': '內埔子水庫',
  '30401': '白河水庫',
  '30402': '尖山埤水庫',
  '30403': '德元埤水庫',
  '30501': '烏山頭水庫',
  '30502': '曾文水庫',
  '30503': '南化水庫',
  '30504': '鏡面水庫',
  '30601': '虎頭埤水庫',
  '30602': '鹽水埤水庫',
  '30603': '玉峰堰',
  '30801': '澄清湖水庫',
  '30802': '阿公店水庫',
  '30803': '鳳山水庫',
  '30804': '觀音湖水庫',
  '30805': '美濃湖水庫',
  '30901': '高屏溪攔河堰',
  '31002': '甲仙攔河堰',
  '31201': '牡丹水庫',
  '31202': '龍鑾潭水庫',
  '31301': '成功水庫',
  '40201': '溪畔壩',
  '40202': '水簾壩',
  '40203': '龍溪壩',
  '40701': '酬勤水庫',
  '50102': '興仁水庫',
  '50103': '東衛水庫',
  '50104': '赤崁地下水庫',
  '50105': '西安水庫',
  '50106': '七美水庫',
  '50107': '澎湖海水淡化廠',
  '50108': '小池水庫',
  '50109': '烏溝蓄水塘',
  '50201': '太湖水庫',
  '50202': '田埔水庫',
  '50203': '陽明湖水庫',
  '50204': '山西水庫',
  '50205': '榮湖水庫',
  '50206': '擎天水庫',
  '50207': '金沙水庫',
  '50208': '蓮湖水庫',
  '50209': '菱湖水庫',
  '50210': '西湖水庫',
  '50212': '金湖水庫',
  '50213': '瓊林水庫',
  '50214': '蘭湖',
  '50301': '勝利水庫',
  '50302': '秋桂山水庫',
  '50303': '珠螺水壩',
  '50304': '儲水沃上壩',
  '50305': '儲水沃水庫',
  '50306': '津沙水庫',
  '50307': '津沙一號水庫',
  '50308': '坂里水庫',
  '50309': '東湧水庫',
    '50310': '后沃水庫'
};

// ===== Data Processing =====
const dataProcessor = {
    // Normalize reservoir data
    normalizeReservoir(rawData) {
        // 除錯：印出原始資料結構
        console.log('處理水庫資料:', rawData);
        
        // 取得水庫代碼
        const code = rawData.StationNo || rawData.ReservoirIdentifier || rawData.Code || rawData.Id || rawData.id || '';
        
        // 嘗試多種可能的水庫名稱欄位，優先使用對照表
        let name = RESERVOIR_NAMES[code] || 
                   rawData.ReservoirName || 
                   rawData.StationName || 
                   rawData.Name || 
                   rawData.NAME ||
                   rawData.reservoirName ||
                   rawData.stationName ||
                   rawData.name ||
                   '未知水庫';

        // 除錯：印出水庫名稱
        const nameSource = RESERVOIR_NAMES[code] ? `對照表(${code})` :
                          rawData.ReservoirName ? 'ReservoirName' :
                          rawData.StationName ? 'StationName' :
                          rawData.Name ? 'Name' :
                          rawData.NAME ? 'NAME' :
                          rawData.reservoirName ? 'reservoirName' :
                          rawData.stationName ? 'stationName' :
                          rawData.name ? 'name' : '無匹配欄位';
        
        console.log('提取的水庫名稱:', name, '來自:', nameSource, '代碼:', code);

        return {
            id: code,
            name: name,
            code: code,
            storageRate: rawData.PercentageOfStorage || rawData.StorageRatio || rawData.percentageOfStorage || null,
            effectiveCapacity: rawData.EffectiveStorage || rawData.ActiveStorage || rawData.effectiveStorage || null,
            waterLevel: rawData.WaterLevel || rawData.NowLevel || rawData.waterLevel || null,
            inflow: rawData.Inflow || rawData.InflowVolume || rawData.inflow || null,
            outflow: rawData.Outflow || rawData.OutflowVolume || rawData.outflow || null,
            updateTime: rawData.Time || rawData.RecordTime || rawData.UpdateTime || rawData.time || null,
            region: this.getRegion(code),
            raw: rawData
        };
    },

    // Get region based on station code
    getRegion(code) {
        if (!code) return 'unknown';
        const firstDigit = code.charAt(0);
        switch (firstDigit) {
            case '1': return 'north';
            case '2': return 'central';
            case '3': return 'south';
            case '4': case '5': return 'east';
            default: return 'unknown';
        }
    },

    // Calculate statistics
    calculateStatistics(reservoirs) {
        const stats = {
            total: reservoirs.length,
            averageStorageRate: 0,
            waterLevelFull: 0,
            waterLevelNormal: 0,
            needsAttention: 0
        };

        let totalRate = 0;
        let validCount = 0;

        reservoirs.forEach(reservoir => {
            const rate = reservoir.storageRate;
            if (rate !== null && rate !== undefined) {
                totalRate += rate;
                validCount++;
            }

            if (rate >= 80) {
                stats.waterLevelFull++;
            } else if (rate >= 50) {
                stats.waterLevelNormal++;
            } else {
                stats.needsAttention++;
            }
        });

        stats.averageStorageRate = validCount > 0 ? totalRate / validCount : 0;
        return stats;
    },

    // Filter reservoirs
    filterReservoirs(reservoirs, filters) {
        return reservoirs.filter(reservoir => {
            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const matchesName = reservoir.name.toLowerCase().includes(searchTerm);
                const matchesCode = reservoir.code.toLowerCase().includes(searchTerm);
                if (!matchesName && !matchesCode) return false;
            }

            // Region filter
            if (filters.region && filters.region !== 'all') {
                if (reservoir.region !== filters.region) return false;
            }

            return true;
        });
    },

    // Sort reservoirs
    sortReservoirs(reservoirs, sortBy) {
        return [...reservoirs].sort((a, b) => {
            switch (sortBy) {
                case 'percentage-desc':
                    return (b.storageRate || 0) - (a.storageRate || 0);
                case 'percentage-asc':
                    return (a.storageRate || 0) - (b.storageRate || 0);
                case 'storage-desc':
                    return (b.effectiveCapacity || 0) - (a.effectiveCapacity || 0);
                case 'storage-asc':
                    return (a.effectiveCapacity || 0) - (b.effectiveCapacity || 0);
    case 'name-asc':
                    return a.name.localeCompare(b.name, 'zh-Hant');
                case 'name-desc':
                    return b.name.localeCompare(a.name, 'zh-Hant');
                default:
                    return 0;
            }
        });
    }
};

// ===== UI Components =====
const ui = {
    // Initialize DOM references
    initDOMReferences() {
        domElements = {
            lastUpdated: document.getElementById('lastUpdated'),
            refreshBtn: document.getElementById('refreshBtn'),
            searchInput: document.getElementById('searchInput'),
            regionFilter: document.getElementById('regionFilter'),
            sortSelect: document.getElementById('sortSelect'),
            statusText: document.getElementById('statusText'),
            statusDot: document.getElementById('statusDot'),
            reservoirGrid: document.getElementById('reservoirGrid'),
            emptyState: document.getElementById('emptyState'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            scrollTop: document.getElementById('scrollTop'),
            
            // Statistics elements
            totalReservoirs: document.getElementById('totalReservoirs'),
            avgStorageRate: document.getElementById('avgStorageRate'),
            waterLevelFull: document.getElementById('waterLevelFull'),
            waterLevelNormal: document.getElementById('waterLevelNormal'),
            needsAttention: document.getElementById('needsAttention'),
            
            // Chart element
            chartCanvas: document.getElementById('reservoirChart'),
            
            // Initial loading elements
            initialLoading: document.getElementById('initialLoading'),
            progressFill: document.getElementById('progressFill'),
            loadingPercentage: document.getElementById('loadingPercentage'),
            loadingStatus: document.getElementById('loadingStatus')
        };
    },

    // Update statistics display
    updateStatistics(stats) {
        domElements.totalReservoirs.textContent = stats.total;
        domElements.avgStorageRate.textContent = utils.formatPercentage(stats.averageStorageRate);
        domElements.waterLevelFull.textContent = stats.waterLevelFull;
        domElements.waterLevelNormal.textContent = stats.waterLevelNormal;
        domElements.needsAttention.textContent = stats.needsAttention;
    },

    // Update chart
    updateChart(reservoirs) {
        if (!domElements.chartCanvas) return;

        // Prepare data for all reservoirs with valid storage rate
        const validReservoirs = reservoirs
            .filter(r => r.storageRate !== null && r.storageRate !== undefined)
            .sort((a, b) => b.storageRate - a.storageRate);

        const labels = validReservoirs.map(r => r.name);
        const data = validReservoirs.map(r => r.storageRate);

        // Destroy existing chart
        if (appState.chart) {
            appState.chart.destroy();
        }

        // Create new chart
        appState.chart = new Chart(domElements.chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '蓄水率 (%)',
                    data: data,
                    backgroundColor: data.map(rate => {
                        if (rate >= 80) return 'rgba(212, 175, 55, 0.8)';
                        if (rate >= 50) return 'rgba(245, 158, 11, 0.8)';
                        return 'rgba(244, 63, 94, 0.8)';
                    }),
                    borderColor: data.map(rate => {
                        if (rate >= 80) return '#d4af37';
                        if (rate >= 50) return '#f59e0b';
                        return '#f43f5e';
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `蓄水率: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0,
                            font: {
                                size: 10
                            },
                            callback: function(value, index) {
                                const label = this.getLabelForValue(value);
                                return label.length > 8 ? label.substring(0, 8) + '...' : label;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const reservoirName = validReservoirs[elementIndex].name;
                        this.scrollToReservoirCard(reservoirName);
                    }
                },
                onHover: (event, elements) => {
                    // Change cursor to pointer when hovering over bars
                    if (elements.length > 0) {
                        domElements.chartCanvas.style.cursor = 'pointer';
                    } else {
                        domElements.chartCanvas.style.cursor = 'default';
                    }
                }
            }
        });
    },

    // Create reservoir card
    createReservoirCard(reservoir) {
        const template = document.getElementById('reservoirCardTemplate');
        const card = template.content.cloneNode(true);

        // Add unique ID to the card for easy targeting
        const cardElement = card.querySelector('.reservoir-card');
        cardElement.id = `reservoir-${reservoir.id || reservoir.code || reservoir.name.replace(/\s+/g, '-')}`;

        // Fill in data
        console.log('創建卡片，水庫資料:', reservoir);
        card.querySelector('.reservoir-name').textContent = reservoir.name || '未知水庫';
        card.querySelector('.location-text').textContent = this.getRegionName(reservoir.region);
        
        // Water level section
        const waterLevelFill = card.querySelector('.water-level-fill');
        const waterLevelPercentage = card.querySelector('.water-level-percentage');
        const waterLevelStatus = card.querySelector('.water-level-status');
        const waterDrops = card.querySelectorAll('.water-drops i');

        if (reservoir.storageRate !== null && reservoir.storageRate !== undefined) {
            const rate = reservoir.storageRate;
            waterLevelFill.style.width = `${rate}%`;
            waterLevelFill.className = `water-level-fill ${utils.getWaterLevelClass(rate)}`;
            waterLevelPercentage.textContent = utils.formatPercentage(rate);
            
            const status = utils.getWaterLevelStatus(rate);
            waterLevelStatus.textContent = status;
            waterLevelStatus.className = `water-level-status ${utils.getWaterLevelClass(rate)}`;

            // Update water drops
            const filledDrops = Math.ceil((rate / 100) * 5);
            waterDrops.forEach((drop, index) => {
                drop.className = index < filledDrops ? 'bi bi-droplet-fill filled' : 'bi bi-droplet-fill';
            });
        } else {
            waterLevelFill.style.width = '0%';
            waterLevelFill.className = 'water-level-fill danger';
            waterLevelPercentage.textContent = '--%';
            waterLevelStatus.textContent = '無資料';
            waterLevelStatus.className = 'water-level-status danger';
        }

        // Metrics
        card.querySelector('.effective-capacity').textContent = 
            reservoir.effectiveCapacity ? `${utils.formatNumber(reservoir.effectiveCapacity)} 萬m³` : '--';
        card.querySelector('.current-water').textContent = 
            reservoir.effectiveCapacity && reservoir.storageRate ? 
            `${utils.formatNumber(reservoir.effectiveCapacity * (reservoir.storageRate / 100))} 萬m³` : '--';
        card.querySelector('.storage-rate').textContent = utils.formatPercentage(reservoir.storageRate);
        card.querySelector('.water-status').textContent = utils.getWaterLevelStatus(reservoir.storageRate);

        // Footer
        card.querySelector('.time-text').textContent = 
            reservoir.updateTime ? utils.formatTime(reservoir.updateTime) : '--';
        card.querySelector('.code-text').textContent = reservoir.code || '--';

        return card;
    },

    // Get region name in Chinese
    getRegionName(region) {
        const regionNames = {
            'north': '北部',
            'central': '中部',
            'south': '南部',
            'east': '東部',
            'unknown': '未知區域'
        };
        return regionNames[region] || '未知區域';
    },

    // Update reservoir grid
    updateReservoirGrid(reservoirs) {
        console.log('更新水庫網格，水庫數量:', reservoirs.length);
        console.log('水庫資料:', reservoirs);
        
        domElements.reservoirGrid.innerHTML = '';
        
        if (reservoirs.length === 0) {
            domElements.emptyState.classList.remove('hidden');
            return;
        }

        domElements.emptyState.classList.add('hidden');
        
        const fragment = document.createDocumentFragment();
        reservoirs.forEach((reservoir, index) => {
            console.log(`處理第 ${index + 1} 個水庫:`, reservoir);
            const card = this.createReservoirCard(reservoir);
            fragment.appendChild(card);
        });
        
        domElements.reservoirGrid.appendChild(fragment);
    },

    // Update status
    updateStatus(message, type = 'info') {
        domElements.statusText.textContent = message;
        domElements.statusDot.className = `status-dot ${type}`;
    },

    // Update last updated time
    updateLastUpdated(time = new Date()) {
        domElements.lastUpdated.textContent = `最後更新: ${utils.formatTime(time)}`;
    },

    // Show/hide loading overlay
    toggleLoadingOverlay(show) {
        if (show) {
            domElements.loadingOverlay.classList.remove('hidden');
        } else {
            domElements.loadingOverlay.classList.add('hidden');
        }
    },

    // Show scroll to top button
    toggleScrollTopButton() {
        if (window.scrollY > 300) {
            domElements.scrollTop.classList.add('visible');
        } else {
            domElements.scrollTop.classList.remove('visible');
        }
    },

    // Update loading progress
    updateLoadingProgress(progress, statusText) {
        if (domElements.progressFill && domElements.loadingPercentage && domElements.loadingStatus) {
            domElements.progressFill.style.width = `${progress}%`;
            domElements.loadingPercentage.textContent = `${Math.round(progress)}%`;
            domElements.loadingStatus.textContent = statusText;
        }
    },

    // Hide initial loading animation
    hideInitialLoading() {
        if (domElements.initialLoading) {
            domElements.initialLoading.classList.add('fade-out');
            setTimeout(() => {
                domElements.initialLoading.style.display = 'none';
                loadingState.isInitialLoading = false;
            }, 800);
        }
    },

    // Scroll to specific reservoir card
    scrollToReservoirCard(reservoirName) {
        // Find the card with matching reservoir name
        const cards = document.querySelectorAll('.reservoir-card');
        let targetCard = null;
        
        cards.forEach(card => {
            const cardName = card.querySelector('.reservoir-name').textContent;
            if (cardName === reservoirName) {
                targetCard = card;
            }
        });

        if (targetCard) {
            // Remove any existing highlight
            this.removeCardHighlight();
            
            // Add highlight to target card
            targetCard.classList.add('highlighted');
            
            // Scroll to the card with smooth behavior
            targetCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Add a subtle notification
            this.showNotification(`已跳轉至 ${reservoirName}`, 'success');

            // Remove highlight after 3 seconds
            setTimeout(() => {
                this.removeCardHighlight();
            }, 3000);
        } else {
            // Show error notification if card not found
            this.showNotification(`找不到水庫：${reservoirName}`, 'error');
        }
    },

    // Remove highlight from all cards
    removeCardHighlight() {
        const cards = document.querySelectorAll('.reservoir-card');
        cards.forEach(card => {
            card.classList.remove('highlighted');
        });
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// ===== Loading Animation Controller =====
const loadingController = {
    // Simulate loading steps
    async simulateLoading() {
        for (let i = 0; i < loadingState.steps.length; i++) {
            const step = loadingState.steps[i];
            
            // Update progress and status
            ui.updateLoadingProgress(step.progress, step.text);
            
            // Wait before next step (except last step)
            if (i < loadingState.steps.length - 1) {
                await this.delay(800 + Math.random() * 400); // Random delay between 800-1200ms
            }
        }
        
        // Final delay before hiding loading
        await this.delay(1000);
        ui.hideInitialLoading();
    },

    // Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Start loading animation
    start() {
        this.simulateLoading();
    }
};

// ===== API Functions =====
const api = {
    // Fetch reservoir data
    async fetchReservoirData() {
        try {
            const response = await fetch(CONFIG.API_URLS.REALTIME, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-store',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            const json = await response.json();
            
            // 除錯：印出 API 回應的資料結構
            console.log('API 回應資料:', json);
            if (Array.isArray(json) && json.length > 0) {
                console.log('第一筆資料結構:', json[0]);
                console.log('第一筆資料的所有欄位:', Object.keys(json[0]));
            }

            // Handle different response formats
            const data = Array.isArray(json) ? json
               : Array.isArray(json?.data) ? json.data
               : Array.isArray(json?.Result) ? json.Result
               : [];

            if (data.length === 0) {
                throw new Error('API 未回傳資料');
            }

            console.log(`成功取得 ${data.length} 筆水庫資料`);
            return data.map(rawData => dataProcessor.normalizeReservoir(rawData));
        } catch (error) {
            console.error('API 請求失敗:', error);
            throw error;
        }
    }
};

// ===== Event Handlers =====
const eventHandlers = {
    // Initialize event listeners
    init() {
        // Search input
        domElements.searchInput.addEventListener('input', 
            utils.debounce(() => this.handleFilterChange(), 300)
        );

        // Region filter
        domElements.regionFilter.addEventListener('change', () => this.handleFilterChange());

        // Sort select
        domElements.sortSelect.addEventListener('change', () => this.handleFilterChange());

        // Refresh button
        domElements.refreshBtn.addEventListener('click', () => this.handleRefresh());

        // Scroll to top
        domElements.scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll event for scroll to top button
        window.addEventListener('scroll', 
            utils.debounce(() => ui.toggleScrollTopButton(), 100)
        );

        // Auto refresh
        this.startAutoRefresh();
    },

    // Handle filter changes
    handleFilterChange() {
        const filters = {
            search: domElements.searchInput.value.trim(),
            region: domElements.regionFilter.value
        };

        const sortBy = domElements.sortSelect.value;

        appState.filteredReservoirs = dataProcessor.sortReservoirs(
            dataProcessor.filterReservoirs(appState.reservoirs, filters),
            sortBy
        );

        this.updateDisplay();
    },

    // Handle refresh
    async handleRefresh() {
        await this.loadData();
    },

    // Update display
    updateDisplay() {
        ui.updateStatistics(dataProcessor.calculateStatistics(appState.filteredReservoirs));
        ui.updateChart(appState.filteredReservoirs);
        ui.updateReservoirGrid(appState.filteredReservoirs);
    },

    // Start auto refresh
    startAutoRefresh() {
        if (appState.autoRefreshTimer) {
            clearInterval(appState.autoRefreshTimer);
        }

        appState.autoRefreshTimer = setInterval(() => {
            this.loadData(true);
        }, CONFIG.AUTO_REFRESH_INTERVAL);
    },

    // Stop auto refresh
    stopAutoRefresh() {
        if (appState.autoRefreshTimer) {
            clearInterval(appState.autoRefreshTimer);
            appState.autoRefreshTimer = null;
        }
    },

    // Load data
    async loadData(isAutoRefresh = false) {
        try {
            // Don't show loading overlay during initial loading
            if (!isAutoRefresh && !loadingState.isInitialLoading) {
                ui.toggleLoadingOverlay(true);
                ui.updateStatus('載入資料中...', 'loading');
            }

            const reservoirs = await api.fetchReservoirData();
            
            appState.reservoirs = reservoirs;
            appState.filteredReservoirs = dataProcessor.sortReservoirs(reservoirs, domElements.sortSelect.value);

            ui.updateStatistics(dataProcessor.calculateStatistics(appState.filteredReservoirs));
            ui.updateChart(appState.filteredReservoirs);
            ui.updateReservoirGrid(appState.filteredReservoirs);
            ui.updateLastUpdated();
            ui.updateStatus('資料已更新', 'success');

            if (!isAutoRefresh && !loadingState.isInitialLoading) {
                ui.toggleLoadingOverlay(false);
            }

        } catch (error) {
            console.error('載入資料失敗:', error);
            ui.updateStatus(`載入失敗: ${error.message}`, 'error');
            
            if (!isAutoRefresh && !loadingState.isInitialLoading) {
                ui.toggleLoadingOverlay(false);
            }
        }
    }
};

// ===== App Initialization =====
const app = {
    async init() {
        try {
            // Initialize DOM references
            ui.initDOMReferences();

            // Start loading animation
            loadingController.start();

            // Initialize event handlers
            eventHandlers.init();

            // Wait for loading animation to complete, then load data
            setTimeout(async () => {
                if (loadingState.isInitialLoading) {
                    // If loading animation is still running, wait for it
                    const checkLoading = setInterval(() => {
                        if (!loadingState.isInitialLoading) {
                            clearInterval(checkLoading);
                            this.loadAppData();
                        }
                    }, 100);
                } else {
                    // Loading animation already completed
                    await this.loadAppData();
                }
            }, 2000); // Start loading data after 2 seconds

            console.log('台灣水庫監控系統已啟動 🚀');
        } catch (error) {
            console.error('應用程式初始化失敗:', error);
            ui.updateStatus('初始化失敗', 'error');
        }
    },

    async loadAppData() {
        try {
            // Load initial data
            await eventHandlers.loadData();
        } catch (error) {
            console.error('載入資料失敗:', error);
            ui.updateStatus('載入資料失敗', 'error');
        }
    }
};

// ===== Start App =====
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// ===== Cleanup on page unload =====
window.addEventListener('beforeunload', () => {
    eventHandlers.stopAutoRefresh();
    if (appState.chart) {
        appState.chart.destroy();
    }
});
