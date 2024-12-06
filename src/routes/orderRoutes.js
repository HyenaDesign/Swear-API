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

// Haal een specifieke order op op basis van ID
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

// Voeg een nieuwe order toe
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    // Maak een nieuwe order aan met de ontvangen gegevens
    const newOrder = new Order(orderData);

    // Sla de nieuwe order op in de database
    await newOrder.save();

    // Optioneel: Broadcast de nieuwe order naar alle clients
    req.app.get('io').emit('orderCreated', newOrder);

    // Stuur de nieuwe order als reactie terug
    res.status(201).json({ message: 'Order succesvol aangemaakt', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het aanmaken van de order', error });
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

// Verwijder een bestelling
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (deletedOrder) {
      req.app.get('io').emit('orderDeleted', deletedOrder); // Broadcast delete
      res.status(200).json({ message: 'Order succesvol verwijderd' });
    } else {
      res.status(404).json({ message: 'Order niet gevonden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fout bij verwijderen order', error });
  }
});

module.exports = router;