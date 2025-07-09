import { Request, Response, NextFunction } from 'express';

export default {
  createResource(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name) {
      return res.status(400).json({ error: 'BadRequest', message: 'Name is required' });
    }
    next();
  },
  updateResource(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name && !req.body.value) {
      return res.status(400).json({ error: 'BadRequest', message: 'Nothing to update' });
    }
    next();
  },
  idParam(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'BadRequest', message: 'Invalid ID parameter' });
    }
    next();
  }
};