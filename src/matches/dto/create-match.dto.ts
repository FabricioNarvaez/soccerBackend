import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt, Min, IsBoolean} from "class-validator";

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty({ message: 'La fecha del partido es obligatoria.' })
  date: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del equipo local es obligatorio.' })
  homeTeamId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del equipo visitante es obligatorio.' })
  awayTeamId: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  homeGoals?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  awayGoals?: number;

  @IsBoolean()
  @IsOptional()
  isFinished?: boolean;
}
