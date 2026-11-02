import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  description: String,
  estimatedCost: Number,
  image: String
})

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: String,
  pricePerNight: Number,
  rating: Number,
  facilities: [String],
  image: String
})

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  hotel: String,
  startDate: { type: String, required: true },
  days: { type: Number, min: 1, required: true },
  activities: [String],
  expenses: {
    hotel: Number,
    food: Number,
    transport: Number,
    other: Number
  },
  totalBudget: Number
}, { timestamps: true })

const Destination = mongoose.model('Destination', destinationSchema)
const Hotel = mongoose.model('Hotel', hotelSchema)
const Trip = mongoose.model('Trip', tripSchema)

const sampleDestinations = [
  { name: 'Goa', location: 'India', description: 'Sunny beaches, coastal cafés and unforgettable sunsets.', estimatedCost: 8000, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900' },
  { name: 'Manali', location: 'Himachal Pradesh, India', description: 'Mountain views, fresh air and scenic adventures.', estimatedCost: 12000, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900' },
  { name: 'Kerala', location: 'India', description: 'Peaceful backwaters, green landscapes and culture.', estimatedCost: 10000, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900' },
  { name: 'Jaipur', location: 'Rajasthan, India', description: 'Discover colourful markets, forts and royal history.', estimatedCost: 9000, image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900' },
  { name: 'Bali', location: 'Indonesia', description: 'Tropical beaches, temples and beautiful landscapes.', estimatedCost: 35000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900' },
  { name: 'Ooty', location: 'Tamil Nadu, India', description: 'Relax among rolling hills, gardens and tea estates.', estimatedCost: 7000, image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=900' }
]

const sampleHotels = [
  { name: 'Ocean View Resort', destination: 'Goa', pricePerNight: 2500, rating: 4.5, facilities: ['Wi-Fi', 'Pool', 'Restaurant'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900' },
  { name: 'Beach Paradise Hotel', destination: 'Goa', pricePerNight: 1800, rating: 4.2, facilities: ['Wi-Fi', 'Breakfast'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900' },
  { name: 'Mountain Stay', destination: 'Manali', pricePerNight: 2200, rating: 4.5, facilities: ['Wi-Fi', 'Mountain view'], image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900' },
  { name: 'Green Valley Resort', destination: 'Kerala', pricePerNight: 2000, rating: 4.3, facilities: ['Wi-Fi', 'Garden'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900' },
  { name: 'Royal Heritage Hotel', destination: 'Jaipur', pricePerNight: 3000, rating: 4.6, facilities: ['Wi-Fi', 'Restaurant'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900' },
  { name: 'Bali Beach Resort', destination: 'Bali', pricePerNight: 4500, rating: 4.8, facilities: ['Wi-Fi', 'Pool', 'Spa'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900' },
  { name: 'Hill Garden Hotel', destination: 'Ooty', pricePerNight: 1600, rating: 4.1, facilities: ['Wi-Fi', 'Garden'], image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900' }
]

app.get('/', (req, res) => {
  res.send('TripMate backend is running.')
})

app.get('/api/destinations', async (req, res) => {
  try {
    res.json(await Destination.find().sort({ name: 1 }))
  } catch (error) {
    res.status(500).json({ message: 'Could not load destinations.' })
  }
})

app.get('/api/hotels', async (req, res) => {
  try {
    res.json(await Hotel.find().sort({ pricePerNight: 1 }))
  } catch (error) {
    res.status(500).json({ message: 'Could not load hotels.' })
  }
})

app.get('/api/trips', async (req, res) => {
  try {
    res.json(await Trip.find().sort({ createdAt: -1 }))
  } catch (error) {
    res.status(500).json({ message: 'Could not load trips.' })
  }
})

app.post('/api/trips', async (req, res) => {
  try {
    const { destination, startDate, days, totalBudget } = req.body
    if (!destination || !startDate || !Number.isFinite(Number(days)) || Number(days) < 1) {
      return res.status(400).json({ message: 'Destination, date and valid trip duration are required.' })
    }
    const trip = await Trip.create(req.body)
    res.status(201).json(trip)
  } catch (error) {
    res.status(400).json({ message: 'Could not save the trip.' })
  }
})

app.delete('/api/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id)
    if (!trip) return res.status(404).json({ message: 'Trip not found.' })
    res.json({ message: 'Trip deleted.' })
  } catch (error) {
    res.status(400).json({ message: 'Invalid trip ID.' })
  }
})

async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Create backend/.env first.')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected.')

    if (await Destination.countDocuments() === 0) {
      await Destination.insertMany(sampleDestinations)
      console.log('Sample destinations added.')
    }
    if (await Hotel.countDocuments() === 0) {
      await Hotel.insertMany(sampleHotels)
      console.log('Sample hotels added.')
    }

    const port = process.env.PORT || 5000
    app.listen(port, () => console.log(`TripMate backend running at http://localhost:${port}`))
  } catch (error) {
    console.error('Backend startup error:', error.message)
  }
}

startServer()
