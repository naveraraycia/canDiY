import '../styles/vendors.scss'
import '../styles/index.scss'

export function renderApp() {
  onLoadEventHandler()
}

const yearElement = document.getElementById('year')

const yearToday = new Date().getFullYear()

yearElement.innerHTML = yearToday