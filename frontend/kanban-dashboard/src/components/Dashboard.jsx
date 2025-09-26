import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Plus, BarChart3 } from 'lucide-react'
import KanbanBoard from './KanbanBoard'
import TaskModal from './TaskModal'
import userProfileIcon from '../assets/user_profile.png'
import { API_CONFIG, apiRequest } from '../config/api'

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ todo: 0, in_progress: 0, done: 0, total: 0 })
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.TASKS)
      setTasks(data)
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.TASKS_STATS)
      setStats(data)
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleTaskSaved = () => {
    fetchTasks()
    fetchStats()
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleTaskDeleted = () => {
    fetchTasks()
    fetchStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <img src={userProfileIcon} alt="Dashboard" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard Kanban</h1>
                <p className="text-sm text-gray-500">Gerencie suas tarefas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">A Fazer</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
              <p className="text-xs text-muted-foreground">tarefas pendentes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.in_progress}</div>
              <p className="text-xs text-muted-foreground">em andamento</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluído</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
              <p className="text-xs text-muted-foreground">finalizadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">todas as tarefas</p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <KanbanBoard 
          tasks={tasks} 
          onTaskEdit={handleEditTask}
          onTaskDeleted={handleTaskDeleted}
          onTaskMoved={fetchTasks}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  )
}

export default Dashboard

