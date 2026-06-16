import { HttpError, PaginatedResponse } from '@bus-booking/common';

import {
  RouteRepository,
  routeRepository,
} from '../repository/route.repository.js';

import {
  CreateRouteInput,
  Route,
  UpdateRouteInput,
} from '../types/route.types.js';

class RouteService {
  constructor(private readonly repository: RouteRepository) {}

  async getRouteById(id: string): Promise<Route> {
    const route = await this.repository.findById(id);

    if (!route) {
      throw new HttpError(404, 'Route not found');
    }

    return route;
  }

  async getAllRoutes(page: number, limit: number): Promise<PaginatedResponse<Route>> {
    return this.repository.findAll(page, limit);
  }

  async createRoute(input: CreateRouteInput): Promise<Route> {
    const source = input.source.trim();
    const destination = input.destination.trim();

    if (!source || !destination) {
      throw new HttpError(400, 'Source and destination are required');
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      throw new HttpError(
        400,
        'Source and destination cannot be the same',
      );
    }

    if (input.distanceKm <= 0) {
      throw new HttpError(400, 'Distance must be greater than 0');
    }

    if (input.durationMinutes <= 0) {
      throw new HttpError(400, 'Duration must be greater than 0');
    }

    const existing = await this.repository.findBySourceAndDestination(
      source,
      destination,
    );

    if (existing) {
      throw new HttpError(409, 'Route already exists');
    }

    return this.repository.create({
      source,
      destination,
      distanceKm: input.distanceKm,
      durationMinutes: input.durationMinutes,
    });
  }

  async updateRoute(
    id: string,
    input: UpdateRouteInput,
  ): Promise<Route> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new HttpError(404, 'Route not found');
    }

    const source = input.source?.trim() ?? existing.source;
    const destination =
      input.destination?.trim() ?? existing.destination;

    if (source.toLowerCase() === destination.toLowerCase()) {
      throw new HttpError(
        400,
        'Source and destination cannot be the same',
      );
    }

    if (
      input.distanceKm !== undefined &&
      input.distanceKm <= 0
    ) {
      throw new HttpError(400, 'Distance must be greater than 0');
    }

    if (
      input.durationMinutes !== undefined &&
      input.durationMinutes <= 0
    ) {
      throw new HttpError(400, 'Duration must be greater than 0');
    }

    const duplicate =
      await this.repository.findBySourceAndDestination(
        source,
        destination,
      );

    if (duplicate && duplicate.id !== id) {
      throw new HttpError(409, 'Another route already exists');
    }

    const updated = await this.repository.update(id, {
      ...input,
      source,
      destination,
    });

    if (!updated) {
      throw new HttpError(404, 'Route not found');
    }

    return updated;
  }

  async deleteRoute(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new HttpError(404, 'Route not found');
    }
  }

  async searchRoutes(query: string, page: number, limit: number): Promise<PaginatedResponse<Route>> {
    const value = query.trim();

    if (!value) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    return this.repository.searchByCity(value, page, limit);
  }

  async getRoutesBySource(source: string): Promise<Route[]> {
    const value = source.trim();

    if (!value) {
      return [];
    }

    return this.repository.findBySource(value);
  }

  async getRoutesByDestination(
    destination: string,
  ): Promise<Route[]> {
    const value = destination.trim();

    if (!value) {
      return [];
    }

    return this.repository.findByDestination(value);
  }

  async getAvailableSources(): Promise<string[]> {
    return this.repository.findDistinctSources();
  }

  async getAvailableDestinations(): Promise<string[]> {
    return this.repository.findDistinctDestinations();
  }
}

export const routeService = new RouteService(routeRepository);