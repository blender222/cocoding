$(function () {
  let oSVG = Snap("#svgClock");
  // <開始畫圖>
  // 畫白底
  let clockBackground = oSVG.circle(0, 0, 81);
  // 畫數字
  let numberGroup12 = oSVG.g();
  let svgArrayNum = new Array(13);
  for (let i = 1; i <= 12; i++) {
    svgArrayNum[i] = oSVG.text(64 * Snap.cos(i * 30 - 90), 64 * Snap.sin(i * 30 - 90) + 1.5, i);
    svgArrayNum[i].attr("font-family", "Hind Vadodara");
    numberGroup12.add(svgArrayNum[i]);
  }
  // 畫刻度
  let tickGroup48 = oSVG.g();
  let tickGroup12 = oSVG.g();
  let tempTick = null;
  for (let i = 1; i <= 60; i++) {
    if (i % 5 == 0) {
      // 畫大刻度
      tempTick = oSVG.line(0, -80, 0, -74);
      tempTick.attr({
        transform: "rotate(" + i * 30 + ")",
      });
      tickGroup12.add(tempTick);
      continue;
    }
    // 畫小刻度
    tempTick = oSVG.line(0, -80, 0, -76);
    tempTick.attr({
      transform: "rotate(" + i * 6 + ")",
    });
    tickGroup48.add(tempTick);
  }
  // 畫外圓框
  let clockFrame = oSVG.circle(0, 0, 81);
  // 畫指針
  let svgHourPointer = oSVG.line(0, 7, 0, -40);
  let svgMinutePointer = oSVG.line(0, 10, 0, -65);
  let svgSecondPointer = oSVG.line(0, 15, 0, -70);
  let pointerCircle = oSVG.circle(0, 0, 2.2);
  // 定義漸層
  let gradClockFrame = oSVG.gradient("l(0,0,1,1)#f4a460-#daa520");
  // 設置外觀
  svgHourPointer.attr({
    stroke: "#000",
    strokeWidth: 5,
  });
  svgMinutePointer.attr({
    stroke: "#666",
    strokeWidth: 2,
  });
  svgSecondPointer.attr({
    stroke: "#f00",
    strokeWidth: 1.5,
  });
  pointerCircle.attr({
    fill: "#f00",
  });
  clockBackground.attr({
    fill: "rgba(255,255,255,.3)",
  });
  clockFrame.attr({
    // stroke: '#ffa500',
    stroke: gradClockFrame,
    fill: "none",
    strokeWidth: 5,
  });
  numberGroup12.attr({
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontSize: "20",
    fill: "#000",
  });
  tickGroup12.attr({
    stroke: "#000",
    strokeWidth: 1.8,
  });
  tickGroup48.attr({
    stroke: "#000",
    strokeWidth: 0.6,
  });
  svgArrayNum[1].attr("transform", "traslate(0,0)");
  svgArrayNum[2].attr("transform", "traslate(1.5,0)");
  svgArrayNum[3].attr("transform", "traslate(2,0)");
  svgArrayNum[4].attr("transform", "traslate(0,0)");
  svgArrayNum[5].attr("transform", "traslate(0,0)");
  svgArrayNum[6].attr("transform", "traslate(0,0)");
  svgArrayNum[7].attr("transform", "traslate(0,0)");
  svgArrayNum[8].attr("transform", "traslate(0,0)");
  svgArrayNum[9].attr("transform", "traslate(-2,0)");
  svgArrayNum[10].attr("transform", "traslate(3,1)");
  svgArrayNum[11].attr("transform", "traslate(0,1)");
  svgArrayNum[12].attr("transform", "traslate(0,0)");
  // <時鐘指針動畫>
  let oTime = {
    hourAngle: 0, //時數指針角度
    minuteAngle: 0, //分數指針角度
    secondAngle: 0, //秒數指針角度
  };
  // 載入畫面時立即更新指針角度
  drawNowTime();
  // 時鐘動畫定時器
  let drawClockTimer = setInterval(drawNowTime, 1000);
  // 畫現在時間於時鐘
  function drawNowTime() {
    //清空Date物件，重新取得當前時間
    let oNowTime = new Date();
    //取得當前時分秒轉換為合比例指針角度
    oTime.hourAngle = oNowTime.getHours() * 30 + (oNowTime.getMinutes() / 60) * 30;
    oTime.minuteAngle = oNowTime.getMinutes() * 6 + (oNowTime.getSeconds() / 60) * 6;
    oTime.secondAngle = oNowTime.getSeconds() * 6;
    //寫入角度
    svgHourPointer.attr({
      transform: "rotate(" + oTime.hourAngle + ",0,0)",
    });
    svgMinutePointer.attr({
      transform: "rotate(" + oTime.minuteAngle + ",0,0)",
    });
    svgSecondPointer.attr({
      transform: "rotate(" + oTime.secondAngle + ",0,0)",
    });
  }
  // <蕃茄鐘功能>
  const $backgroundRest = $("#backgroundRest");
  const $goTomato = $("#goTomato");
  const $stopTomato = $("#stopTomato");
  const $resetTomato = $("#resetTomato");
  const $bar1 = $("#bar1");
  const $bar2 = $("#bar2");
  const $displayValue1_1 = $bar1.find(".valueBox>.displayValue");
  const $displayValue2_1 = $bar2.find(".valueBox>.displayValue:first-child");
  const $displayValue2_2 = $bar2.find(".valueBox>.displayValue:last-child");
  const $slider1 = $bar1.children(".slider");
  const $slider2 = $bar2.children(".slider");
  const $minutesLeft = $("#countDownText>.minutesLeft");
  const $secondsLeft = $("#countDownText>.secondsLeft");
  // 定義蕃茄物件
  const tomato = {
    // 工作時間與休息時間(分鐘)
    workTime: 25,
    restTime: 5,
    // 顏色管理
    workTimeColor: "rgb(255, 182, 193)",
    restTimeColor: "rgb(135, 206, 250)",
    // 倒數計時器
    countDownTimer: null,
    // 工作&休息的結束時間(毫秒)
    workEndTime: 0,
    restEndTime: 0,
    endTime: 0,
    // 扇形
    sectorWork: null,
    sectorRest: null,
  };
  // <蕃茄吧按鈕>
  $goTomato.on("click", goTomato);
  // 開始每一顆新的蕃茄
  function goTomato() {
    // 剛載入畫面時，如果使用者太快點擊，會導致oTime.minuteAngle值為undefined，return重點擊
    if (!oTime.minuteAngle) {
      return;
    }
    // <啟動倒數計時器>
    tomato.countDownTimer = setInterval(countDown, 1000);
    // 計算工作&休息的結束時間，儲存至tomato物件
    tomato.workEndTime = Date.now() + tomato.workTime * 60 * 1000;
    tomato.restEndTime = tomato.workEndTime + tomato.restTime * 60 * 1000;
    // 將倒數用的endTime設定為算好的工作結束時間
    tomato.endTime = tomato.workEndTime;
    // 顯示設定好的時間(並格式化為2位數字)於數位顯示區
    $minutesLeft.html(formatDigits(tomato.workTime, 2));
    $secondsLeft.html("00");
    // <畫扇形>
    // 清除上一次畫的扇形
    if (tomato.sectorWork && tomato.sectorRest) {
      tomato.sectorWork.remove();
      tomato.sectorRest.remove();
    }
    // 產生扇形的d字串
    let pathStringWork = makeSector(tomato.workTime, 80, 0, 0);
    let pathStringRest = makeSector(tomato.restTime, 80, 0, 0);
    // 繪出
    tomato.sectorWork = oSVG.path(pathStringWork);
    tomato.sectorRest = oSVG.path(pathStringRest);
    // 畫在最底層
    tomato.sectorWork.insertAfter(clockBackground);
    tomato.sectorRest.insertAfter(clockBackground);
    // 設定扇形外觀、以當前時間旋轉角度
    tomato.sectorWork.attr({
      transform: "rotate(" + (-90 + oTime.minuteAngle) + ")",
      fill: tomato.workTimeColor,
      strokeWidth: 0.05,
      stroke: "#bbb",
    });
    tomato.sectorRest.attr({
      transform: "rotate(" + (-90 + oTime.minuteAngle + tomato.workTime * 6) + ")",
      fill: tomato.restTimeColor,
      strokeWidth: 0.05,
      stroke: "#bbb",
    });
    // <禁用按鈕> 蕃茄吧、重設、兩個slider
    $goTomato.toggleClass("disabled", true);
    $resetTomato.toggleClass("disabled", true);
    $slider1.attr("disabled", "disabled");
    $slider2.attr("disabled", "disabled");
    // <恢復按鈕> 停止
    $stopTomato.toggleClass("disabled", false);
    // 換背景色
    $backgroundRest.fadeOut(1000);
  }
  // 產生扇形路徑的function
  function makeSector(timeLength, r, Cx, Cy) {
    let largeArcFlag = timeLength > 30 ? 1 : 0;
    let arcEndX = r * Snap.cos(timeLength * 6);
    let arcEndY = r * Snap.sin(timeLength * 6);
    let pathString = "M" + Cx + "," + Cy + "h" + r + "A" + r + "," + r + "," + 0 + "," + largeArcFlag + "," + 1 + "," + arcEndX + "," + arcEndY + "Z";
    return pathString;
  }
  // 倒數計時的function
  function countDown() {
    // 計算剩餘秒數
    let remainingSeconds = (tomato.endTime - Date.now()) / 1000;
    remainingSeconds = Math.round(remainingSeconds);
    // 轉換並顯示在數位顯示區
    $minutesLeft.html(formatDigits(Math.floor(remainingSeconds / 60), 2));
    $secondsLeft.html(formatDigits(remainingSeconds % 60, 2));
    // 檢查倒數時間是否結束
    if (remainingSeconds <= 0) {
      // 結束計時器
      clearInterval(tomato.countDownTimer);
      // 提醒音效
      if ($soundSwitch.attr("checked") == "checked") {
        soundEffect.play();
      }
      switch (tomato.endTime) {
        case tomato.workEndTime: // 工作時間結束，裝上休息時間繼續倒數
          tomato.endTime = tomato.restEndTime;
          // 重啟計時器
          tomato.countDownTimer = setInterval(countDown, 1000);
          // 換背景色
          $backgroundRest.fadeIn(1000);
          break;
        case tomato.restEndTime: // 休息時間結束
          // 重複蕃茄是否開啟
          if ($repeatSwitch.attr("checked") == "checked") {
            goTomato();
          } else {
            stopTomato();
            return;
          }
          break;
        default:
          alert("switch錯誤");
      }
    }
  }
  // 停止按鈕
  $stopTomato.on("click", stopTomato);
  // 停止蕃茄鐘並回到設定狀態
  function stopTomato() {
    // 移除扇形圓餅圖
    if (tomato.sectorWork && tomato.sectorRest) {
      tomato.sectorWork.remove();
      tomato.sectorRest.remove();
    }
    // 停止倒數計時器
    clearInterval(tomato.countDownTimer);
    // <禁用按鈕> 停止
    $stopTomato.toggleClass("disabled", true);
    // <恢復按鈕> 蕃茄吧、重設、兩個slider
    $goTomato.toggleClass("disabled", false);
    $resetTomato.toggleClass("disabled", false);
    $slider1.removeAttr("disabled");
    $slider2.removeAttr("disabled");
    // 數位顯示區歸零
    $minutesLeft.html("00");
    $secondsLeft.html("00");
  }
  // <slider功能>
  fillBar1(null, $bar1);
  fillBar2(null, $bar2);
  updateTimeLength();
  // bar1值變事件
  $bar1.on("input", function () {
    // 限制蕃茄時間最小20m
    $slider1.val($slider1.val() < 20 ? 20 : $slider1.val());
    // 限制休息時間(蕃茄時間 - 工作時間)最小5分鐘
    $slider2.val($slider1.val() - $slider2.val() < 5 ? $slider1.val() - 5 : $slider2.val());
    // 將bar2的max值即時改為bar1設定的值
    $slider2.attr("max", $slider1.val());
    fillBar1(null, $bar1);
    // bar1改值時同步更新bar2底色
    fillBar2(null, $bar2);
    updateTimeLength();
  });
  // bar2值變事件
  $bar2.on("input", function () {
    // 限制工作時間最小5m
    $slider2.val($slider2.val() < 5 ? 5 : $slider2.val());
    // 限制休息時間(蕃茄時間 - 工作時間)最小5分鐘
    $slider2.val($slider1.val() - $slider2.val() < 5 ? $slider1.val() - 5 : $slider2.val());
    fillBar2(null, $bar2);
    updateTimeLength();
  });
  // bar1即時填色
  function fillBar1(e, $this) {
    // 更新底色
    let percentNum = ($slider1.val() - $slider1.attr("min")) / ($slider1.attr("max") - $slider1.attr("min"));
    $this.find(".fill").css("width", (40 - 3) * percentNum + "rem");
  }
  // bar2即時填色
  function fillBar2(e, $this) {
    // 更新底色
    let percentNum = ($slider2.val() - $slider2.attr("min")) / ($slider2.attr("max") - $slider2.attr("min"));
    $this.find(".fill").css("width", (40 - 3) * percentNum + "rem");
  }
  // 即時改變slider上面的顯示值
  function updateTimeLength() {
    // 總蕃茄時間=工作時間+休息時間
    tomato.workTime = $slider2.val(); /* bar2值 */
    tomato.restTime = $slider2.attr("max") - $slider2.val(); /* bar2的max - bar2值 */
    // 更新顯示值
    $displayValue1_1.html($slider1.val());
    $displayValue2_1.html(tomato.workTime);
    $displayValue2_2.html(tomato.restTime);
  }
  // <重設時長>
  $resetTomato.on("click", resetTomato);
  // 重設為預設蕃茄鐘(工作25m休息5m)
  function resetTomato() {
    $slider1.val(30);
    // 先改變bar2上限為預設再改值
    $slider2.attr("max", $slider1.val());
    $slider2.val(25);
    // 重設後即時填色
    fillBar1(null, $bar1);
    fillBar2(null, $bar2);
    // 重設後須即時更新顯示值
    updateTimeLength();
  }
  // <info按鈕>
  const $info_text = $(".info_text");
  $(".info_icon").on("click", toggleInfo);
  $(".back-icon").on("click", toggleInfo);
  function toggleInfo() {
    $info_text.fadeToggle();
  }
  // <雜項功能>
  // 提醒音效(取出的非jQuery物件)
  const soundEffect = $("#soundEffect").get(0);
  // 音效開關監聽
  const $soundSwitch = $("#soundSwitch");
  const $soundSwitchIcon = $("#soundSwitchIcon");
  $soundSwitchIcon.on("click", function () {
    toggleSwitch($soundSwitch, $soundSwitchIcon);
  });
  // 重複蕃茄鐘開關監聽
  const $repeatSwitch = $("#repeatSwitch");
  const $repeatSwitchIcon = $("#repeatSwitchIcon");
  $repeatSwitchIcon.on("click", function () {
    toggleSwitch($repeatSwitch, $repeatSwitchIcon);
  });
  // 預設開啟音效
  toggleSwitch($soundSwitch, $soundSwitchIcon);
  // 切換開關function(checkBox與icon高亮)
  function toggleSwitch($sw, $svgIcon) {
    if ($sw.attr("checked") == "checked") {
      $sw.removeAttr("checked");
      $svgIcon.children("use").removeAttr("fill");
    } else {
      $sw.attr("checked", "checked");
      $svgIcon.children("use").attr("fill", "rgb(255, 251, 42)");
    }
  }
  // 格式化補零
  function formatDigits(num, digits) {
    num = num.toString();
    while (num.length < digits) {
      num = "0" + num;
    }
    return num;
  }
});
