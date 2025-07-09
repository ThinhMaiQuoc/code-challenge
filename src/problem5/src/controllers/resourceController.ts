import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resourceService';

export async function createResource(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await resourceService.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function listResources(req: Request, res: Response, next: NextFunction) {
  try {
    const resources = await resourceService.list(req.query);
    res.json(resources);
  } catch (err) {
    next(err);
  }
}

export async function getResource(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await resourceService.getById(+req.params.id);
    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function updateResource(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await resourceService.update(+req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req: Request, res: Response, next: NextFunction) {
  try {
    await resourceService.remove(+req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}