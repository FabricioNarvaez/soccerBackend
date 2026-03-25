import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt, Min, IsBoolean} from "class-validator";

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsNotEmpty()
  homeTeamId: number;

  @IsInt()
  @IsNotEmpty()
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
