function sum_to_n_a(n: number): number {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
} // O(n)

function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
} //O(1)

function sum_to_n_c(n: number): number {
  if (n <= 1)
    return n;

  const mid = Math.floor(n / 2);
  const left = sum_to_n_c(mid);
  const right = ((n * (n + 1)) / 2) - left;

  return left + right;
} //O(log n)