import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardCardDto } from './dto/dashboard-card.dto';

@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardCards(): Promise<DashboardCardDto[]> {
    return this.dashboardService.getDashboardData();
  }
}
