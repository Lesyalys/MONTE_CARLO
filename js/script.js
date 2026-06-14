/**
 * Задание 2: Вычисление двойного интеграла методом Монте-Карло
 * I = ∬ 1/(x-y)^2 dxdy, x∈[1,2], y∈[3,4]
 */

// Точное значение интеграла
const I_EXACT = Math.log(4 / 3);

// Параметры области интегрирования
const xMin = 1,
  xMax = 2;
const yMin = 3,
  yMax = 4;

// Глобальные данные
let convergenceData = [];
let scatterCtx, convergenceCtx;
let scatterCanvas, convergenceCanvas;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация canvas
  scatterCanvas = document.getElementById("scatterPlot");
  convergenceCanvas = document.getElementById("convergencePlot");
  scatterCtx = scatterCanvas.getContext("2d");
  convergenceCtx = convergenceCanvas.getContext("2d");

  // Установка размеров canvas
  scatterCanvas.width = 450;
  scatterCanvas.height = 450;
  convergenceCanvas.width = 800;
  convergenceCanvas.height = 350;

  // Отрисовка пустой области
  drawEmptyArea();

  // Назначение обработчиков кнопок

  // Запуск демонстрационных расчётов
  initDemo();
});

/**
 * Преобразование координат (x,y) в пиксели на canvas
 */
function toPixel(x, y) {
  const px = ((x - xMin) / (xMax - xMin)) * 450;
  const py = 450 - ((y - yMin) / (yMax - yMin)) * 450;
  return { x: px, y: py };
}

/**
 * Отрисовка пустой области (только границы и сетка)
 */
function drawEmptyArea() {
  scatterCtx.clearRect(0, 0, 450, 450);

  // Фон
  scatterCtx.fillStyle = "#fefefe";
  scatterCtx.fillRect(0, 0, 450, 450);

  // Сетка
  scatterCtx.strokeStyle = "#ccc";
  scatterCtx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const x = xMin + (i / 4) * (xMax - xMin);
    const y = yMin + (i / 4) * (yMax - yMin);
    const p1 = toPixel(x, yMin);
    const p2 = toPixel(x, yMax);
    const p3 = toPixel(xMin, y);
    const p4 = toPixel(xMax, y);

    scatterCtx.beginPath();
    scatterCtx.moveTo(p1.x, p1.y);
    scatterCtx.lineTo(p2.x, p2.y);
    scatterCtx.stroke();

    scatterCtx.beginPath();
    scatterCtx.moveTo(p3.x, p3.y);
    scatterCtx.lineTo(p4.x, p4.y);
    scatterCtx.stroke();
  }

  // Границы области
  scatterCtx.strokeStyle = "#2c3e50";
  scatterCtx.lineWidth = 2;
  const topLeft = toPixel(xMin, yMax);
  const topRight = toPixel(xMax, yMax);
  const bottomLeft = toPixel(xMin, yMin);
  const bottomRight = toPixel(xMax, yMin);

  scatterCtx.beginPath();
  scatterCtx.moveTo(topLeft.x, topLeft.y);
  scatterCtx.lineTo(topRight.x, topRight.y);
  scatterCtx.lineTo(bottomRight.x, bottomRight.y);
  scatterCtx.lineTo(bottomLeft.x, bottomLeft.y);
  scatterCtx.closePath();
  scatterCtx.stroke();

  // Подписи
  scatterCtx.fillStyle = "#2c3e50";
  scatterCtx.font = "11px Times New Roman";
  scatterCtx.fillText("x = 1", toPixel(1, yMin).x - 20, toPixel(1, yMin).y + 5);
  scatterCtx.fillText("x = 2", toPixel(2, yMin).x + 5, toPixel(2, yMin).y + 5);
  scatterCtx.fillText("y = 3", toPixel(xMin, 3).x - 25, toPixel(xMin, 3).y + 5);
  scatterCtx.fillText("y = 4", toPixel(xMin, 4).x - 25, toPixel(xMin, 4).y - 5);
}

/**
 * Отрисовка случайных точек на области
 */
