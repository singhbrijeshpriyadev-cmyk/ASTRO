export interface IndianLocation {
  id: string;
  name: string;
  state: string;
  category: 'metro' | 'pilgrimage' | 'city' | 'town' | 'district';
  latitude: number;
  longitude: number;
  timezone: string;
  historicalName?: string;
  notes?: string;
}

export const INDIAN_LOCATIONS: IndianLocation[] = [
  // Sacred Astrological / Pilgrimage Observatories
  { id: 'ujjain', name: 'Ujjain', state: 'Madhya Pradesh', category: 'pilgrimage', latitude: 23.1765, longitude: 75.7885, timezone: 'Asia/Kolkata', notes: 'Prime Greenwich Meridian of ancient Indian astronomy (Avanti/Zero Meridian)' },
  { id: 'varanasi', name: 'Varanasi (Kashi)', state: 'Uttar Pradesh', category: 'pilgrimage', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata', historicalName: 'Benares' },
  { id: 'haridwar', name: 'Haridwar', state: 'Uttarakhand', category: 'pilgrimage', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata' },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', category: 'pilgrimage', latitude: 30.0869, longitude: 78.2676, timezone: 'Asia/Kolkata' },
  { id: 'ayodhya', name: 'Ayodhya', state: 'Uttar Pradesh', category: 'pilgrimage', latitude: 26.7922, longitude: 82.1998, timezone: 'Asia/Kolkata' },
  { id: 'mathura', name: 'Mathura', state: 'Uttar Pradesh', category: 'pilgrimage', latitude: 27.4924, longitude: 77.6737, timezone: 'Asia/Kolkata' },
  { id: 'vrindavan', name: 'Vrindavan', state: 'Uttar Pradesh', category: 'pilgrimage', latitude: 27.5806, longitude: 77.7006, timezone: 'Asia/Kolkata' },
  { id: 'puri', name: 'Puri', state: 'Odisha', category: 'pilgrimage', latitude: 19.8135, longitude: 85.8312, timezone: 'Asia/Kolkata' },
  { id: 'dwarka', name: 'Dwarka', state: 'Gujarat', category: 'pilgrimage', latitude: 22.2442, longitude: 68.9685, timezone: 'Asia/Kolkata' },
  { id: 'rameshwaram', name: 'Rameshwaram', state: 'Tamil Nadu', category: 'pilgrimage', latitude: 9.2876, longitude: 79.3129, timezone: 'Asia/Kolkata' },
  { id: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh', category: 'pilgrimage', latitude: 13.6288, longitude: 79.4192, timezone: 'Asia/Kolkata' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', category: 'pilgrimage', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
  { id: 'gaya', name: 'Gaya', state: 'Bihar', category: 'pilgrimage', latitude: 24.7914, longitude: 85.0002, timezone: 'Asia/Kolkata' },
  { id: 'prayagraj', name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', category: 'pilgrimage', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata', notes: 'Reference meridian of IST (82.5° E)' },
  { id: 'nashik', name: 'Nashik (Trimbak)', state: 'Maharashtra', category: 'pilgrimage', latitude: 19.9975, longitude: 73.7898, timezone: 'Asia/Kolkata' },
  { id: 'kurukshetra', name: 'Kurukshetra', state: 'Haryana', category: 'pilgrimage', latitude: 29.9695, longitude: 76.8783, timezone: 'Asia/Kolkata' },

  // Metros & Major Cities
  { id: 'delhi', name: 'New Delhi', state: 'Delhi NCT', category: 'metro', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', category: 'metro', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', historicalName: 'Bombay' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', category: 'metro', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', historicalName: 'Calcutta' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', category: 'metro', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', historicalName: 'Madras' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', category: 'metro', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', historicalName: 'Bangalore' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', category: 'metro', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', category: 'metro', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', category: 'metro', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', historicalName: 'Poona' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', category: 'city', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', notes: 'Location of Jantar Mantar Observatory' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', category: 'city', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', category: 'city', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata' },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', category: 'city', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata', notes: 'Geographical center of India (Zero Mile)' },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', category: 'city', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' },
  { id: 'patna', name: 'Patna', state: 'Bihar', category: 'city', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', historicalName: 'Pataliputra' },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', category: 'city', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', category: 'city', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata', historicalName: 'Baroda' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', category: 'city', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
  { id: 'kochi', name: 'Kochi (Cochin)', state: 'Kerala', category: 'city', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', category: 'city', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata', historicalName: 'Trivandrum' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'city', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' },
  { id: 'surat', name: 'Surat', state: 'Gujarat', category: 'city', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
  { id: 'mysuru', name: 'Mysuru (Mysore)', state: 'Karnataka', category: 'city', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', category: 'city', latitude: 31.6340, longitude: 74.8723, timezone: 'Asia/Kolkata' },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu and Kashmir', category: 'city', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', category: 'city', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata' },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', category: 'city', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', category: 'city', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', category: 'city', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', category: 'city', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', category: 'city', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', category: 'city', latitude: 26.2389, longitude: 73.0243, timezone: 'Asia/Kolkata' },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', category: 'city', latitude: 24.5854, longitude: 73.7125, timezone: 'Asia/Kolkata' },
  { id: 'panaji', name: 'Panaji', state: 'Goa', category: 'city', latitude: 15.4909, longitude: 73.8278, timezone: 'Asia/Kolkata' },
  { id: 'imphal', name: 'Imphal', state: 'Manipur', category: 'city', latitude: 24.8170, longitude: 93.9368, timezone: 'Asia/Kolkata' },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', category: 'city', latitude: 25.5788, longitude: 91.8933, timezone: 'Asia/Kolkata' },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', category: 'city', latitude: 23.8315, longitude: 91.2868, timezone: 'Asia/Kolkata' },
  { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', category: 'city', latitude: 23.7271, longitude: 92.7176, timezone: 'Asia/Kolkata' },
  { id: 'kohima', name: 'Kohima', state: 'Nagaland', category: 'city', latitude: 25.6751, longitude: 94.1086, timezone: 'Asia/Kolkata' },
  { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', category: 'city', latitude: 27.0844, longitude: 93.6053, timezone: 'Asia/Kolkata' },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', category: 'city', latitude: 27.3389, longitude: 88.6065, timezone: 'Asia/Kolkata' },
  { id: 'port_blair', name: 'Port Blair', state: 'Andaman & Nicobar', category: 'city', latitude: 11.6234, longitude: 92.7265, timezone: 'Asia/Kolkata' }
];

export function searchIndianLocations(query: string, limit = 8): IndianLocation[] {
  if (!query || query.trim().length === 0) {
    return INDIAN_LOCATIONS.slice(0, limit);
  }
  const q = query.toLowerCase().trim();
  return INDIAN_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(q) ||
    loc.state.toLowerCase().includes(q) ||
    (loc.historicalName && loc.historicalName.toLowerCase().includes(q))
  ).slice(0, limit);
}
