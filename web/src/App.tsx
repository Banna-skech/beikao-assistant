import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Enterprises from './pages/Enterprises'
import Quiz from './pages/Quiz'
import Interview from './pages/Interview'
import Planner from './pages/Planner'
import Pitfalls from './pages/Pitfalls'
import Resources from './pages/Resources'
import Courses from './pages/Courses'
import Loop from './pages/Loop'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/loop" element={<Loop />} />
        <Route path="/enterprises" element={<Enterprises />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/pitfalls" element={<Pitfalls />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Layout>
  )
}
