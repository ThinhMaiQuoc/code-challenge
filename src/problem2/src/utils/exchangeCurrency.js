export default function exchangeCurrency(fromCurrency, toCurrency, amount, prices) {
  const rate = prices[toCurrency] / prices[fromCurrency]
  return parseFloat(amount) * rate
}