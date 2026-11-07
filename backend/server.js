import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import dns from 'dns'

// Use reliable public DNS servers to resolve Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch {
  // Fall back to default system resolver
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load backend/.env first, then fallback to root .env
dotenv.config({ path: path.join(__dirname, '.env') })
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

const MONGO_URI = process.env.MONGO_URI || ''
const isAtlas = MONGO_URI.includes('mongodb+srv')
const hasPlaceholder = MONGO_URI.includes('<username>') || MONGO_URI.includes('<password>')

async function seedInitialData() {
  try {
    if (mongoose.connection.readyState !== 1) return
    const destCount = await Destination.countDocuments()
    if (destCount === 0) {
      await Destination.insertMany(sampleDestinations)
      console.log('Sample destinations seeded into MongoDB.')
    }
    const hotelCount = await Hotel.countDocuments()
    if (hotelCount === 0) {
      await Hotel.insertMany(sampleHotels)
      console.log('Sample hotels seeded into MongoDB.')
    }
  } catch (error) {
    console.error('Error seeding initial data:', error.message)
  }
}

async function connectToDatabase() {
  if (!MONGO_URI) {
    console.warn('\n⚠️  [TripMate] MONGO_URI is missing!')
    console.warn('👉 To connect to MongoDB Atlas, add your connection string to backend/.env:')
    console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tripmate?retryWrites=true&w=majority\n')
    return
  }

  if (hasPlaceholder) {
    console.warn('\n⚠️  [TripMate] MONGO_URI contains placeholder credentials (<username> / <password>).')
    console.warn('👉 Replace <username> and <password> with your actual MongoDB Atlas database credentials in backend/.env\n')
    return
  }

  try {
    console.log(`⏳ Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB / Compass'}...`)
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    })
    console.log(`✅ MongoDB connected successfully (${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}).`)
    await seedInitialData()
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    if (isAtlas) {
      console.warn('👉 MongoDB Atlas Troubleshooting:')
      console.warn('   1. Check username and password in backend/.env')
      console.warn('   2. Ensure IP 0.0.0.0/0 is added in MongoDB Atlas -> Network Access')
    } else {
      console.warn('👉 For MongoDB Atlas, set MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tripmate in backend/.env')
    }
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection disconnected.')
})

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.')
})

const distPath = path.join(__dirname, '../frontend/dist')

// Serve static frontend assets if built
app.use(express.static(distPath))

app.get(['/health', '/api/health'], (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const state = dbStates[mongoose.connection.readyState] || 'unknown'
  res.json({
    status: 'ok',
    database: state,
    databaseType: isAtlas ? 'MongoDB Atlas' : 'Local / Compass',
    hasCredentials: !hasPlaceholder && Boolean(MONGO_URI),
    timestamp: new Date().toISOString()
  })
})

app.get('/api/destinations', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const docs = await Destination.find().sort({ name: 1 })
      if (docs && docs.length > 0) return res.json(docs)
    }
    res.json(sampleDestinations.map((item, idx) => ({ ...item, _id: `dest-${idx + 1}` })))
  } catch (error) {
    res.json(sampleDestinations.map((item, idx) => ({ ...item, _id: `dest-${idx + 1}` })))
  }
})

app.get('/api/hotels', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const docs = await Hotel.find().sort({ pricePerNight: 1 })
      if (docs && docs.length > 0) return res.json(docs)
    }
    res.json(sampleHotels.map((item, idx) => ({ ...item, _id: `hotel-${idx + 1}` })))
  } catch (error) {
    res.json(sampleHotels.map((item, idx) => ({ ...item, _id: `hotel-${idx + 1}` })))
  }
})

app.get('/api/trips', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const trips = await Trip.find().sort({ createdAt: -1 })
      return res.json(trips)
    }
    res.json([])
  } catch (error) {
    res.status(500).json({ message: 'Could not load trips from database.' })
  }
})

app.post('/api/trips', async (req, res) => {
  try {
    const { destination, startDate, days } = req.body
    if (!destination || !startDate || !Number.isFinite(Number(days)) || Number(days) < 1) {
      return res.status(400).json({ message: 'Destination, date and a valid duration (at least 1 day) are required.' })
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'MongoDB Atlas is not connected. Please verify your connection string and ensure IP 0.0.0.0/0 is allowed in Atlas Network Access.'
      })
    }

    const trip = await Trip.create(req.body)
    res.status(201).json(trip)
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not save the trip.' })
  }
})

app.put('/api/trips/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB Atlas is not connected.' })
    }
    const { destination, startDate, days } = req.body
    if (!destination || !startDate || !Number.isFinite(Number(days)) || Number(days) < 1) {
      return res.status(400).json({ message: 'Destination, date and a valid duration (at least 1 day) are required.' })
    }
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!trip) return res.status(404).json({ message: 'Trip not found.' })
    res.json(trip)
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not update the trip.' })
  }
})

app.delete('/api/trips/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB is not connected.' })
    }
    const trip = await Trip.findByIdAndDelete(req.params.id)
    if (!trip) return res.status(404).json({ message: 'Trip not found.' })
    res.json({ message: 'Trip deleted.' })
  } catch (error) {
    res.status(400).json({ message: 'Invalid trip ID.' })
  }
})

// Serve React SPA index.html for all non-API web routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('TripMate backend is running. Run "npm run build" to build and serve the frontend UI.')
    }
  })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`TripMate backend running at http://localhost:${port}`)
  connectToDatabase()
})
