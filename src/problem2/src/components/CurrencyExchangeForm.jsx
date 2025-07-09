import { useState, useEffect } from 'react'
import exchangeCurrency from '../utils/exchangeCurrency'

const loaders = import.meta.glob('../../node_modules/token-icons/tokens/*.svg')

function LazyIcon({ currency }) {
  const [src, setSrc] = useState(null)
  useEffect(() => {
    if (currency) {
      const key = Object.keys(loaders).find(path =>
        path.endsWith(`/${currency}.svg`)
      )
      if (key) {
        loaders[key]().then(module => setSrc(module.default || module))
      } else {
        setSrc(null)
      }
    }
  }, [currency])

  if (!src) return null
  return <img src={src} alt={currency} />
}

export default function CurrencyExchangeForm() {
  const [currencies, setCurrencies] = useState([])
  const [prices, setPrices] = useState({})
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exchangedTo, setExchangedTo] = useState('')

  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then(res => res.json())
      .then(data => {
        const priceMap = {}
        data.forEach(item => {
          priceMap[item.currency] = item.price
        })
        setPrices(priceMap)
        setCurrencies(Object.keys(priceMap))
      })
      .catch(() => setError('Failed to load currency prices'))
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!fromCurrency) {
      setError('Please select a “From” currency.')
      return
    }
    if (!toCurrency) {
      setError('Please select a “To” currency.')
      return
    }
    if (!amount) {
      setError('Please enter an amount to exchange.')
      return
    }
    if (isNaN(amount)) {
      setError('Amount must be a number.')
      return
    }
    if (Number(amount) <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (fromCurrency === toCurrency) {
      setError('Please choose two different currencies.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const exchanged = exchangeCurrency(
        fromCurrency,
        toCurrency,
        amount,
        prices
      ).toFixed(6)
      setResult(exchanged)
      setExchangedTo(toCurrency)
      setLoading(false)
    }, 800)
  }

  const flipCurrencies = () => {
    const oldFrom = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(oldFrom)
  }

  return (
    <form onSubmit={handleSubmit} className="exchange-form">
      <h2>Currency Exchange</h2>
      {error && <p className="error">{error}</p>}

      <div className="field">
        <select
          id="fromCurrency"
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
        >
          <option value="" disabled hidden>-- select currency --</option>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label htmlFor="fromCurrency">From Currency</label>
        <div className="field-icon">
          <LazyIcon currency={fromCurrency} />
        </div>
      </div>

      <div className="swap-flip" onClick={flipCurrencies}>
        ↔️
      </div>

      <div className="field">
        <select
          id="toCurrency"
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
        >
          <option value="" disabled hidden>-- select currency --</option>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label htmlFor="toCurrency">To Currency</label>
        <div className="field-icon">
          <LazyIcon currency={toCurrency} />
        </div>
      </div>

      <div className="field">
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder=" "
        />
        <label htmlFor="amount">Amount</label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Exchanging...' : 'Exchange'}
      </button>

      {result !== null && (
        <p className="result">
          Result: {result} {exchangedTo}
        </p>
      )}
    </form>
  )
}
