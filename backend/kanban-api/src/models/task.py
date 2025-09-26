from datetime import datetime
from src.models.user import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.String(20), nullable=False, default='media')  # alta, media, baixa
    status = db.Column(db.String(20), nullable=False, default='todo')  # todo, in_progress, done
    position = db.Column(db.Integer, default=0)  # Para ordenação no kanban
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f'<Task {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'position': self.position,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by': self.created_by,
            'assigned_to': self.assigned_to,
            'creator': self.creator.to_dict() if self.creator else None,
            'assignee': self.assignee.to_dict() if self.assignee else None
        }

