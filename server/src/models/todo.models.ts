import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    priority: {
      type: String,
      required: true,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);

export const TaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export const TaskUpdateSchema = TaskCreateSchema.partial();