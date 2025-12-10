# Cocoon Editor - Workflow Examples

## Example 1: Simple Sequential Workflow

**storage/config.yaml:**
```yaml
project:
  name: "DataProcessor"
  version: "1.0.0"
  
paths:
  input: "./data/input"
  output: "./data/output"
  logs: "./logs"
```

**main.yaml:**
```yaml
blocks:
  - name: "Setup Environment"
    description: "Create necessary directories"
    run: |
      mkdir -p ${config.paths.input}
      mkdir -p ${config.paths.output}
      mkdir -p ${config.paths.logs}
  
  - name: "Process Data"
    description: "Run data processing script"
    run: |
      echo "Starting ${config.project.name} v${config.project.version}"
      python process.py --input ${config.paths.input} --output ${config.paths.output}
  
  - name: "Cleanup"
    description: "Clean temporary files"
    run: rm -rf /tmp/processor_*
```

---

## Example 2: Parallel File Processing

**storage/datasets.yaml:**
```yaml
sources:
  - name: "dataset1"
    url: "https://data.example.com/set1.csv"
  - name: "dataset2"
    url: "https://data.example.com/set2.csv"
  - name: "dataset3"
    url: "https://data.example.com/set3.csv"
```

**main.yaml:**
```yaml
blocks:
  - name: "Create Output Directory"
    run: mkdir -p ./downloads
  
  - parallel:
      - name: "Download Dataset 1"
        run: wget ${datasets.sources[0].url} -O ./downloads/dataset1.csv
      
      - name: "Download Dataset 2"
        run: wget ${datasets.sources[1].url} -O ./downloads/dataset2.csv
      
      - name: "Download Dataset 3"
        run: wget ${datasets.sources[2].url} -O ./downloads/dataset3.csv
  
  - name: "Verify Downloads"
    run: ls -lh ./downloads/
```

---

## Example 3: Multi-Server Deployment

**storage/servers.yaml:**
```yaml
production:
  web1:
    ip: "10.0.1.10"
    user: "deploy"
    pass: "deploy123"
  web2:
    ip: "10.0.1.11"
    user: "deploy"
    pass: "deploy123"
  web3:
    ip: "10.0.1.12"
    user: "deploy"
    pass: "deploy123"

app:
  name: "myapp"
  version: "2.1.0"
```

**main.yaml:**
```yaml
blocks:
  - name: "Build Application"
    description: "Build locally before deployment"
    run: |
      echo "Building ${servers.app.name} v${servers.app.version}"
      npm run build
      tar -czf app.tar.gz dist/
  
  - parallel:
      - name: "Deploy to Web1"
        run-remotely:
          ip: ${servers.production.web1.ip}
          user: ${servers.production.web1.user}
          pass: ${servers.production.web1.pass}
          run: |
            rm -rf /var/www/app
            mkdir -p /var/www/app
            cd /var/www/app
            tar -xzf ~/app.tar.gz
            systemctl restart nginx
          log-into: ./logs/deploy_web1.log
      
      - name: "Deploy to Web2"
        run-remotely:
          ip: ${servers.production.web2.ip}
          user: ${servers.production.web2.user}
          pass: ${servers.production.web2.pass}
          run: |
            rm -rf /var/www/app
            mkdir -p /var/www/app
            cd /var/www/app
            tar -xzf ~/app.tar.gz
            systemctl restart nginx
          log-into: ./logs/deploy_web2.log
      
      - name: "Deploy to Web3"
        run-remotely:
          ip: ${servers.production.web3.ip}
          user: ${servers.production.web3.user}
          pass: ${servers.production.web3.pass}
          run: |
            rm -rf /var/www/app
            mkdir -p /var/www/app
            cd /var/www/app
            tar -xzf ~/app.tar.gz
            systemctl restart nginx
          log-into: ./logs/deploy_web3.log
  
  - name: "Verify Deployment"
    run: |
      echo "Checking server health..."
      curl http://${servers.production.web1.ip}/health
      curl http://${servers.production.web2.ip}/health
      curl http://${servers.production.web3.ip}/health
```

---

## Example 4: Loop Iteration for Directory Setup

**storage/structure.yaml:**
```yaml
projects:
  - name: "project-alpha"
    subdirectories:
      - name: "src"
      - name: "tests"
      - name: "docs"
  
  - name: "project-beta"
    subdirectories:
      - name: "frontend"
      - name: "backend"
      - name: "database"
  
  - name: "project-gamma"
    subdirectories:
      - name: "api"
      - name: "workers"
      - name: "scripts"
```

**main.yaml:**
```yaml
blocks:
  - name: "Create Project Structures"
    for:
      individual: project
      in: ${structure.projects}
      run: |
        echo "Creating ${project.name}..."
        mkdir -p ${project.name}
      for:
        individual: subdir
        in: ${project.subdirectories}
        run: |
          mkdir -p ${project.name}/${subdir.name}
          touch ${project.name}/${subdir.name}/.gitkeep
  
  - name: "List Structure"
    run: tree -L 2
```

---

## Example 5: Database Backup Workflow

**storage/databases.yaml:**
```yaml
postgres:
  host: "db.example.com"
  port: 5432
  databases:
    - name: "production_db"
      user: "admin"
      pass: "secret123"
    - name: "staging_db"
      user: "admin"
      pass: "secret123"

backup:
  path: "/backups/postgres"
  retention_days: 7
```

