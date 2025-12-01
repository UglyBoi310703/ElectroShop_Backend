#!/bin/bash

# Script to create all remaining modules with basic structure

MODULES=(
  "users"
  "categories"
  "brands"
  "specifications"
  "variants"
  "cart"
  "orders"
  "reviews"
  "coupons"
  "upload"
)

echo "Creating all modules..."

for module in "${MODULES[@]}"; do
  echo "Creating $module module..."
  
  # Create module file
  cat > "src/modules/$module/$module.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${module^}Controller } from './${module}.controller';
import { ${module^}Service } from './${module}.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [${module^}Controller],
  providers: [${module^}Service],
  exports: [${module^}Service],
})
export class ${module^}Module {}
EOF

  # Create controller file
  cat > "src/modules/$module/$module.controller.ts" << EOF
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ${module^}Service } from './${module}.service';

@ApiTags('${module^}')
@Controller('$module')
export class ${module^}Controller {
  constructor(private readonly ${module}Service: ${module^}Service) {}
  
  // TODO: Add endpoints
}
EOF

  # Create service file
  cat > "src/modules/$module/$module.service.ts" << EOF
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ${module^}Service {
  // TODO: Inject repositories and implement methods
}
EOF

done

echo "All modules created successfully!"
