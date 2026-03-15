import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchTasks, createTask, updateTask, deleteTask } from '../slice/todoSlice';
import { z } from 'zod';

type TaskStatus = 'todo' | 'in-progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

const TaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type TaskFormData = z.infer<typeof TaskFormSchema>;

import { Card, Button, Input, Select, Badge, Modal, Textarea, TaskSkeleton } from '../../components/UI';

export default function TasksComponent() {
  const dispatch = useAppDispatch();
  const { items: tasks, loading } = useAppSelector(s => s.tasks);
  const list = Array.isArray(tasks) ? tasks : [];

  const [formData, setFormData] = useState<TaskFormData>({ title: '', description: '', priority: 'medium' });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchTasks()).catch(() => {}); }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = TaskFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }

    try {
      await dispatch(createTask(result.data)).unwrap();
      setFormData({ title: '', description: '', priority: 'medium' });
    } catch (err) { console.error('Create failed', err); }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await dispatch(deleteTask(taskToDelete)).unwrap();
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (e) { console.error('Delete failed', e); }
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatus = async (id: string, status: TaskStatus) => {
    try {
      await dispatch(updateTask({ id, data: { status } })).unwrap();
    } catch (e) { console.error('Update failed', e); }
  };

  return (
    <div className="animate-in">
      
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Task"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
      </Modal>

      <Card className="glass" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <form onSubmit={handleCreate} className="task-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              placeholder="What needs to be done?" 
              style={{ fontSize: '1.1rem', fontWeight: 500 }}
            />
            {errors.title && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.title}</span>}
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Add a description (optional)" 
              style={{ fontSize: '0.9rem', opacity: 0.8, minHeight: '60px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
            <Select 
              value={formData.priority} 
              onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              style={{ width: '120px' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Button type="submit" style={{ height: '46px', padding: '0 1.5rem' }}>
              Create
            </Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : (
        list.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <p style={{ fontSize: '1.1rem' }}>No tasks found. Start by creating one above!</p>
          </Card>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {list.map((t, index) => (
              <Card 
                key={t._id} 
                className={`animate-in delay-${(index % 3) + 1} task-card`}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.5 : 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Badge variant={t.priority}>{t.priority}</Badge>
                      <Badge variant={t.status === 'in-progress' ? 'progress' : t.status}>{t.status}</Badge>
                    </div>
                  </div>
                  {t.description && (
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6, textDecoration: t.status === 'done' ? 'line-through' : 'none', wordBreak: 'break-word' }}>
                      {t.description}
                    </p>
                  )}
                  <div style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '0.6rem' }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                  <Select 
                    value={t.status} 
                    onChange={e => handleStatus(t._id, e.target.value as TaskStatus)}
                    style={{ width: '120px', padding: '0.5rem 0.6rem', fontSize: '0.85rem' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">Progress</option>
                    <option value="done">Done</option>
                  </Select>
                  <Button 
                    variant="ghost" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(t._id);
                    }}
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--error)', minWidth: '40px' }}
                    title="Delete Task"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );


}


