import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  homeGoals?: number;
  awayGoals?: number;
  isFinished?: boolean;
  homeScorers?: number[];
  awayScorers?: number[];
}
