from flask import Blueprint, jsonify, request
from src.models.user import User, db
from src.models.task import Task
from src.routes.user import token_required
from datetime import datetime

task_bp = Blueprint('task', __name__)

@task_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@task_bp.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.json
    
    if not data.get('title'):
        return jsonify({'message': 'Title is required!'}), 400
    
    # Calcular próxima posição na coluna
    max_position = db.session.query(db.func.max(Task.position)).filter_by(
        status=data.get('status', 'todo')
    ).scalar() or 0
    
    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        priority=data.get('priority', 'media'),
        status=data.get('status', 'todo'),
        position=max_position + 1,
        created_by=current_user.id,
        assigned_to=data.get('assigned_to')
    )
    
    if data.get('due_date'):
        try:
            task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        except:
            return jsonify({'message': 'Invalid due_date format!'}), 400
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    old_status = task.status
    new_status = data.get('status', task.status)
    
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.priority = data.get('priority', task.priority)
    task.status = new_status
    task.assigned_to = data.get('assigned_to', task.assigned_to)
    
    if data.get('due_date'):
        try:
            task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        except:
            return jsonify({'message': 'Invalid due_date format!'}), 400
    
    # Se mudou de status, recalcular posição
    if old_status != new_status:
        max_position = db.session.query(db.func.max(Task.position)).filter_by(
            status=new_status
        ).scalar() or 0
        task.position = max_position + 1
    elif 'position' in data:
        task.position = data['position']
    
    db.session.commit()
    return jsonify(task.to_dict())

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

@task_bp.route('/tasks/reorder', methods=['POST'])
@token_required
def reorder_tasks(current_user):
    data = request.json
    
    if not data.get('tasks'):
        return jsonify({'message': 'Tasks array is required!'}), 400
    
    for task_data in data['tasks']:
        task = Task.query.get(task_data['id'])
        if task:
            task.status = task_data.get('status', task.status)
            task.position = task_data.get('position', task.position)
    
    db.session.commit()
    return jsonify({'message': 'Tasks reordered successfully!'})

@task_bp.route('/tasks/by-status/<status>', methods=['GET'])
@token_required
def get_tasks_by_status(current_user, status):
    tasks = Task.query.filter_by(status=status).order_by(Task.position).all()
    return jsonify([task.to_dict() for task in tasks])

@task_bp.route('/tasks/stats', methods=['GET'])
@token_required
def get_task_stats(current_user):
    stats = {
        'todo': Task.query.filter_by(status='todo').count(),
        'in_progress': Task.query.filter_by(status='in_progress').count(),
        'done': Task.query.filter_by(status='done').count(),
        'total': Task.query.count()
    }
    return jsonify(stats)

