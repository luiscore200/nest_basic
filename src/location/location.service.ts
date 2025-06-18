import { Injectable, NotFoundException } from '@nestjs/common';
import { PercistenceService } from 'src/common/services/percistence/percistence.service';
import { Country, Department, City } from '@prisma/client'; // Importar tipos de Prisma si es necesario, aunque usaremos los de PercistenceService

// Definir interfaces locales si PercistenceService no exporta las suyas
export interface PercistenceCity {
  id: number;
  name: string;
  departmentId: number;
}

export interface PercistenceDepartment {
  id: number;
  name: string;
  countryId: number;
  cities: PercistenceCity[];
}

export interface PercistenceCountry {
  id: number;
  name: string;
  departments: PercistenceDepartment[];
}


@Injectable()
export class LocationService {

  constructor(
    private percistenceService: PercistenceService
  ) {}

  async getAllCountries(): Promise<PercistenceCountry[]> {
    const countries = await this.percistenceService.getCountries();
    // Devolver solo los países sin departamentos anidados si no se necesitan
    return countries.map(country => ({
      id: country.id,
      name: country.name,
      departments: [] // Vacío para no incluir departamentos por defecto
    }));
  }

  async getDepartmentsByCountry(countryId: number, includeCities = false): Promise<PercistenceDepartment[]> {
    const countries = await this.percistenceService.getCountries();
    const country = countries.find(c => c.id === countryId);

    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    if (includeCities) {
      return country.departments;
    } else {
      // Devolver departamentos sin ciudades anidadas si includeCities es false
      return country.departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        countryId: dept.countryId,
        cities: [] // Vacío para no incluir ciudades
      }));
    }
  }

  async getCitiesByDepartment(departmentId: number): Promise<PercistenceCity[]> {
    const countries = await this.percistenceService.getCountries();
    // Buscar el departamento en todos los países
    let department: PercistenceDepartment | undefined;
    for (const country of countries) {
      department = country.departments.find(d => d.id === departmentId);
      if (department) {
        break;
      }
    }

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return department.cities;
  }
}
