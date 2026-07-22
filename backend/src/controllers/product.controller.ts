import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const productController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    sendCreated(res, product, 'Product added successfully.');
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const products = await productService.getAll(search);
    sendSuccess(res, products, 'Products fetched successfully.');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await productService.getById(id);
    sendSuccess(res, product, 'Product fetched successfully.');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await productService.update(id, req.body);
    sendSuccess(res, product, 'Product updated successfully.');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await productService.delete(id);
    sendNoContent(res);
  }),
};
export default productController;
