import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDto {
  @IsUUID()
  id!: string;

  @IsString()
  daytime!: string;

  @IsInt()
  hall!: number;

  @IsInt()
  rows!: number;

  @IsInt()
  seats!: number;

  @IsNumber()
  price!: number;

  @IsArray()
  @IsString({ each: true })
  taken!: string[];
}

export class FilmDto {
  @IsUUID()
  id!: string;

  @IsNumber()
  rating!: number;

  @IsString()
  director!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  title!: string;

  @IsString()
  about!: string;

  @IsString()
  description!: string;

  @IsString()
  image!: string;

  @IsString()
  cover!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule!: ScheduleDto[];
}

export class FilmsResponseDto {
  @IsInt()
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilmDto)
  items!: FilmDto[];
}

export class FilmScheduleResponseDto {
  @IsInt()
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  items!: ScheduleDto[];
}
