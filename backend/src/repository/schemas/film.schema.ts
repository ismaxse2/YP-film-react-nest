import { Schema } from 'mongoose';

export interface ScheduleEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntity[];
}

const ScheduleSchema = new Schema<ScheduleEntity>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  {
    _id: false,
  },
);

export const FilmSchema = new Schema<FilmEntity>(
  {
    id: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: [ScheduleSchema], required: true },
  },
  {
    collection: 'films',
    versionKey: false,
  },
);
