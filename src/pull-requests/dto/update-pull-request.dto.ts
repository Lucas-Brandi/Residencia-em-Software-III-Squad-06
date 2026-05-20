import { PartialType } from '@nestjs/swagger';
import { CreatePullRequestDto } from './create-pull-request.dto';

export class UpdatePullRequestDto extends PartialType(CreatePullRequestDto) {}
