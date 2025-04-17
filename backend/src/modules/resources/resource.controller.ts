import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResourceModel from './resource.model';
import { ResourceCreateDTO, ResourceUpdateDTO } from '@common/types/resource';
import { getPreview } from '../../utils/link-preview';
import { AppError } from '../../middleware/error.middleware';

// Get all resources with filtering
export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resources = await ResourceModel.find();

    res.status(StatusCodes.OK).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// Get single resource by ID
export const getResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await ResourceModel.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// Create new resource
export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resourceData: ResourceCreateDTO = req.body;

    const resource = await ResourceModel.create({
      ...resourceData,
      rating: 0,
      votes: 0,
      dateAdded: new Date().toISOString(),
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// Update resource
export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData: ResourceUpdateDTO = req.body;

    const resource = await ResourceModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// Delete resource
export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await ResourceModel.findByIdAndDelete(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Prefetch resource URL
export const preFetchResourceUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url } = req.query as { url: string };

    if (!url) {
      throw new AppError('URL is required', StatusCodes.BAD_REQUEST);
    }

    const data = await getPreview(url);

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
