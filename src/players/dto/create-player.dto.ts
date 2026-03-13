import { IsInt, IsNotEmpty, IsString, Min, Max, IsPositive, IsOptional } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del jugador es obligatorio.' })
  name: string;

  @IsInt()
  @IsNotEmpty({ message: 'El número del jugador es obligatorio.' })
  @IsPositive({ message: 'El número del jugador debe ser un número positivo.' })
  @Max(99, { message: 'El número del jugador no puede ser mayor a 99. Si lo requiere, puede ponerse en contacto con el administrador del torneo.' })
  number: number;

  @IsString()
  @IsOptional()
  position?: string;

  @IsInt()
  @IsNotEmpty({ message: 'La edad del jugador es obligatoria.' })
  @Min(16, { message: 'La edad del jugador debe ser al menos 16 años. Si lo requiere, puede ponerse en contacto con el administrador del torneo.' })
  age: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del equipo al que pertenece el jugador es obligatorio.' })
  teamId: number;
}
