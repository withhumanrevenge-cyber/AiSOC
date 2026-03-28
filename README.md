# AiSOC Threat Visualizer 🛡️

A high-fidelity, interactive security operations center (SOC) dashboard designed to transform raw JSON security logs into actionable intelligence.

![AiSOC Dashboard](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## 🚀 Features

- **Interactive Threat Topology**: Visualize attack paths and clustering using custom React Flow nodes.
- **Geopolitical Intel Map**: Real-time Geo-IP mapping of source addresses using `react-simple-maps`.
- **AI-Driven Remediation**: Automated threat analysis and patching advice powered by **Groq (Llama 3.3 70B)**.
- **Kinetic Dashboard**: Cyberpunk-themed UI with real-time "Live Feed" simulations and activity streams.
- **Time-Series Analysis**: Frequency charts to identify burst attacks and persistent threats.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion, Aceternity UI
- **Visualization**: React Flow (xyflow), Recharts, React Simple Maps
- **AI Engine**: Groq SDK (Llama 3.3)
- **Icons**: Lucide React

## 📦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/withhumanrevenge-cyber/AiSOC.git
   cd AiSOC
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root:
   ```env
   GROQ_API_KEY=your_apiKey_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📄 License

MIT © [WithHumanRevenge-Cyber](https://github.com/withhumanrevenge-cyber)