**main.yaml:**
```yaml
blocks:
  - name: "Prepare Backup Directory"
    run: |
      mkdir -p ${databases.backup.path}
      echo "Starting backup at $(date)" >> ${databases.backup.path}/backup.log
  
  - parallel:
      - name: "Backup Production DB"
        run: |
          PGPASSWORD=${databases.postgres.databases[0].pass} \
          pg_dump -h ${databases.postgres.host} \
                  -p ${databases.postgres.port} \
                  -U ${databases.postgres.databases[0].user} \
                  ${databases.postgres.databases[0].name} \
          > ${databases.backup.path}/prod_$(date +%Y%m%d).sql
      
      - name: "Backup Staging DB"
        run: |
          PGPASSWORD=${databases.postgres.databases[1].pass} \
          pg_dump -h ${databases.postgres.host} \
                  -p ${databases.postgres.port} \
                  -U ${databases.postgres.databases[1].user} \
                  ${databases.postgres.databases[1].name} \
          > ${databases.backup.path}/staging_$(date +%Y%m%d).sql
  
  - name: "Compress Backups"
    run: |
      cd ${databases.backup.path}
      gzip prod_$(date +%Y%m%d).sql
      gzip staging_$(date +%Y%m%d).sql
  
  - name: "Clean Old Backups"
    run: |
      find ${databases.backup.path} -name "*.sql.gz" \
           -mtime +${databases.backup.retention_days} -delete
      echo "Backup completed at $(date)" >> ${databases.backup.path}/backup.log
```

---

## Example 6: CI/CD Pipeline

**storage/cicd.yaml:**
```yaml
app:
  name: "WebApp"
  version: "3.2.1"
  repository: "https://github.com/user/webapp.git"

testing:
  unit_tests: "npm test"
  integration_tests: "npm run test:integration"
  coverage_threshold: 80

deployment:
  staging:
    ip: "10.0.2.10"
    user: "deploy"
    pass: "deploy123"
  production:
    ip: "10.0.1.10"
    user: "deploy"
    pass: "deploy123"
```

**main.yaml:**
```yaml
blocks:
  - name: "Clone Repository"
    run: |
      rm -rf ./build
      git clone ${cicd.app.repository} ./build
      cd ./build
      git checkout main
  
  - name: "Install Dependencies"
    run: |
      cd ./build
      npm install
  
  - parallel:
      - name: "Run Unit Tests"
        run: |
          cd ./build
          ${cicd.testing.unit_tests}
      
      - name: "Run Integration Tests"
        run: |
          cd ./build
          ${cicd.testing.integration_tests}
      
      - name: "Check Code Coverage"
        run: |
          cd ./build
          npm run coverage
  
  - name: "Build Application"
    run: |
      cd ./build
      npm run build
      echo "Built ${cicd.app.name} v${cicd.app.version}"
  
  - name: "Deploy to Staging"
    run-remotely:
      ip: ${cicd.deployment.staging.ip}
      user: ${cicd.deployment.staging.user}
      pass: ${cicd.deployment.staging.pass}
      run: |
        cd /var/www/staging
        git pull origin main
        npm install
        npm run build
        pm2 restart staging-app
      log-into: ./logs/deploy_staging.log
  
  - name: "Run Smoke Tests on Staging"
    run: |
      sleep 5
      curl http://${cicd.deployment.staging.ip}/health
      curl http://${cicd.deployment.staging.ip}/api/version
  
  - name: "Deploy to Production"
    run-remotely:
      ip: ${cicd.deployment.production.ip}
      user: ${cicd.deployment.production.user}
      pass: ${cicd.deployment.production.pass}
      run: |
        cd /var/www/production
        git pull origin main
        npm install
        npm run build
        pm2 restart production-app
      log-into: ./logs/deploy_production.log
  
  - name: "Verify Production Deployment"
    run: |
      echo "Verifying production deployment..."
      curl http://${cicd.deployment.production.ip}/health
      curl http://${cicd.deployment.production.ip}/api/version
      echo "Deployment complete!"
```

---

## Tips for Writing Effective Workflows

### 1. Use Descriptive Names
Always provide clear `name` and `description` fields:
```yaml
- name: "Database Backup"
  description: "Backup PostgreSQL database with compression"
  run: pg_dump ...
```

### 2. Organize Storage Files
Keep related configurations together:
- `servers.yaml` - Server credentials
- `config.yaml` - Application settings
- `databases.yaml` - Database connections
- `paths.yaml` - File system paths

### 3. Use Parallel Execution Wisely
Parallelize independent tasks:
```yaml
parallel:
  - name: "Download Files"
    run: wget ...
  - name: "Compile Code"
    run: gcc ...
  - name: "Run Tests"
    run: npm test
```

### 4. Leverage Loop Iteration
Avoid repetition with loops:
```yaml
for:
  individual: server
  in: ${servers.production}
  run: ssh ${server.user}@${server.ip} "systemctl restart app"
```

### 5. Log Remote Executions
Always specify `log-into` for remote commands:
```yaml
run-remotely:
  ip: ${server.ip}
  user: ${server.user}
  pass: ${server.pass}
  run: deploy.sh
  log-into: ./logs/deploy_${server.ip}.log  # Track output!
```

### 6. Use Multi-line Commands
Keep complex commands readable:
```yaml
run: |
  echo "Starting deployment..."
  cd /app
  git pull
  npm install
  npm run build
  systemctl restart app
  echo "Deployment complete!"
```

### 7. Comment Your Workflows
Add YAML comments for clarity:
```yaml
blocks:
  # Phase 1: Environment Setup
  - name: "Setup"
    run: mkdir -p ./logs ./data
  
  # Phase 2: Data Processing (runs in parallel)
  - parallel:
      - name: "Process A"
        run: python process_a.py
      - name: "Process B"
        run: python process_b.py
```

---

**For more examples, visit the [Cocoon Framework Repository](https://github.com/DebalGhosh100/blocks/tree/main/examples)**