function drawPoints(points) {
  drawEmptyArea();

  for (let p of points) {
    const { x, y } = toPixel(p.x, p.y);
    scatterCtx.beginPath();
    scatterCtx.fillStyle = "rgba(220, 53, 69, 0.6)";
    scatterCtx.arc(x, y, 2.5, 0, 2 * Math.PI);
    scatterCtx.fill();
    scatterCtx.fillStyle = "#dc3545";
    scatterCtx.arc(x, y, 1.5, 0, 2 * Math.PI);
    scatterCtx.fill();
  }

  scatterCtx.fillStyle = "#2c3e50";
  scatterCtx.font = "10px Times New Roman";
  scatterCtx.fillText(`Всего точек: ${points.length}`, 350, 440);
}

/**
 * Генерация случайных точек в области D
 */
function generateRandomPoints(N) {
  const points = [];
  for (let i = 0; i < N; i++) {
    points.push({
      x: xMin + Math.random() * (xMax - xMin),
      y: yMin + Math.random() * (yMax - yMin),
    });
  }
  return points;
}

/**
 * Вычисление интеграла методом Монте-Карло
 */
function computeIntegral(points) {
  let sum = 0;
  for (let p of points) {
    sum += 1 / Math.pow(p.x - p.y, 2);
  }
  return sum / points.length;
}

/**
 * Обновление панели статистики
 */
function updateStats(N, I_MC, error, relativeError) {
  const statsDiv = document.getElementById("statsContent");
  let errorClass = "";
  if (relativeError < 5) errorClass = "error-small";
  else if (relativeError < 15) errorClass = "error-medium";
  else errorClass = "error-large";

  statsDiv.innerHTML = `
        <p><strong>Параметры расчёта:</strong></p>
        <p>Количество точек: <strong>${N.toLocaleString()}</strong></p>
        <p>Случайная выборка: равномерная</p>
        <hr>
        <p><strong>Результаты:</strong></p>
        <p class="exact">Точное значение: <strong>${I_EXACT.toFixed(8)}</strong></p>
        <p class="mc-value">Монте-Карло: <strong>${I_MC.toFixed(8)}</strong></p>
        <p>Абсолютная ошибка: <strong>${error.toFixed(8)}</strong></p>
        <p>Относительная ошибка: 
            <span class="error-badge ${errorClass}">${relativeError.toFixed(4)}%</span>
        </p>
        <hr>
        <p><strong>Формула:</strong></p>
        <p style="font-size: 11px;">I ≈ (1/N) · Σ 1/(x_i - y_i)²</p>
        <p style="font-size: 10px; color: #888;">Площадь области = 1</p>
    `;
}

/**
 * Отрисовка графика сходимости
 */
