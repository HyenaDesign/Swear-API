const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Haal alle orders op
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen orders', error });
  }
});

// Update een order en broadcast de wijziging
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedOrder) {
      req.app.get('io').emit('orderUpdated', updatedOrder); // Broadcast update
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order niet gevonden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fout bij updaten order', error });
  }
});

module.exports = router;