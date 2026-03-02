(function () {
  'use strict';

  // ===== OT Rate Configuration (Thai Labor Law) =====
  var OT_RATES = {
    workday_ot: {
      rate: 1.5,
      name: 'OT วันทำงานปกติ',
      description: 'ล่วงเวลาวันทำงานปกติ (1.5 เท่า)'
    },
    holiday_work: {
      rate: 1,
      name: 'ทำงานวันหยุด (รายเดือน)',
      description: 'ทำงานในเวลาปกติวันหยุด - ลูกจ้างรายเดือน (1 เท่า)'
    },
    holiday_work_daily: {
      rate: 2,
      name: 'ทำงานวันหยุด (รายวัน)',
      description: 'ทำงานในเวลาปกติวันหยุด - ลูกจ้างรายวัน (2 เท่า)'
    },
    holiday_ot: {
      rate: 3,
      name: 'OT วันหยุด',
      description: 'ล่วงเวลาวันหยุด (3 เท่า)'
    }
  };

  // ===== DOM Elements =====
  var form = document.getElementById('otForm');
  var salaryTypeSelect = document.getElementById('salaryType');
  var salaryInput = document.getElementById('salary');
  var salaryLabel = document.getElementById('salaryLabel');
  var workingDaysRow = document.getElementById('workingDaysRow');
  var workingDaysSelect = document.getElementById('workingDays');
  var hoursPerDaySelect = document.getElementById('hoursPerDay');
  var otHoursInput = document.getElementById('otHours');
  var decreaseBtn = document.getElementById('decreaseHours');
  var increaseBtn = document.getElementById('increaseHours');
  var calculateBtn = document.getElementById('calculateBtn');
  var resetBtn = document.getElementById('resetBtn');
  var resultSection = document.getElementById('resultSection');
  var resultAmount = document.getElementById('resultAmount');
  var hourlyRateDisplay = document.getElementById('hourlyRate');
  var otTypeDisplay = document.getElementById('otTypeDisplay');
  var otMultiplierDisplay = document.getElementById('otMultiplier');
  var otHoursDisplay = document.getElementById('otHoursDisplay');
  var formulaDisplay = document.getElementById('formulaDisplay');
  var saveResultBtn = document.getElementById('saveResultBtn');
  var historyList = document.getElementById('historyList');
  var historyEmpty = document.getElementById('historyEmpty');
  var clearHistoryBtn = document.getElementById('clearHistoryBtn');
  var monthlySummary = document.getElementById('monthlySummary');
  var summaryCount = document.getElementById('summaryCount');
  var summaryHours = document.getElementById('summaryHours');
  var summaryTotal = document.getElementById('summaryTotal');
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');

  // ===== State =====
  var history = loadHistory();
  var lastResult = null;

  // ===== Initialization =====
  initTheme();
  renderHistory();
  attachEventListeners();

  // ===== Theme =====
  function initTheme() {
    var savedTheme = localStorage.getItem('ot-calc-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = '&#9728;';
    }
  }

  function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = '&#9790;';
      localStorage.setItem('ot-calc-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = '&#9728;';
      localStorage.setItem('ot-calc-theme', 'dark');
    }
  }

  // ===== Event Listeners =====
  function attachEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);

    salaryTypeSelect.addEventListener('change', handleSalaryTypeChange);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculate();
    });

    form.addEventListener('reset', function () {
      setTimeout(function () {
        resultSection.hidden = true;
        lastResult = null;
        handleSalaryTypeChange();
        clearActiveCards();
        setActiveCard('workday_ot');
      }, 0);
    });

    // OT type card selection
    var otTypeCards = document.querySelectorAll('.ot-type-card');
    otTypeCards.forEach(function (card) {
      card.addEventListener('click', function () {
        clearActiveCards();
        card.classList.add('active');
      });
    });

    // Hours +/- buttons
    decreaseBtn.addEventListener('click', function () {
      var current = parseFloat(otHoursInput.value) || 0;
      if (current > 0) {
        otHoursInput.value = Math.max(0, current - 0.5);
      }
    });

    increaseBtn.addEventListener('click', function () {
      var current = parseFloat(otHoursInput.value) || 0;
      otHoursInput.value = current + 0.5;
    });

    // Quick hour buttons
    var quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        otHoursInput.value = btn.getAttribute('data-hours');
      });
    });

    saveResultBtn.addEventListener('click', saveCurrentResult);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Keyboard support for calculate
    salaryInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    });

    otHoursInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    });
  }

  // ===== Salary Type Handling =====
  function handleSalaryTypeChange() {
    var type = salaryTypeSelect.value;
    var labelMap = {
      monthly: 'เงินเดือน (บาท/เดือน)',
      daily: 'ค่าจ้างรายวัน (บาท/วัน)',
      hourly: 'ค่าจ้างรายชั่วโมง (บาท/ชม.)'
    };
    var placeholderMap = {
      monthly: 'เช่น 15000',
      daily: 'เช่น 500',
      hourly: 'เช่น 62.50'
    };

    salaryLabel.textContent = labelMap[type];
    salaryInput.placeholder = placeholderMap[type];
    workingDaysRow.style.display = type === 'hourly' ? 'none' : '';
  }

  // ===== Card Selection =====
  function clearActiveCards() {
    document.querySelectorAll('.ot-type-card').forEach(function (c) {
      c.classList.remove('active');
    });
  }

  function setActiveCard(value) {
    var radio = document.querySelector('input[name="otType"][value="' + value + '"]');
    if (radio) {
      radio.checked = true;
      radio.closest('.ot-type-card').classList.add('active');
    }
  }

  // ===== Calculation =====
  function calculate() {
    var salary = parseFloat(salaryInput.value);
    var otHours = parseFloat(otHoursInput.value);
    var salaryType = salaryTypeSelect.value;
    var otTypeRadio = document.querySelector('input[name="otType"]:checked');

    // Validation
    if (!salary || salary <= 0) {
      salaryInput.classList.add('error');
      salaryInput.focus();
      return;
    }
    salaryInput.classList.remove('error');

    if (!otHours || otHours <= 0) {
      otHoursInput.classList.add('error');
      otHoursInput.focus();
      return;
    }
    otHoursInput.classList.remove('error');

    if (!otTypeRadio) return;

    var otType = otTypeRadio.value;
    var workingDays = parseInt(workingDaysSelect.value);
    var hoursPerDay = parseInt(hoursPerDaySelect.value);

    // Calculate hourly rate
    var hourlyRate;
    if (salaryType === 'hourly') {
      hourlyRate = salary;
    } else if (salaryType === 'daily') {
      hourlyRate = salary / hoursPerDay;
    } else {
      hourlyRate = salary / workingDays / hoursPerDay;
    }

    // Get OT rate
    var otRate = OT_RATES[otType];
    var multiplier = otRate.rate;

    // Calculate OT pay
    var otPay = hourlyRate * multiplier * otHours;

    // Store last result
    lastResult = {
      salary: salary,
      salaryType: salaryType,
      hourlyRate: hourlyRate,
      otType: otType,
      otTypeName: otRate.name,
      multiplier: multiplier,
      hours: otHours,
      amount: otPay,
      timestamp: new Date().toISOString()
    };

    // Display results
    displayResult(lastResult);
  }

  function displayResult(result) {
    resultSection.hidden = false;

    resultAmount.textContent = formatCurrency(result.amount);
    hourlyRateDisplay.textContent = formatCurrency(result.hourlyRate) + ' บาท';
    otTypeDisplay.textContent = result.otTypeName;
    otMultiplierDisplay.textContent = result.multiplier + ' เท่า';
    otHoursDisplay.textContent = result.hours + ' ชม.';
    formulaDisplay.textContent =
      formatCurrency(result.hourlyRate) + ' x ' +
      result.multiplier + ' x ' +
      result.hours + ' = ' +
      formatCurrency(result.amount) + ' บาท';

    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ===== History =====
  function saveCurrentResult() {
    if (!lastResult) return;

    history.unshift(Object.assign({}, lastResult));
    saveHistory();
    renderHistory();

    saveResultBtn.textContent = 'บันทึกแล้ว!';
    setTimeout(function () {
      saveResultBtn.innerHTML = '<span aria-hidden="true">&#128190;</span> บันทึกผลลัพธ์';
    }, 1500);
  }

  function renderHistory() {
    if (history.length === 0) {
      historyEmpty.hidden = false;
      clearHistoryBtn.hidden = true;
      monthlySummary.hidden = true;
      // Clear any history items but keep the empty message
      var existingItems = historyList.querySelectorAll('.history-item');
      existingItems.forEach(function (item) { item.remove(); });
      return;
    }

    historyEmpty.hidden = true;
    clearHistoryBtn.hidden = false;
    monthlySummary.hidden = false;

    // Clear existing items
    var existingItems = historyList.querySelectorAll('.history-item');
    existingItems.forEach(function (item) { item.remove(); });

    history.forEach(function (item, index) {
      var el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML =
        '<div class="history-info">' +
          '<span class="history-type">' + escapeHTML(item.otTypeName) + '</span>' +
          '<span class="history-detail">' +
            escapeHTML(item.hours + ' ชม. | อัตรา ' + formatCurrency(item.hourlyRate) + ' บาท/ชม. | ' + formatDate(item.timestamp)) +
          '</span>' +
        '</div>' +
        '<span class="history-amount">+' + formatCurrency(item.amount) + ' ฿</span>' +
        '<button class="history-delete" data-index="' + index + '" aria-label="ลบรายการนี้" title="ลบ">&times;</button>';

      el.querySelector('.history-delete').addEventListener('click', function () {
        deleteHistoryItem(index);
      });

      historyList.appendChild(el);
    });

    updateSummary();
  }

  function deleteHistoryItem(index) {
    history.splice(index, 1);
    saveHistory();
    renderHistory();
  }

  function clearHistory() {
    if (!confirm('ต้องการล้างประวัติการคำนวณทั้งหมดหรือไม่?')) return;
    history = [];
    saveHistory();
    renderHistory();
  }

  function updateSummary() {
    var totalCount = history.length;
    var totalHours = 0;
    var totalAmount = 0;

    history.forEach(function (item) {
      totalHours += item.hours;
      totalAmount += item.amount;
    });

    summaryCount.textContent = totalCount;
    summaryHours.textContent = totalHours.toFixed(1);
    summaryTotal.textContent = formatCurrency(totalAmount) + ' ฿';
  }

  // ===== Storage =====
  function loadHistory() {
    try {
      var data = localStorage.getItem('ot-calc-history');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem('ot-calc-history', JSON.stringify(history));
    } catch (e) {
      // Storage full or unavailable
    }
  }

  // ===== Helpers =====
  function formatCurrency(amount) {
    return amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatDate(isoString) {
    var date = new Date(isoString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