function drawConvergencePlot() {
  if (convergenceData.length === 0) return;

  const width = 800,
    height = 350;
  const padding = { left: 60, right: 30, top: 30, bottom: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  convergenceCtx.clearRect(0, 0, width, height);
  convergenceCtx.fillStyle = "#fefefe";
  convergenceCtx.fillRect(0, 0, width, height);

  // Оси
  convergenceCtx.beginPath();
  convergenceCtx.strokeStyle = "#2c3e50";
  convergenceCtx.lineWidth = 1;
  convergenceCtx.moveTo(padding.left, padding.top);
  convergenceCtx.lineTo(padding.left, height - padding.bottom);
  convergenceCtx.lineTo(width - padding.right, height - padding.bottom);
  convergenceCtx.stroke();

  // Подписи
  convergenceCtx.fillStyle = "#2c3e50";
  convergenceCtx.font = "11px Times New Roman";
  convergenceCtx.fillText(
    "Количество испытаний N",
    width / 2 - 80,
    height - 12,
  );
  convergenceCtx.save();
  convergenceCtx.translate(20, height / 2);
  convergenceCtx.rotate(-Math.PI / 2);
  convergenceCtx.fillText("Абсолютная ошибка", -40, 0);
  convergenceCtx.restore();

  if (convergenceData.length < 2) return;

  const Ns = convergenceData.map((d) => d.N);
  const errors = convergenceData.map((d) => d.error);
  const minN = Math.min(...Ns);
  const maxN = Math.max(...Ns);
  const minError = Math.min(...errors.filter((e) => e > 0));
  const maxError = Math.max(...errors);

  function logX(N) {
    return (
      padding.left +
      ((Math.log10(N) - Math.log10(minN)) /
        (Math.log10(maxN) - Math.log10(minN))) *
        plotWidth
    );
  }

  function logY(error) {
    if (error <= 0) return height - padding.bottom;
    return (
      height -
      padding.bottom -
      ((Math.log10(error) - Math.log10(minError)) /
        (Math.log10(maxError) - Math.log10(minError))) *
        plotHeight
    );
  }

  // Линия метода Монте-Карло
  convergenceCtx.beginPath();
  convergenceCtx.strokeStyle = "#2c3e50";
  convergenceCtx.fillStyle = "#2c3e50";
  convergenceCtx.lineWidth = 1.5;

  for (let i = 0; i < convergenceData.length; i++) {
    const x = logX(convergenceData[i].N);
    const y = logY(convergenceData[i].error);
    if (i === 0) convergenceCtx.moveTo(x, y);
    else convergenceCtx.lineTo(x, y);
    convergenceCtx.fillRect(x - 2, y - 2, 4, 4);
  }
  convergenceCtx.stroke();

  // Теоретическая зависимость ~ 1/√N
  const lastPoint = convergenceData[convergenceData.length - 1];
  const theoConst = lastPoint.error * Math.sqrt(lastPoint.N);

  convergenceCtx.beginPath();
  convergenceCtx.strokeStyle = "#999";
  convergenceCtx.setLineDash([4, 4]);
  convergenceCtx.lineWidth = 1;

  for (let i = 0; i <= 100; i++) {
    const N = minN * Math.pow(maxN / minN, i / 100);
    const theoretical = theoConst / Math.sqrt(N);
    const x = logX(N);
    const y = logY(theoretical);
    if (i === 0) convergenceCtx.moveTo(x, y);
    else convergenceCtx.lineTo(x, y);
  }
  convergenceCtx.stroke();
  convergenceCtx.setLineDash([]);

  // Легенда
  convergenceCtx.fillStyle = "#2c3e50";
  convergenceCtx.fillRect(width - 140, 35, 10, 10);
  convergenceCtx.fillStyle = "#2c3e50";
  convergenceCtx.fillText("Монте-Карло", width - 125, 44);

  convergenceCtx.fillStyle = "#999";
  convergenceCtx.fillRect(width - 140, 55, 10, 10);
  convergenceCtx.fillStyle = "#2c3e50";
  convergenceCtx.fillText("∼ 1/√N", width - 125, 64);
}

/**
 * Добавление точки в данные сходимости
 */
function addConvergencePoint(N, I_MC, error) {
  convergenceData.push({ N, I_MC, error });
  convergenceData.sort((a, b) => a.N - b.N);
  drawConvergencePlot();
}

/**
 * Очистка всех данных
 */
function clearAll() {
  drawEmptyArea();
  document.getElementById("statsContent").innerHTML =
    '<p>Нажмите "Запустить расчёт" для начала</p>';
  convergenceData = [];
  drawConvergencePlot();
}

/**
 * Основная функция расчёта
 */
async function runCalculation() {
  const N = parseInt(document.getElementById("nPoints").value);
  const vizCount = parseInt(document.getElementById("vizPoints").value);

  if (isNaN(N) || N < 1) {
    alert("Введите корректное количество точек");
    return;
  }

  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  progressBar.style.display = "block";

  // Визуализация
  progressFill.style.width = "20%";
  const vizPoints = generateRandomPoints(Math.min(vizCount, N));
  drawPoints(vizPoints);

  progressFill.style.width = "50%";
  await new Promise((resolve) => setTimeout(resolve, 30));

  // Расчёт
  const allPoints = generateRandomPoints(N);
  progressFill.style.width = "75%";

  const I_MC = computeIntegral(allPoints);
  const error = Math.abs(I_MC - I_EXACT);
  const relativeError = (error / I_EXACT) * 100;

  progressFill.style.width = "100%";

  updateStats(N, I_MC, error, relativeError);
  addConvergencePoint(N, I_MC, error);

  setTimeout(() => {
    progressBar.style.display = "none";
    progressFill.style.width = "0%";
  }, 800);

  console.log(`N = ${N}: I = ${I_MC.toFixed(8)}, error = ${error.toFixed(8)}`);
}

/**
 * Демонстрационные расчёты для отображения сходимости
 */
async function initDemo() {
  const demoNs = [100, 500, 1000, 5000, 10000];
  for (let N of demoNs) {
    const points = generateRandomPoints(N);
    const I_MC = computeIntegral(points);
    const error = Math.abs(I_MC - I_EXACT);
    addConvergencePoint(N, I_MC, error);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
