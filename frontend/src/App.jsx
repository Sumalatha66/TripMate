
import React from 'react';
import { useEffect, useMemo, useState } from 'react'
import {
  Plane, Search, MapPin, CalendarDays, Hotel, Wallet,
  Compass, Plus, Trash2, Menu, X, ArrowRight, Sparkles
} from 'lucide-react'

const API = 'http://localhost:5000/api'

const fallbackDestinations = [
  { _id: 'goa', name: 'Goa', location: 'India', description: 'Sunny beaches, coastal cafés and unforgettable sunsets.', estimatedCost: 8000, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900' },
  { _id: 'manali', name: 'Manali', location: 'Himachal Pradesh, India', description: 'Mountain views, fresh air and scenic adventures.', estimatedCost: 12000, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900' },
  { _id: 'kerala', name: 'Kerala', location: 'India', description: 'Peaceful backwaters, green landscapes and culture.', estimatedCost: 10000, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900' },
  { _id: 'jaipur', name: 'Jaipur', location: 'Rajasthan, India', description: 'Discover colourful markets, forts and royal history.', estimatedCost: 9000, image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900' },
  { _id: 'bali', name: 'Bali', location: 'Indonesia', description: 'Tropical beaches, temples and beautiful landscapes.', estimatedCost: 35000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900' },
  { _id: 'ooty', name: 'Ooty', location: 'Tamil Nadu, India', description: 'Relax among rolling hills, gardens and tea estates.', estimatedCost: 7000, image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=900' }
]

const fallbackHotels = [
  { _id: 'h1', name: 'Ocean View Resort', destination: 'Goa', pricePerNight: 2500, rating: 4.5, facilities: ['Wi-Fi', 'Pool', 'Restaurant'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900' },
  { _id: 'h2', name: 'Beach Paradise Hotel', destination: 'Goa', pricePerNight: 1800, rating: 4.2, facilities: ['Wi-Fi', 'Breakfast'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900' },
  { _id: 'h3', name: 'Mountain Stay', destination: 'Manali', pricePerNight: 2200, rating: 4.5, facilities: ['Wi-Fi', 'Mountain view'], image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900' },
  { _id: 'h4', name: 'Green Valley Resort', destination: 'Kerala', pricePerNight: 2000, rating: 4.3, facilities: ['Wi-Fi', 'Garden'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900' },
  { _id: 'h5', name: 'Royal Heritage Hotel', destination: 'Jaipur', pricePerNight: 3000, rating: 4.6, facilities: ['Wi-Fi', 'Restaurant'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900' },
  { _id: 'h6', name: 'Bali Beach Resort', destination: 'Bali', pricePerNight: 4500, rating: 4.8, facilities: ['Wi-Fi', 'Pool', 'Spa'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900' },
  { _id: 'h7', name: 'Hill Garden Hotel', destination: 'Ooty', pricePerNight: 1600, rating: 4.1, facilities: ['Wi-Fi', 'Garden'], image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900' }
]

const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`

function App() {
  const [page, setPage] = useState('Home')
  const [destinations, setDestinations] = useState(fallbackDestinations)
  const [hotels, setHotels] = useState(fallbackHotels)
  const [trips, setTrips] = useState([])
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [hotel, setHotel] = useState('')
  const [date, setDate] = useState('')
  const [days, setDays] = useState(2)
  const [activity, setActivity] = useState('')
  const [activities, setActivities] = useState([])
  const [food, setFood] = useState(2000)
  const [transport, setTransport] = useState(2500)
  const [other, setOther] = useState(1000)
  const [hotelMax, setHotelMax] = useState(5000)
  const [minRating, setMinRating] = useState('0')
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [backendOnline, setBackendOnline] = useState(false)

  async function loadData() {
    try {
      const [dRes, hRes, tRes] = await Promise.all([
        fetch(`${API}/destinations`),
        fetch(`${API}/hotels`),
        fetch(`${API}/trips`)
      ])
      if (!dRes.ok || !hRes.ok || !tRes.ok) throw new Error('API unavailable')
      setDestinations(await dRes.json())
      setHotels(await hRes.json())
      setTrips(await tRes.json())
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const selectedDestination = destinations.find(item => item._id === destination)
  const selectedHotel = hotels.find(item => item._id === hotel)

  const hotelCost = selectedHotel ? Number(selectedHotel.pricePerNight) * Number(days) : 0
  const total = hotelCost + Number(food) + Number(transport) + Number(other)

  const filteredDestinations = useMemo(() => destinations.filter(item =>
    `${item.name} ${item.location}`.toLowerCase().includes(search.toLowerCase())
  ), [destinations, search])

  const filteredHotels = hotels.filter(item =>
    (!destination || !selectedDestination || item.destination === selectedDestination.name) &&
    Number(item.pricePerNight) <= Number(hotelMax) &&
    Number(item.rating) >= Number(minRating)
  )

  function navigate(nextPage) {
    setPage(nextPage)
    setMenuOpen(false)
    setNotice('')
  }

  function chooseDestination(id) {
    setDestination(id)
    setHotel('')
    navigate('Hotels')
  }

  function addActivity() {
    if (activity.trim()) {
      setActivities(current => [...current, activity.trim()])
      setActivity('')
    }
  }

  async function saveTrip() {
    if (!selectedDestination || !date || Number(days) < 1) {
      setNotice('Please select a destination, a valid date and at least one day.')
      return
    }

    const tripData = {
      destination: selectedDestination.name,
      hotel: selectedHotel ? selectedHotel.name : 'Not selected',
      startDate: date,
      days: Number(days),
      activities,
      expenses: { hotel: hotelCost, food: Number(food), transport: Number(transport), other: Number(other) },
      totalBudget: total
    }

    try {
      const response = await fetch(`${API}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      })
      if (!response.ok) throw new Error('Save failed')
      setNotice('Your travel plan has been saved to MongoDB.')
      setActivities([])
      await loadData()
      setPage('My Trips')
    } catch {
      setNotice('Could not save to MongoDB. Start the backend and check your database connection.')
    }
  }

  async function deleteTrip(id) {
    try {
      const response = await fetch(`${API}/trips/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      await loadData()
      setNotice('Travel plan deleted.')
    } catch {
      setNotice('Could not delete this trip. Please check the backend.')
    }
  }

  const navItems = ['Home', 'Destinations', 'Hotels', 'Trip Planner', 'My Trips']

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={() => navigate('Home')}>
          <span className="brand-icon"><Plane size={21} /></span>
          <span>Trip<span className="brand-accent">Mate</span></span>
        </button>

        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navItems.map(item => (
            <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} onClick={() => navigate(item)}>
              {item}
            </button>
          ))}
        </nav>

        <button className="nav-cta" onClick={() => navigate('Trip Planner')}>Plan a trip <ArrowRight size={16} /></button>
      </header>

      {!backendOnline && (
        <div className="demo-notice">
          <Sparkles size={15} /> Preview mode: sample destinations are shown. Start the backend and MongoDB to save trips.
        </div>
      )}
      {notice && <div className="notice">{notice}</div>}

      {page === 'Home' && (
        <>
          <section className="hero">
            <div className="hero-shade" />
            <div className="hero-content">
              <span className="eyebrow"><Sparkles size={15} /> YOUR NEXT ADVENTURE STARTS HERE</span>
              <h1>Discover places.<br /><em>Create memories.</em></h1>
              <p>Plan your perfect getaway with destinations, stays and a budget that works for you.</p>
              <div className="hero-search">
                <Search size={20} />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && navigate('Destinations')} placeholder="Where would you like to go?" />
                <button onClick={() => navigate('Destinations')}>Explore</button>
              </div>
              <div className="hero-stats">
                <span><strong>6+</strong> destinations</span>
                <span><strong>7+</strong> stays to explore</span>
                <span><strong>1</strong> easy trip planner</span>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <div><span className="eyebrow">FIND YOUR HAPPY PLACE</span><h2>Popular destinations</h2></div>
              <button className="text-link" onClick={() => navigate('Destinations')}>View all <ArrowRight size={16} /></button>
            </div>
            <div className="destination-grid">
              {destinations.slice(0, 3).map(item => <DestinationCard key={item._id} item={item} onExplore={() => chooseDestination(item._id)} />)}
            </div>
          </section>

          <section className="feature-band">
            <div><Compass size={28} /><h3>Explore with ease</h3><p>Find a destination that matches your travel mood.</p></div>
            <div><Hotel size={28} /><h3>Choose your stay</h3><p>Compare sample hotels and nightly prices.</p></div>
            <div><Wallet size={28} /><h3>Know your budget</h3><p>Estimate trip expenses before you travel.</p></div>
          </section>
        </>
      )}

      {page === 'Destinations' && (
        <section className="section page-section">
          <div className="page-intro"><span className="eyebrow">MAKE IT A JOURNEY</span><h1>Explore destinations</h1><p>Find a place for your next memorable escape.</p></div>
          <div className="search-field"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by destination or location..." /></div>
          <div className="destination-grid">
            {filteredDestinations.map(item => <DestinationCard key={item._id} item={item} onExplore={() => chooseDestination(item._id)} />)}
          </div>
          {filteredDestinations.length === 0 && <p className="empty-state">No destinations found. Try another search.</p>}
        </section>
      )}

      {page === 'Hotels' && (
        <section className="section page-section">
          <div className="page-intro"><span className="eyebrow">A COMFORTABLE STAY</span><h1>Find your stay</h1><p>Choose a sample hotel for your travel plan.</p></div>
          <div className="filters">
            <label>Destination
              <select value={destination} onChange={e => { setDestination(e.target.value); setHotel('') }}>
                <option value="">All destinations</option>
                {destinations.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
              </select>
            </label>
            <label>Maximum price per night
              <select value={hotelMax} onChange={e => setHotelMax(e.target.value)}>
                <option value="2000">₹2,000</option><option value="3000">₹3,000</option><option value="5000">₹5,000</option><option value="10000">₹10,000</option>
              </select>
            </label>
            <label>Minimum rating
              <select value={minRating} onChange={e => setMinRating(e.target.value)}>
                <option value="0">Any rating</option><option value="4">4.0+</option><option value="4.5">4.5+</option>
              </select>
            </label>
          </div>
          <div className="hotel-grid">
            {filteredHotels.map(item => (
              <article className="hotel-card" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div className="card-body">
                  <div className="card-topline"><span className="location"><MapPin size={14} /> {item.destination}</span><span className="rating">★ {item.rating}</span></div>
                  <h3>{item.name}</h3>
                  <p className="muted">{(item.facilities || []).join(' · ')}</p>
                  <div className="card-bottom"><strong>{money(item.pricePerNight)} <small>/ night</small></strong><button className="small-button" onClick={() => { setHotel(item._id); const found = destinations.find(d => d.name === item.destination); if (found) setDestination(found._id); navigate('Trip Planner') }}>Choose stay</button></div>
                </div>
              </article>
            ))}
          </div>
          {filteredHotels.length === 0 && <p className="empty-state">No hotels match these filters.</p>}
        </section>
      )}

      {page === 'Trip Planner' && (
        <section className="section page-section">
          <div className="page-intro"><span className="eyebrow">MAKE YOUR OWN ITINERARY</span><h1>Plan your trip</h1><p>Choose your travel details and see your estimated budget.</p></div>
          <div className="planner-layout">
            <div className="planner-panel">
              <h2><span className="step-number">01</span> Trip details</h2>
              <label>Destination
                <select value={destination} onChange={e => { setDestination(e.target.value); setHotel('') }}>
                  <option value="">Select a destination</option>
                  {destinations.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                </select>
              </label>
              <label>Hotel
                <select value={hotel} onChange={e => setHotel(e.target.value)}>
                  <option value="">No hotel selected</option>
                  {hotels.filter(item => !selectedDestination || item.destination === selectedDestination.name).map(item => <option key={item._id} value={item._id}>{item.name} — {money(item.pricePerNight)}/night</option>)}
                </select>
              </label>
              <div className="two-fields">
                <label><CalendarDays size={15} /> Start date
                  <input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={e => setDate(e.target.value)} />
                </label>
                <label>Number of days
                  <input type="number" min="1" max="60" value={days} onChange={e => setDays(e.target.value)} />
                </label>
              </div>
              <h2 className="sub-heading"><span className="step-number">02</span> Activities</h2>
              <div className="activity-entry">
                <input value={activity} onChange={e => setActivity(e.target.value)} onKeyDown={e => e.key === 'Enter' && addActivity()} placeholder="e.g. Visit the beach" />
                <button onClick={addActivity} aria-label="Add activity"><Plus size={18} /></button>
              </div>
              {activities.length > 0 ? <ul className="activity-list">{activities.map((item, index) => <li key={`${item}-${index}`}>{item}<button onClick={() => setActivities(activities.filter((_, i) => i !== index))} aria-label="Remove activity"><X size={15} /></button></li>)}</ul> : <p className="helper-text">Add places or activities you want to include in your trip.</p>}
            </div>

            <div className="budget-panel">
              <div className="budget-title"><Wallet size={21} /><div><h2>Trip budget</h2><p>Your estimated expenses</p></div></div>
              <div className="budget-line"><span>Hotel ({days || 0} nights)</span><strong>{money(hotelCost)}</strong></div>
              <label>Food expenses <input type="number" min="0" value={food} onChange={e => setFood(e.target.value)} /></label>
              <label>Transport expenses <input type="number" min="0" value={transport} onChange={e => setTransport(e.target.value)} /></label>
              <label>Other expenses <input type="number" min="0" value={other} onChange={e => setOther(e.target.value)} /></label>
              <div className="budget-total"><span>Estimated total</span><strong>{money(total)}</strong></div>
              <p className="helper-text">This is an estimate for planning only. Actual prices may vary.</p>
              <button className="save-button" onClick={saveTrip}>Save my trip <ArrowRight size={17} /></button>
            </div>
          </div>
        </section>
      )}

      {page === 'My Trips' && (
        <section className="section page-section">
          <div className="page-intro"><span className="eyebrow">YOUR TRAVEL COLLECTION</span><h1>My trips</h1><p>Your saved travel plans in one place.</p></div>
          {trips.length > 0 ? <div className="saved-trips">{trips.map(item => (
            <article className="saved-trip" key={item._id}>
              <div className="saved-trip-icon"><Plane size={23} /></div>
              <div className="saved-trip-info"><h3>{item.destination}</h3><p><CalendarDays size={14} /> {String(item.startDate).slice(0, 10)} <span>·</span> {item.days} days <span>·</span> {item.hotel}</p><small>{(item.activities || []).join(' · ') || 'No activities added'}</small></div>
              <div className="saved-trip-cost"><strong>{money(item.totalBudget)}</strong><small>Estimated budget</small></div>
              <button className="delete-button" onClick={() => deleteTrip(item._id)} aria-label="Delete trip"><Trash2 size={18} /></button>
            </article>
          ))}</div> : <div className="empty-card"><Plane size={35} /><h2>No trips saved yet</h2><p>Your planned journeys will appear here after you save them.</p><button onClick={() => navigate('Trip Planner')}>Create your first trip</button></div>}
        </section>
      )}

      <footer className="footer"><div className="footer-brand"><Plane size={19} /> TripMate</div><p>Your journey, your way.</p><small>Student project · Sample travel and hotel information</small></footer>
    </div>
  )
}

function DestinationCard({ item, onExplore }) {
  return (
    <article className="destination-card">
      <div className="destination-image"><img src={item.image} alt={item.name} /><span>{money(item.estimatedCost)} <small>est. trip</small></span></div>
      <div className="card-body">
        <p className="location"><MapPin size={14} /> {item.location}</p>
        <h3>{item.name}</h3>
        <p className="muted">{item.description}</p>
        <button className="card-link" onClick={onExplore}>Explore destination <ArrowRight size={16} /></button>
      </div>
    </article>
  )
}

export default App
