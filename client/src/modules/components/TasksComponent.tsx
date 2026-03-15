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

export default function TasksComponent() {
  const dispatch = useAppDispatch();
  const { items: tasks, loading } = useAppSelector(s => s.tasks);
  const list = Array.isArray(tasks) ? tasks : [];

  const [formData, setFormData] = useState<TaskFormData>({ title: '', description: '', priority: 'medium' });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

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
      console.log('Task created');
    } catch (err) { console.error('Create failed', err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await dispatch(deleteTask(id)).unwrap();
      console.log('Task deleted');
    } catch (e) { console.error('Delete failed', e); }
  };

  const handleStatus = async (id: string, status: TaskStatus) => {
    try {
      await dispatch(updateTask({ id, data: { status } })).unwrap();
      console.log('Status updated');
    } catch (e) { console.error('Update failed', e); }
  };

  return (
    <div>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title" />
        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
        <button type="submit">Create</button>
      </form>

      {loading ? <div>Loading...</div> : (
        list.length === 0 ? <div>No tasks</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Title</th><th>Priority</th><th>Status</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{t.title}</td>
                  <td>{t.priority}</td>
                  <td>
                    <select value={t.status} onChange={e => handleStatus(t._id, e.target.value as TaskStatus)}>
                      <option value="todo">todo</option>
                      <option value="in-progress">in-progress</option>
                      <option value="done">done</option>
                    </select>
                  </td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td><button onClick={() => handleDelete(t._id)} style={{ color: 'red' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

