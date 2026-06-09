// Задание 2: Вычисление двойного интеграла методом Монте-Карло
// I = ∬ 1/(x-y)^2 dxdy, x∈[1,2], y∈[3,4]

const I_exact = Math.log(4 / 3);
console.log(`Точное значение интеграла: ${I_exact.toFixed(8)}`);
console.log("");

//  метода Монте-Карло
const N_values = [100, 1000, 10000, 100000, 1000000];
const errors = [];
const results = [];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

for (let idx = 0; idx < N_values.length; idx++) {
  const N = N_values[idx];
  let sum = 0;

  for (let i = 0; i < N; i++) {
    const x = rand(1, 2);
    const y = rand(3, 4);
    const value = 1 / Math.pow(x - y, 2);
    sum += value;
  }

  const I_MC = sum / N;
  const error = Math.abs(I_MC - I_exact);

  errors.push(error);
  results.push({ N, I_MC, error });

  console.log(
    `N = ${N.toString().padStart(8)}: I = ${I_MC.toFixed(8)}, Ошибка = ${error.toFixed(8)}`,
  );
}

// Результаты
console.log("\n=== РЕЗУЛЬТАТ ===");
console.log(`Точное значение:      ${I_exact.toFixed(8)}`);
console.log(
  `Монте-Карло (N=10^6): ${results[results.length - 1].I_MC.toFixed(8)}`,
);
console.log(`Абсолютная ошибка:     ${errors[errors.length - 1].toFixed(8)}`);
console.log(
  `Относительная ошибка:  ${((errors[errors.length - 1] / I_exact) * 100).toFixed(2)}%`,
);

//  сходимост (теоретическая зависимость)
console.log("\n=== АНАЛИЗ СХОДИМОСТИ ===");
for (let i = 0; i < N_values.length; i++) {
  const theoretical =
    errors[errors.length - 1] *
    Math.sqrt(N_values[N_values.length - 1] / N_values[i]);
  console.log(
    `N = ${N_values[i]}: Ошибка = ${errors[i].toFixed(8)}, Теоретическая ~ ${theoretical.toFixed(8)}`,
  );
}
