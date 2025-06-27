const os = require("os")
const path = require("path")

console.log("🚀 BRIGHT ORION MLM SYSTEM - LOCALHOST SETUP")
console.log("=".repeat(50))

// Get network interfaces
const networkInterfaces = os.networkInterfaces()
let localIP = "localhost"

// Find the first non-internal IPv4 address
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName]
  for (const iface of interfaces) {
    if (iface.family === "IPv4" && !iface.internal) {
      localIP = iface.address
      break
    }
  }
  if (localIP !== "localhost") break
}

console.log("📍 SYSTEM INFORMATION:")
console.log(`   Platform: ${os.platform()}`)
console.log(`   Architecture: ${os.arch()}`)
console.log(`   Node Version: ${process.version}`)
console.log(`   Project Directory: ${process.cwd()}`)
console.log("")

console.log("🌐 NETWORK INFORMATION:")
console.log(`   Localhost URL: http://localhost:3000`)
console.log(`   Network IP: ${localIP}`)
console.log(`   Network URL: http://${localIP}:3000`)
console.log("")

console.log("🔐 LOGIN CREDENTIALS:")
console.log("   👨‍💼 ADMIN LOGIN:")
console.log("      Email: admin@brightorian.com")
console.log("      Password: Admin123!")
console.log("      Member ID: BO000001")
console.log("")
console.log("   👤 USER LOGIN:")
console.log("      Email: john.doe@brightorian.com")
console.log("      Password: User123!")
console.log("      Member ID: BO000002")
console.log("      Balance: ₦35,000")
console.log("")

console.log("🚀 QUICK START COMMANDS:")
console.log("   npm run dev          - Start localhost only")
console.log("   npm run dev-network  - Start with network access")
console.log("   npm run reset-db     - Reset database")
console.log("")

console.log("📱 IMPORTANT URLS:")
console.log(`   Homepage: http://localhost:3000`)
console.log(`   Admin Panel: http://localhost:3000/admin`)
console.log(`   User Dashboard: http://localhost:3000/dashboard`)
console.log(`   Login Page: http://localhost:3000/auth/login`)
console.log(`   Database Init: http://localhost:3000/api/init`)
console.log("")

console.log("🎯 NEXT STEPS:")
console.log("   1. Run: npm run dev")
console.log("   2. Visit: http://localhost:3000/api/init")
console.log("   3. Login with admin credentials")
console.log("   4. Test all features")
console.log("")

console.log("✅ Setup complete! Your MLM system is ready to run on localhost.")
