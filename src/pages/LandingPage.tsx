import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-accent/20">
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 select-none relative z-20">
        <div className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <span className="text-foreground text-lg">✦</span>
          <span className="font-semibold">Velora</span>
          <span className="text-[9px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-mono font-medium">ERP</span>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Modules</a>
            <a href="#technology" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Technology</a>
          </nav>
          <Link 
            to="/login" 
            className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:shadow-sm"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-start pt-12 md:pt-16 px-6 overflow-hidden pb-16">
        {/* Background Scenic Video for Premium Aesthetic */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground font-body mb-6 shadow-sm font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Next-Generation Wholesale ERP & CRM</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-[4.8rem] leading-[0.95] tracking-tight text-foreground max-w-2xl"
          >
            Manage Your Business Operations, <span className="italic font-normal">All in One</span> Place
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-center text-base md:text-lg text-muted-foreground max-w-[650px] leading-relaxed font-body"
          >
            An integrated, lightning-fast ERP & CRM platform tailored for wholesale distributors and manufacturers. Streamline inventories, customer relations, dispatch challans, and analytics instantly.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center gap-3"
          >
            <Link 
              to="/login" 
              className="bg-primary text-primary-foreground rounded-full px-6 py-4 text-sm font-medium font-body transition-all hover:opacity-95 hover:shadow-md active:scale-95 flex items-center justify-center"
            >
              Login
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-white/80 hover:bg-white text-foreground border border-border/80 backdrop-blur rounded-full px-6 py-4 text-sm font-medium font-body transition-all hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Realistic ERP Dashboard Preview Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 w-full max-w-5xl"
          >
            <div 
              className="rounded-2xl overflow-hidden p-3 md:p-4 backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: 'var(--shadow-dashboard)',
              }}
            >
              {/* Coded ERP Dashboard Layout Mock */}
              <div className="w-full bg-[#FCFCFD] text-[#22252A] rounded-xl overflow-hidden shadow-2xl flex flex-col text-[10px] select-none pointer-events-none font-body border border-border/80 h-[360px]">
                {/* Header bar */}
                <div className="h-10 border-b border-border bg-white px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary text-white flex items-center justify-center rounded font-semibold text-[10px]">V</div>
                    <span className="font-semibold">Velora Workstation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary px-2 py-0.8 rounded text-[9px] text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full"></span>
                      Warehouse Sync: Active
                    </div>
                    <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center font-semibold text-[8px]">AH</div>
                  </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  {/* Left mini sidebar */}
                  <div className="w-32 border-r border-border bg-white p-2.5 space-y-3">
                    <div className="space-y-1">
                      <div className="bg-secondary text-foreground font-medium px-2 py-1 rounded">Overview</div>
                      <div className="text-muted-foreground px-2 py-1">Customer Directory</div>
                      <div className="text-muted-foreground px-2 py-1 flex items-center justify-between">
                        <span>Inventory</span>
                        <span className="bg-[#FFEFE6] text-[#FF6B00] px-1 rounded-full text-[7px] font-semibold">14</span>
                      </div>
                      <div className="text-muted-foreground px-2 py-1">Sales Challans</div>
                      <div className="text-muted-foreground px-2 py-1">Reports & Ledger</div>
                    </div>
                  </div>

                  {/* Main contents */}
                  <div className="flex-1 bg-secondary/20 p-4 space-y-4 overflow-hidden">
                    {/* Metrics grid */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white border border-border p-3 rounded-lg">
                        <div className="text-muted-foreground text-[8px] uppercase tracking-wider font-semibold">Active Customers</div>
                        <div className="text-sm font-bold mt-0.5 text-foreground">1,482</div>
                        <div className="text-[#00A86B] text-[8px] font-semibold mt-0.5">+4% MoM</div>
                      </div>
                      <div className="bg-white border border-border p-3 rounded-lg">
                        <div className="text-muted-foreground text-[8px] uppercase tracking-wider font-semibold">Total SKUs</div>
                        <div className="text-sm font-bold mt-0.5 text-foreground">840</div>
                        <div className="text-muted-foreground text-[8px] mt-0.5">3 Categories</div>
                      </div>
                      <div className="bg-white border border-border p-3 rounded-lg border-l-2 border-l-[#FF6B00]">
                        <div className="text-muted-foreground text-[8px] uppercase tracking-wider font-semibold">Low Stock Alert</div>
                        <div className="text-sm font-bold mt-0.5 text-[#FF6B00]">14 Items</div>
                        <div className="text-muted-foreground text-[8px] mt-0.5">Reorder limits breached</div>
                      </div>
                      <div className="bg-white border border-border p-3 rounded-lg">
                        <div className="text-muted-foreground text-[8px] uppercase tracking-wider font-semibold">Pending Dispatch</div>
                        <div className="text-sm font-bold mt-0.5 text-foreground">12 Challans</div>
                        <div className="text-[#00A86B] text-[8px] font-semibold mt-0.5">8 In Packing</div>
                      </div>
                    </div>

                    {/* Stock activity row */}
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      {/* Left: Dispatch Activity */}
                      <div className="col-span-2 bg-white border border-border rounded-lg p-3 flex flex-col justify-between">
                        <div className="font-semibold text-foreground text-[9px] mb-2">Live Warehouse Shipments</div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[8px] py-1 border-b border-border/40">
                            <span className="font-medium">Acme Corp (#CH-409)</span>
                            <span className="text-muted-foreground font-mono">14 pallets • Electronics</span>
                            <span className="bg-[#E6FCF5] text-[#099268] px-1.5 py-0.2 rounded font-semibold">Completed</span>
                          </div>
                          <div className="flex justify-between items-center text-[8px] py-1 border-b border-border/40">
                            <span className="font-medium">Apex Wholesale (#CH-410)</span>
                            <span className="text-muted-foreground font-mono">3 pallets • Office Goods</span>
                            <span className="bg-[#FFF9DB] text-[#F59F00] px-1.5 py-0.2 rounded font-semibold">In Packing</span>
                          </div>
                          <div className="flex justify-between items-center text-[8px] py-1">
                            <span className="font-medium">Zenith Retailers (#CH-411)</span>
                            <span className="text-muted-foreground font-mono">22 boxes • Textiles</span>
                            <span className="bg-[#E6FCF5] text-[#099268] px-1.5 py-0.2 rounded font-semibold">Completed</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Stock Levels Mini SVG */}
                      <div className="bg-white border border-border rounded-lg p-3 flex flex-col justify-between">
                        <div className="font-semibold text-foreground text-[9px]">Inventory Movement</div>
                        <div className="h-14 w-full flex items-end justify-between px-1">
                          <div className="w-3 bg-primary/40 rounded-t h-[30%]"></div>
                          <div className="w-3 bg-primary/60 rounded-t h-[50%]"></div>
                          <div className="w-3 bg-primary/40 rounded-t h-[40%]"></div>
                          <div className="w-3 bg-primary/80 rounded-t h-[75%]"></div>
                          <div className="w-3 bg-accent rounded-t h-[90%]"></div>
                        </div>
                        <div className="text-[7px] text-muted-foreground text-center">Jul 18 - Jul 22 stock fluctuations</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section id="modules" className="py-20 bg-white border-y border-border px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">
              Powerful Core Modules Built for B2B Scale
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every tool required to run your wholesale operations efficiently, with real-time sync across multi-user environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-secondary/40 border border-border/80 rounded-xl p-5 hover:border-accent/40 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">Customer CRM</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log leads, manage client accounts, track follow-ups, and organize wholesale communication streams.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-secondary/40 border border-border/80 rounded-xl p-5 hover:border-accent/40 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">Inventory Management</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maintain product listings, track stock counts, log SKU locations, and handle low stock reorders.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-secondary/40 border border-border/80 rounded-xl p-5 hover:border-accent/40 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">Sales Challans</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate delivery challans, log product dispatches, verify shipments, and manage proof of delivery.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-secondary/40 border border-border/80 rounded-xl p-5 hover:border-accent/40 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">Analytics & Audits</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review margins, trace item movement flows, audit warehouse locations, and export custom Excel ledgers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 bg-secondary/20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">
              Modern Technology Stack, Maximum Security
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Velora is engineered with enterprise reliability at its core. From sub-millisecond page rendering to advanced role privileges, the technology architecture guarantees top-tier compliance.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-sm text-accent">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[11px] text-foreground">React + TypeScript</h4>
                  <p className="text-[10px] text-muted-foreground">Type-safe components and highly responsive interactive interfaces.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-sm text-accent">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[11px] text-foreground">Role-Based Access Control</h4>
                  <p className="text-[10px] text-muted-foreground">Isolate and secure actions based on Admin, Sales, Warehouse, or Accounting profiles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-sm text-accent">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[11px] text-foreground">Flexible State Sync</h4>
                  <p className="text-[10px] text-muted-foreground">State operations cached with fast local recovery fallback structures.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Integrated Modules Ledger</h3>
            <div className="space-y-2">
              <div className="p-3 bg-secondary/40 border border-border/60 rounded-lg flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-foreground">Customer CRM API</span>
                </div>
                <span className="text-muted-foreground font-mono text-[9px]">v1.4.0-stable</span>
              </div>
              <div className="p-3 bg-secondary/40 border border-border/60 rounded-lg flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                  <span className="font-medium text-foreground">Inventory Manager</span>
                </div>
                <span className="text-muted-foreground font-mono text-[9px]">v1.2.2-stable</span>
              </div>
              <div className="p-3 bg-secondary/40 border border-border/60 rounded-lg flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                  <span className="font-medium text-foreground">Sales Challan Compiler</span>
                </div>
                <span className="text-muted-foreground font-mono text-[9px]">v2.0.1-RC1</span>
              </div>
            </div>
            <div className="pt-2 text-center">
              <span className="text-[9px] text-muted-foreground">Certified compliance standards • SSAE 18 SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-white px-6 md:px-12 lg:px-20 py-8 font-body">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm">✦</span>
            <span className="font-semibold text-foreground text-xs">Velora Systems, Inc.</span>
          </div>
          <div className="flex items-center gap-8 text-[11px] text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Guidelines</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Velora. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
