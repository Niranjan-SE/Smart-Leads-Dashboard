import { Response } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead';
import { AuthRequest, LeadsQuery, LeadStatus, LeadSource } from '../types';
import { sendSuccess, sendError } from '../utils/response';


export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest',
    } = req.query as LeadsQuery;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: Record<string, unknown> = {};

    // Role-based: sales users only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      filter.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      filter.source = source as LeadSource;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(
      res,
      leads,
      'Leads fetched successfully',
      200,
      {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      }
    );
  } catch (error) {
    sendError(res, 'Failed to fetch leads', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    sendError(res, 'Failed to fetch lead', 500);
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user?.id,
    });

    const populated = await lead.populate('createdBy', 'name email');

    sendSuccess(res, populated, 'Lead created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create lead', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only update their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const { name, email, status, source, notes } = req.body;
    const updates: Partial<{ name: string; email: string; status: LeadStatus; source: LeadSource; notes: string }> = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (status !== undefined) updates.status = status;
    if (source !== undefined) updates.source = source;
    if (notes !== undefined) updates.notes = notes;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, updated, 'Lead updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only delete their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadsQuery;

    const filter: Record<string, unknown> = {};

    if (req.user?.role === 'sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Build CSV
    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'];
    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as { name?: string; email?: string } | null;
      return [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${lead.notes || ''}"`,
        `"${createdBy?.name || ''}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    sendError(res, 'Failed to export leads', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const [statusStats, sourceStats, totalLeads] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    const byStatus = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    statusStats.forEach(({ _id, count }: { _id: LeadStatus; count: number }) => {
      if (_id in byStatus) byStatus[_id] = count;
    });

    const bySource = { Website: 0, Instagram: 0, Referral: 0 };
    sourceStats.forEach(({ _id, count }: { _id: LeadSource; count: number }) => {
      if (_id in bySource) bySource[_id] = count;
    });

    sendSuccess(res, { totalLeads, byStatus, bySource });
  } catch (error) {
    sendError(res, 'Failed to fetch stats', 500);
  }
};
