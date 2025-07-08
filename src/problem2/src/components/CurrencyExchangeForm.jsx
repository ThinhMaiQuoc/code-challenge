import { useState, useEffect } from 'react'
import exchangeCurrency from '../utils/exchangeCurrency'

const loaders = import.meta.glob('../../node_modules/token-icons/tokens/*.svg')

function LazyIcon({ currency }) {
  const [src, setSrc] = useState(null)
  useEffect(() => {
    if (currency) {
      const key = Object.keys(loaders).find(path => path.endsWith(`/${currency}.svg`))
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
    if (!fromCurrency || !toCurrency || !amount || isNaN(amount)) {
      setError('Please select currencies and enter a valid amount.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const exchanged = exchangeCurrency(fromCurrency, toCurrency, amount, prices).toFixed(6)
      setResult(exchanged)
      setExchangedTo(toCurrency)
      setLoading(false)
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="exchange-form">
      <h2>Currency Exchange</h2>
      {error && <p className="error">{error}</p>}

      <div className="field">
        <label htmlFor="fromCurrency">From:</label>
        <LazyIcon currency={fromCurrency} />
        <select id="fromCurrency" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
          <option value="">-- select currency --</option>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="toCurrency">To:</label>
        <LazyIcon currency={toCurrency} />
        <select id="toCurrency" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
          <option value="">-- select currency --</option>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount:</label>
        <input id="amount" type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
      </div>

      <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Exchange'}</button>

      {result && <p className="result">Result: {result} {exchangedTo}</p>}
    </form>
  )
}