import { Router } from 'express';
import {
  createResource,
  listResources,
  getResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController';
import validate from '../utils/validate';

const router = Router();

router.post('/', validate.createResource, createResource);
router.get('/', listResources);
router.get('/:id', validate.idParam, getResource);
router.put('/:id', validate.idParam, validate.updateResource, updateResource);
router.delete('/:id', validate.idParam, deleteResource);

export default router;