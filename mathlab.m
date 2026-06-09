clear; clc; close all;

I_exact = log(4/3);
fprintf('Точное значение интеграла: %.8f\n', I_exact);

N_values = [100, 1000, 10000, 100000, 1000000];
errors = zeros(size(N_values));

figure;
hold on;

for k = 1:length(N_values)
    N = N_values(k);
    

    x = 1 + (2-1) * rand(N, 1);  
    y = 3 + (4-3) * rand(N, 1);  
    
  
    f = 1 ./ ((x - y).^2);
    

    I_MC = mean(f);  
    
    error = abs(I_MC - I_exact);
    errors(k) = error;
    
    fprintf('N = %8d: I = %.8f, Ошибка = %.8f\n', N, I_MC, error);
end

% График сходимости
figure;
loglog(N_values, errors, 'bo-', 'LineWidth', 2, 'MarkerSize', 8);
xlabel('Количество испытаний N', 'FontSize', 12);
ylabel('Абсолютная ошибка', 'FontSize', 12);
title('Задание 2: Сходимость метода Монте-Карло', 'FontSize', 14);
grid on;

hold on;
theoretical = errors(end) * sqrt(N_values(end) ./ N_values);
loglog(N_values, theoretical, 'r--', 'LineWidth', 1.5);
legend('Монте-Карло', '∼ 1/√N', 'Location', 'southwest');


fprintf('\n=== РЕЗУЛЬТАТ ===\n');
fprintf('Точное значение:      %.8f\n', I_exact);
fprintf('Монте-Карло (N=10^6): %.8f\n', I_MC);
fprintf('Абсолютная ошибка:     %.8f\n', errors(end));
fprintf('Относительная ошибка:  %.2f%%\n', errors(end)/I_exact*100);