import express from 'express';
import { auth, roleAuth } from '../middleware/auth.js';
import Hostel from '../models/Hostel.js';
import HostelAllocation from '../models/HostelAllocation.js';

const router = express.Router();

// Get all hostels
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true });
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create hostel (Admin)
router.post('/', auth, roleAuth('admin'), async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    hostel.availableRooms = hostel.totalRooms;
    await hostel.save();

    res.status(201).json({
      message: 'Hostel created successfully',
      hostel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my hostel allocation (Student)
router.get('/my-allocation', auth, roleAuth('student'), async (req, res) => {
  try {
    const allocation = await HostelAllocation.findOne({ 
      studentId: req.userId,
      status: 'allocated'
    }).populate('hostelId');

    if (!allocation) {
      return res.status(404).json({ error: 'No hostel allocation found' });
    }

    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all allocations (Admin)
router.get('/allocations', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { hostelId, status } = req.query;
    
    const filter = {};
    if (hostelId) filter.hostelId = hostelId;
    if (status) filter.status = status;

    const allocations = await HostelAllocation.find(filter)
      .populate('studentId', 'fullName email phone')
      .populate('hostelId', 'name code')
      .sort({ allocationDate: -1 });

    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allocate hostel manually (Admin)
router.post('/allocate', auth, roleAuth('admin'), async (req, res) => {
  try {
    const { studentId, hostelId, roomNumber } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel || hostel.availableRooms <= 0) {
      return res.status(400).json({ error: 'No rooms available in this hostel' });
    }

    // Check if already allocated
    const existing = await HostelAllocation.findOne({ 
      studentId, 
      status: 'allocated' 
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Student already has a hostel allocation' });
    }

    const allocation = new HostelAllocation({
      studentId,
      hostelId,
      roomNumber
    });

    await allocation.save();

    hostel.availableRooms -= 1;
    await hostel.save();

    res.json({
      message: 'Hostel allocated successfully',
      allocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for hostel (Student)
router.post('/apply', auth, roleAuth('student'), async (req, res) => {
  try {
    const { hostelId } = req.body;

    // Check if already allocated
    const existing = await HostelAllocation.findOne({ 
      studentId: req.userId, 
      status: 'allocated' 
    });
    
    if (existing) {
      return res.status(400).json({ error: 'You already have a hostel allocation' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    if (hostel.availableRooms <= 0) {
      return res.status(400).json({ error: 'No rooms available in this hostel' });
    }

    // Auto-allocate room number
    const existingAllocations = await HostelAllocation.find({ hostelId }).sort({ roomNumber: -1 });
    let nextRoomNumber = 101;
    if (existingAllocations.length > 0) {
      nextRoomNumber = parseInt(existingAllocations[0].roomNumber) + 1;
    }

    const allocation = new HostelAllocation({
      studentId: req.userId,
      hostelId,
      roomNumber: String(nextRoomNumber)
    });

    await allocation.save();

    hostel.availableRooms -= 1;
    await hostel.save();

    const populatedAllocation = await HostelAllocation.findById(allocation._id).populate('hostelId');

    res.json({
      message: 'Hostel allocated successfully',
      allocation: populatedAllocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available hostels for student gender
router.get('/available', auth, async (req, res) => {
  try {
    const hostels = await Hostel.find({ 
      isActive: true, 
      availableRooms: { $gt: 0 } 
    });
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;