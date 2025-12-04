import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import ProgressBar from './components/loaders/ProgressBar'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import BlogDetailPage from './pages/BlogDetailPage'


function App() {
  return (
    <ThemeProvider>
      <ProgressBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

      </Routes>
    </ThemeProvider>
  )
}

export default App
