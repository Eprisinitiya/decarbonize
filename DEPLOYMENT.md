# Decarbonize Deployment Guide

## System Requirements

- **Node.js**: v22.16.0 (or v20.x to v22.x as specified in package.json)
- **npm**: v10.0.0 or higher

## Pre-Deployment Checklist

1. **Node Version**
   ```bash
   node --version  # Should be v20.x or v22.x
   npm --version   # Should be v10.x or higher
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Build**
   ```bash
   npm run build
   ```
   Should generate a `dist/` folder with optimized assets.

## Deployment Steps

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment Targets

### Firebase Hosting (Recommended for React Apps)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Docker Deployment
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t decarbonize:latest .
docker run -p 3000:3000 decarbonize:latest
```

## Environment Variables

Create a `.env.production` file if needed:
```
VITE_API_URL=https://api.example.com
VITE_FIREBASE_CONFIG=your_config_here
```

## Build Optimization Notes

- Current bundle size: ~908KB (247KB gzipped)
- Consider code-splitting for better performance if needed
- The app uses Vite for fast builds and optimized output

## Troubleshooting

### Node Version Issues
If you encounter issues, ensure you're using Node 20 or 22:
```bash
nvm use 22
# or
nvm use 20
```

### Build Failures
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance Optimization

Future improvements:
- Dynamic import() for code-splitting
- Manual chunk configuration in vite.config.js
- Consider lazy loading routes

## Support
For issues or questions, refer to:
- React: https://react.dev
- Vite: https://vitejs.dev
- Firebase: https://firebase.google.com
