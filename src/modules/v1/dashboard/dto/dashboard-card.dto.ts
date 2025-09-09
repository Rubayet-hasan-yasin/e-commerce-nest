import { ApiProperty } from '@nestjs/swagger';

export class DashboardCardDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  value: string;
}
