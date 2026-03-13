import './App.css'
import ProductsApp from './Components/ProductsApp'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <ProductsApp />
    </BrowserRouter>
  )
}

export default App
