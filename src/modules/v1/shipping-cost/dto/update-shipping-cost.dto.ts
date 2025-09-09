import { PartialType } from '@nestjs/swagger';
import { CreateShippingCostDto } from './create-shipping-cost.dto';

export class UpdateShippingCostDto extends PartialType(CreateShippingCostDto) {}
