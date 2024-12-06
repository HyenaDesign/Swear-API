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
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order niet gevonden' });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen order', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = new Order(orderData);

    await newOrder.save();

    req.app.get('io').emit('orderCreated', newOrder);

    res.status(201).json({ message: 'Order succesvol aangemaakt', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het aanmaken van de order', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedOrder) {
      req.app.get('io').emit('orderUpdated', updatedOrder);
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order niet gevonden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fout bij updaten order', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (deletedOrder) {
      req.app.get('io').emit('orderDeleted', deletedOrder);
      res.status(200).json({ message: 'Order succesvol verwijderd' });
    } else {
      res.status(404).json({ message: 'Order niet gevonden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fout bij verwijderen order', error });
  }
});

module.exports = router;