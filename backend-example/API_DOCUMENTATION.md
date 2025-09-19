# Healthcare Chatbot APIs

## 🏥 Available APIs

### 1. Healthcare Centers Finder

**Endpoint:** `POST /api/healthcare-centers`

**Purpose:** Find nearby hospitals, clinics, and healthcare facilities

**Request Body:**

```json
{
  "location": "28.6139,77.2090", // Latitude,Longitude
  "type": "hospital" // hospital, clinic, pharmacy, dentist
}
```

**Response:**

```json
{
  "success": true,
  "centers": [
    {
      "name": "Delhi Heart and Lung Institute",
      "type": "hospital",
      "address": "Address not available",
      "phone": "Phone not available",
      "website": null,
      "lat": 28.6416777,
      "lon": 77.2052683
    }
  ],
  "location": "28.6139,77.2090",
  "total": 10
}
```

### 2. Vaccination Centers (CoWIN API)

**Endpoint:** `POST /api/vaccination-centers`

**Purpose:** Find vaccination centers in India

**Request Body:**

```json
{
  "state": "Delhi",
  "district": "Central Delhi"
}
```

### 3. Chat with AI

**Endpoint:** `POST /api/gemini`

**Purpose:** Get healthcare advice from AI

**Request Body:**

```json
{
  "message": "My baby has fever",
  "language": "en" // or "hi" for Hindi
}
```

## 🌍 Free APIs Used

### 1. OpenStreetMap Overpass API

- **Cost:** Completely FREE
- **No API key required**
- **Used for:** Finding healthcare facilities worldwide
- **Rate limits:** Reasonable for normal use

### 2. CoWIN API (India)

- **Cost:** FREE
- **No API key required**
- **Used for:** Vaccination centers in India
- **Note:** May have occasional downtime

### 3. Google Places API (Alternative)

- **Cost:** FREE tier - 1,000 requests/month
- **Requires API key**
- **Used for:** More detailed healthcare facility information

## 💡 How to Use in Your Chatbot

### Frontend Integration Example:

```javascript
// Find nearby hospitals
async function findHospitals(lat, lon) {
  const response = await fetch("/api/healthcare-centers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: `${lat},${lon}`,
      type: "hospital",
    }),
  });
  return await response.json();
}

// Find vaccination centers
async function findVaccinationCenters(state, district) {
  const response = await fetch("/api/vaccination-centers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, district }),
  });
  return await response.json();
}
```

## 🔧 Adding More APIs

You can easily add more free APIs:

1. **Government Health APIs** - Most countries have free health data APIs
2. **WHO APIs** - World Health Organization data
3. **Emergency Services APIs** - For finding emergency contacts
4. **Pharmacy APIs** - For finding nearby pharmacies

## 📱 Mobile App Integration

These APIs work perfectly for mobile apps:

- Get user's GPS location
- Find nearest healthcare facilities
- Show on map with directions
- Provide contact information

## 🚀 Next Steps

1. **Add to Frontend:** Integrate these APIs into your React app
2. **Add Maps:** Show healthcare centers on a map
3. **Add More Types:** pharmacies, dentists, emergency services
4. **Add Reviews:** Integrate with review APIs
5. **Add Booking:** Integrate with appointment booking systems

## 🔒 Security Notes

- All APIs are public and safe to use
- No sensitive data is stored
- User locations are only used for finding nearby facilities
- All responses include fallback options for errors
