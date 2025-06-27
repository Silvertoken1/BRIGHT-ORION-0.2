const os = require("os")

function getNetworkIP() {
  const interfaces = os.networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address
      }
    }
  }

  return "localhost"
}

const networkIP = getNetworkIP()

console.log("\n🌐 NETWORK SETUP COMPLETE!")
console.log("================================")
console.log(`📱 Local Access: http://localhost:3000`)
console.log(`🌍 Network Access: http://${networkIP}:3000`)
console.log("================================")
console.log("🔐 LOGIN CREDENTIALS:")
console.log("--------------------------------")
console.log("👨‍💼 ADMIN LOGIN:")
console.log("   Email: admin@brightorian.com")
console.log("   Password: Admin123!")
console.log("   Member ID: BO000001")
console.log("--------------------------------")
console.log("👤 USER LOGIN:")
console.log("   Email: john.doe@brightorian.com")
console.log("   Password: User123!")
console.log("   Member ID: BO000002")
console.log("   Balance: ₦35,000")
console.log("================================")
console.log("📋 TESTING CHECKLIST:")
console.log("✅ Admin Panel: /admin")
console.log("✅ User Dashboard: /dashboard")
console.log("✅ Registration: /auth/register")
console.log("✅ Login: /auth/login")
console.log("✅ Mobile Responsive: Test on phone")
console.log("================================\n")

module.exports = { getNetworkIP }
