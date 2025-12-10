# Deploy Cocoon Editor - Free Hosting Options

Your app is built and ready in the `dist` folder!

## 🚀 Option 1: Netlify Drop (EASIEST - No account needed initially)

1. Go to: https://app.netlify.com/drop
2. Drag the entire `dist` folder into the browser
3. Get instant URL: `https://random-name.netlify.app`
4. **You're done!** No signup required for the drop.

## 🚀 Option 2: Vercel (Best for long-term)

1. Go to: https://vercel.com/signup
2. Sign up with GitHub (free)
3. Click "Add New Project"
4. Click "Deploy" button
5. In terminal, run:
   ```bash
   cd /home/debalgho/UI-Testing
   npx vercel --prod
   ```
6. Follow prompts (press enter for defaults)
7. Get URL: `https://your-project.vercel.app`

## 🚀 Option 3: Surge (Command line - Very Fast)

Run these commands:
```bash
cd /home/debalgho/UI-Testing/dist
npx surge
```

First time: Enter email and password to create account
Choose a subdomain: `cocoon-editor.surge.sh` (or any available name)

Your app will be live at: `https://cocoon-editor.surge.sh`

## 🚀 Option 4: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Set source to: "GitHub Actions"
4. Add this file as `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📁 Your Built Files

Location: `/home/debalgho/UI-Testing/dist/`

The `dist` folder contains all static files ready to deploy anywhere!
