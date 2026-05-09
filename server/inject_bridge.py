import os

target = "server/_core/index.ts"
with open(target, 'r') as f:
    lines = f.readlines()

# Add the import at the top
lines.insert(0, 'import { setupCustomRoutes } from "../custom-bridge";\n')

# Find the app initialization and inject the routes
for i, line in enumerate(lines):
    if "const app = express()" in line:
        lines.insert(i + 1, "  setupCustomRoutes(app);\n")
        break

with open(target, 'w') as f:
    f.writelines(lines)
