import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El acrónimo del equipo es obligatorio.' })
  acronym: string;

  @IsInt()
  @IsNotEmpty({ message: 'Debe proporcionar el ID del entrenador del equipo.' })
  coachId: number;

  @IsString()
  @IsOptional()
  shield?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
