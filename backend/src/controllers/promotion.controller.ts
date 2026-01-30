import { Request, Response } from 'express';
import { Promotion } from '../models/Promotion';

export const getPromotionByApartmentId = async (req: Request, res: Response) => {
  try {
    const { apartmentId } = req.params;
    const promotion = await Promotion.findOne({ apartmentId: Number(apartmentId) }).lean();
    
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    
    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch promotion', details: (error as any).message });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { apartmentId } = req.params;
    const updateData = req.body;

    const promotion = await Promotion.findOneAndUpdate(
      { apartmentId: Number(apartmentId) },
      updateData,
      { new: true, upsert: true }
    ).lean();

    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update promotion', details: (error as any).message });
  }
};

export const getPromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id).lean();
    
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    
    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch promotion', details: (error as any).message });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotionData = req.body;
    
    const promotion = new Promotion(promotionData);
    await promotion.save();
    
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create promotion', details: (error as any).message });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const promotion = await Promotion.findByIdAndDelete(id);
    
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    
    res.json({ success: true, message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete promotion', details: (error as any).message });
  }
};

export default { getPromotionByApartmentId, updatePromotion, getPromotion, createPromotion, deletePromotion };
