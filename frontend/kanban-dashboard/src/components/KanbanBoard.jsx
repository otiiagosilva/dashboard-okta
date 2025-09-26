import { useState } from 'react'
import { API_CONFIG, apiRequest } from '../config/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Edit, Trash2, Calendar, User } from 'lucide-react'
import statusTodoIcon from '../assets/status_todo.png'
import statusInProgressIcon from '../assets/status_in_progress.png'
import statusDoneIcon from '../assets/status_done.png'
import priorityHighIcon from '../assets/priority_high.png'
import priorityMediumIcon from '../assets/priority_medium.png'
import priorityLowIcon from '../assets/priority_low.png'

const KanbanBoard = ({ tasks, onTaskEdit, onTaskDeleted, onTaskMoved }) => {
  const [draggedTask, setDraggedTask] = useState(null)

  const columns = [
    { 
      id: 'todo', 
      title: 'A Fazer', 
      icon: statusTodoIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-700'
    },
    { 
      id: 'in_progress', 
      title: 'Em Progresso', 
      icon: statusInProgressIcon,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      titleColor: 'text-purple-700'
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      icon: statusDoneIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-700'
    }
  ]

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta': return priorityHighIcon
      case 'media': return priorityMediumIcon
      case 'baixa': return priorityLowIcon
      default: return priorityMediumIcon
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'baixa': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS}/${draggedTask.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...draggedTask,
          status: newStatus
        }),
      })

      onTaskMoved()
    } catch (err) {
      console.error('Erro ao mover tarefa:', err)
    }

    setDraggedTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return
    }

    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS}/${taskId}`, {
        method: 'DELETE',
      })

      onTaskDeleted()
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err)
    }
  }



  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id)
        
        return (
          <div
            key={column.id}
            className={`${column.bgColor} ${column.borderColor} border-2 border-dashed rounded-lg p-4 min-h-[600px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <img src={column.icon} alt={column.title} className="w-6 h-6" />
              <h3 className={`font-semibold text-lg ${column.titleColor}`}>
                {column.title}
              </h3>
              <Badge variant="secondary" className="ml-auto">
                {columnTasks.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move hover:shadow-md transition-shadow bg-white"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {task.title}
                      </CardTitle>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskEdit(task)}
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <img 
                          src={getPriorityIcon(task.priority)} 
                          alt={task.priority} 
                          className="w-3 h-3" 
                        />
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-gray-100">
                              {task.assignee.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    
                    {task.due_date && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard

