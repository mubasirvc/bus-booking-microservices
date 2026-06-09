import { Op } from 'sequelize';

import { RouteModel } from '../model/route.model.js';
import { CreateRouteInput, Route, UpdateRouteInput } from '../types/route.types.js';
import { PaginatedResponse } from '@bus-booking/common';

const toDomainRoute = (model: RouteModel): Route => ({
  id: model.id,
  source: model.source,
  destination: model.destination,
  distanceKm: model.distanceKm,
  durationMinutes: model.durationMinutes,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class RouteRepository {
  async findById(id: string): Promise<Route | null> {
    const route = await RouteModel.findByPk(id);
    return route ? toDomainRoute(route) : null;
  }

  async findAll(page: number, limit: number): Promise<PaginatedResponse<Route>> {
    const offset = (page - 1) * limit;

    const result = await RouteModel.findAndCountAll({
      order: [
        ['source', 'ASC'],
        ['destination', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: result.rows.map(toDomainRoute),
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async create(data: CreateRouteInput): Promise<Route> {
    const route = await RouteModel.create(data);
    return toDomainRoute(route);
  }

  async update(id: string, data: UpdateRouteInput): Promise<Route | null> {
    const route = await RouteModel.findByPk(id);

    if (!route) {
      return null;
    }

    await route.update(data);

    return toDomainRoute(route);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await RouteModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await RouteModel.count({
      where: { id },
    });

    return count > 0;
  }

  async findBySourceAndDestination(source: string, destination: string): Promise<Route | null> {
    const route = await RouteModel.findOne({
      where: {
        source: { [Op.iLike]: source.trim() },
        destination: { [Op.iLike]: destination.trim() },
      },
    });

    return route ? toDomainRoute(route) : null;
  }

  async findBySource(source: string): Promise<Route[]> {
    const routes = await RouteModel.findAll({
      where: {
        source: {
          [Op.iLike]: `%${source.trim()}%`,
        },
      },
      order: [['destination', 'ASC']],
    });

    return routes.map(toDomainRoute);
  }

  async findByDestination(destination: string): Promise<Route[]> {
    const routes = await RouteModel.findAll({
      where: {
        destination: {
          [Op.iLike]: `%${destination.trim()}%`,
        },
      },
      order: [['source', 'ASC']],
    });

    return routes.map(toDomainRoute);
  }

  async searchByCity(
    query: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Route>> {
    const offset = (page - 1) * limit;

    const result = await RouteModel.findAndCountAll({
      where: {
        [Op.or]: [
          {
            source: {
              [Op.iLike]: `%${query.trim()}%`,
            },
          },
          {
            destination: {
              [Op.iLike]: `%${query.trim()}%`,
            },
          },
        ],
      },
      order: [
        ['source', 'ASC'],
        ['destination', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: result.rows.map(toDomainRoute),
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async findDistinctSources(): Promise<string[]> {
    const rows = await RouteModel.findAll({
      attributes: ['source'],
      group: ['source'],
      order: [['source', 'ASC']],
      raw: true,
    });

    return rows.map((row: any) => row.source);
  }

  async findDistinctDestinations(): Promise<string[]> {
    const rows = await RouteModel.findAll({
      attributes: ['destination'],
      group: ['destination'],
      order: [['destination', 'ASC']],
      raw: true,
    });

    return rows.map((row: any) => row.destination);
  }
}

export const routeRepository = new RouteRepository();
