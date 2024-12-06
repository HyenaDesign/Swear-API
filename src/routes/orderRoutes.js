const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen orders', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order niet gevonden' });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen de order', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedOrder) {
      req.app.get('io').emit('orderUpdated', updatedOrder); // Broadcast update naar alle clients
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order niet gevonden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fout bij updaten order', error });
  }
});

module.exports = router;