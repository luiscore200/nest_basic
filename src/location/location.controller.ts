import { Controller, Get, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {} 

  @Get('countries')
  async getAllCountries() {
    return this.locationService.getAllCountries();
  }

  @Get('countries/:countryId/departments')
  async getDepartmentsByCountry(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Query('includeCities', new DefaultValuePipe(false)) includeCities: boolean,
  ) {
    // Convertir el string 'true'/'false' de la query param a booleano
    const includeCitiesBoolean = String(includeCities).toLowerCase() === 'true';
    return this.locationService.getDepartmentsByCountry(countryId, includeCitiesBoolean);
  }

  @Get('departments/:departmentId/cities')
  async getCitiesByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    return this.locationService.getCitiesByDepartment(departmentId);
  }
}
