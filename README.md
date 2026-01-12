# Repartilo Frontend

Modern React frontend for the Repartilo route optimization platform. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ✅ **Excel File Upload** - Drag-and-drop Excel validation
- 🗺️ **Interactive Map** - Real-time route visualization with Leaflet
- 📊 **Metrics Dashboard** - Comprehensive optimization statistics
- 📱 **QR Code Generation** - Generate QR codes for drivers
- 🎨 **Modern UI** - Clean, professional design matching landing page
- 🚀 **Optimized Performance** - Fast loading and smooth interactions

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React-Leaflet** - Interactive maps
- **Zustand** - State management
- **Axios** - API client
- **Framer Motion** - Animations
- **React-Dropzone** - File upload

## Quick Start

### Prerequisites

- Node.js 18+ installed
- API backend running at http://localhost:8000

### Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API URL
nano .env

# Start development server
npm run dev

# Open http://localhost:3002
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── excel-upload.tsx     # File upload component
│   ├── validation-results.tsx # Validation display
│   ├── route-map.tsx        # Interactive map
│   ├── metrics-dashboard.tsx # Statistics
│   ├── qr-code-display.tsx  # QR code generator
│   ├── header.tsx           # App header
│   ├── step-indicator.tsx   # Progress stepper
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── services/
│   └── api.ts               # API client
├── lib/
│   ├── store.ts             # Zustand state management
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript types
├── public/                  # Static assets
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## User Flow

1. **Upload Excel File**
   - Drag-and-drop or click to upload
   - Download template if needed
   - Real-time validation

2. **Review Validation**
   - See validated vehicles
   - Check geocoded deliveries
   - View confidence scores

3. **Optimize Routes**
   - Click "Optimize Routes"
   - Wait for optimization
   - View results

4. **View Results**
   - Interactive map with routes
   - Detailed metrics per vehicle
   - QR codes for drivers
   - Download options

## API Integration

The frontend connects to the FastAPI backend:

```typescript
// services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Endpoints used:
- POST /api/v1/validate-excel
- POST /api/v1/optimize-routes
- POST /api/v1/qr-codes
- GET  /api/v1/template/download
```

## State Management

Uses Zustand for global state:

```typescript
interface OptimizationState {
  vehicles: Vehicle[];
  deliveries: Delivery[];
  routes: VehicleRoute[];
  currentStep: 'upload' | 'validated' | 'optimized';
  isLoading: boolean;
  error: string | null;
}
```

## Styling

### Color Palette (Matches Landing Page)

```css
Primary: #FF6B35  /* Orange */
Success: #10B981  /* Green */
Warning: #F59E0B  /* Amber */
Error: #EF4444    /* Red */
Background: #FFFFFF
Border: #E5E7EB
```

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Fluid typography and spacing

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional (for future auth)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect GitHub repo to Vercel dashboard.

### Docker

```bash
# Build image
docker build -t repartilo-frontend .

# Run container
docker run -d \
  -p 3002:3002 \
  -e NEXT_PUBLIC_API_URL=http://api:8000 \
  repartilo-frontend
```

### Other Platforms

- **Railway**: `railway up`
- **Fly.io**: `fly deploy`
- **Netlify**: Connect GitHub repo
- **AWS/GCP/Azure**: Use container services

## Development Tips

### Hot Reload

Changes to files automatically trigger hot reload:
- Components: Instant update
- API calls: May require page refresh
- Environment variables: Requires restart

### Debugging

```bash
# Enable verbose logging
export DEBUG=*

# Check API connectivity
curl http://localhost:8000/api/v1/health

# View build output
npm run build -- --debug
```

### Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

## Performance Optimization

- **Code splitting** - Automatic with Next.js
- **Image optimization** - Next.js Image component
- **Dynamic imports** - For heavy components (Leaflet)
- **API caching** - React Query (future)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Map not displaying

```bash
# Check Leaflet CSS is loaded
# Should be in <head> of app/layout.tsx
```

### API connection errors

```bash
# Check API URL in .env
echo $NEXT_PUBLIC_API_URL

# Test API
curl http://localhost:8000/api/v1/health
```

### Build errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## License

Proprietary - All rights reserved

## Support

For issues or questions:
- GitHub Issues
- Email: support@repartilo.com
