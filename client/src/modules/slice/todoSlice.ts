import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchFromApiServer from '../../services/index';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  const res = await fetchFromApiServer('GET', '/api/tasks');
  // Normalize backend response: support either raw array or { data: [...] }
  return (res.data && res.data.data) ? res.data.data : res.data;
});

export const createTask = createAsyncThunk('tasks/create', async (payload: { title: string; description?: string; priority?: string }) => {
  const res = await fetchFromApiServer('POST', '/api/tasks', payload);
  return (res.data && res.data.data) ? res.data.data : res.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }: { id: string; data: any }) => {
  const res = await fetchFromApiServer('PATCH', `/api/tasks/${id}`, data);
  return (res.data && res.data.data) ? res.data.data : res.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
  await fetchFromApiServer('DELETE', `/api/tasks/${id}`);
  return id;
});

interface TasksState {
  items: Task[];
  loading: boolean;
  error?: string | null;
}

const initialState: TasksState = { items: [], loading: false, error: null };

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Error fetching'; })

      .addCase(createTask.pending, state => { state.loading = true; })
      .addCase(createTask.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createTask.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(updateTask.pending, state => { state.loading = true; })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(deleteTask.pending, state => { state.loading = true; })
      .addCase(deleteTask.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter(t => t._id !== action.payload); })
      .addCase(deleteTask.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export default slice.reducer;
