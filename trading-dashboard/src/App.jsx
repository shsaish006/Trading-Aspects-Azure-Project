import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Terminal as TerminalIcon,
  Network,
  TrendingUp,
  TrendingDown,
  LineChart
} from 'lucide-react';

// Top 50 Companies Seed Data
const initialStocks = [
  { sym: 'AAPL', name: 'Apple Inc.', price: 173.50 }, { sym: 'MSFT', name: 'Microsoft', price: 415.32 },
  { sym: 'NVDA', name: 'NVIDIA Corp', price: 885.14 }, { sym: 'GOOGL', name: 'Alphabet Inc.', price: 155.49 },
  { sym: 'AMZN', name: 'Amazon.com', price: 178.15 }, { sym: 'META', name: 'Meta Platforms', price: 502.30 },
  { sym: 'TSLA', name: 'Tesla Inc.', price: 195.22 }, { sym: 'BRK.B', name: 'Berkshire Hathaway', price: 410.15 },
  { sym: 'LLY', name: 'Eli Lilly', price: 765.40 }, { sym: 'V', name: 'Visa Inc.', price: 275.10 },
  { sym: 'TSM', name: 'TSMC', price: 140.25 }, { sym: 'JPM', name: 'JPMorgan Chase', price: 190.55 },
  { sym: 'UNH', name: 'UnitedHealth', price: 460.20 }, { sym: 'WMT', name: 'Walmart Inc.', price: 60.15 },
  { sym: 'JNJ', name: 'Johnson & Johnson', price: 155.80 }, { sym: 'PG', name: 'Procter & Gamble', price: 160.30 },
  { sym: 'MA', name: 'Mastercard', price: 470.60 }, { sym: 'XOM', name: 'Exxon Mobil', price: 115.45 },
  { sym: 'HD', name: 'Home Depot', price: 375.20 }, { sym: 'COST', name: 'Costco', price: 730.50 },
  { sym: 'MRK', name: 'Merck & Co.', price: 125.80 }, { sym: 'AVGO', name: 'Broadcom', price: 1320.10 },
  { sym: 'CVX', name: 'Chevron', price: 155.40 }, { sym: 'KO', name: 'Coca-Cola', price: 60.25 },
  { sym: 'PEP', name: 'PepsiCo', price: 170.80 }, { sym: 'ABBV', name: 'AbbVie', price: 175.90 },
  { sym: 'BAC', name: 'Bank of America', price: 36.50 }, { sym: 'CRM', name: 'Salesforce', price: 305.20 },
  { sym: 'MCD', name: 'McDonald\'s', price: 280.15 }, { sym: 'LIN', name: 'Linde plc', price: 465.30 },
  { sym: 'CSCO', name: 'Cisco Systems', price: 49.80 }, { sym: 'ACN', name: 'Accenture', price: 340.50 },
  { sym: 'NKE', name: 'NIKE Inc.', price: 95.60 }, { sym: 'PFE', name: 'Pfizer Inc.', price: 27.80 },
  { sym: 'AMD', name: 'Advanced Micro', price: 180.40 }, { sym: 'DHR', name: 'Danaher', price: 250.60 },
  { sym: 'TMO', name: 'Thermo Fisher', price: 580.30 }, { sym: 'NFLX', name: 'Netflix', price: 610.20 },
  { sym: 'ABT', name: 'Abbott Labs', price: 110.50 }, { sym: 'DIS', name: 'Walt Disney', price: 115.60 },
  { sym: 'INTC', name: 'Intel Corp', price: 42.30 }, { sym: 'WFC', name: 'Wells Fargo', price: 56.40 },
  { sym: 'CMCSA', name: 'Comcast', price: 42.10 }, { sym: 'VZ', name: 'Verizon', price: 40.20 },
  { sym: 'TXN', name: 'Texas Instruments', price: 165.80 }, { sym: 'ADBE', name: 'Adobe Inc.', price: 505.40 },
  { sym: 'QCOM', name: 'Qualcomm', price: 168.90 }, { sym: 'IBM', name: 'IBM', price: 190.20 },
  { sym: 'PM', name: 'Philip Morris', price: 92.50 }, { sym: 'UNP', name: 'Union Pacific', price: 240.60 }
].map(s => ({ ...s, change: 0, status: 'neutral', flash: null }));

function App() {
  // Terminal State
  const [terminalLines, setTerminalLines] = useState([
    "Microsoft Windows [Version 10.0.26200.8246]",
    "(c) Microsoft Corporation. All rights reserved.",
    ""
  ]);
  const [currentPrompt, setCurrentPrompt] = useState("C:\\Users\\Admin> ");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Market Feed State
  const [stocks, setStocks] = useState(initialStocks);

  // Nodes Data
  const nodes = [
    { 
      id: "vm-1", name: "VM-1 (EngNode)", ip: "135.235.192.105", 
      subnet: "10.1.0.4", group: "EngGroup", vnet: "vnet-1"
    },
    { 
      id: "vm-2", name: "VM-2 (BizNode)", ip: "20.40.61.108", 
      subnet: "10.2.0.4", group: "BizGroup", vnet: "vnet-2"
    },
    { 
      id: "vm-3", name: "VM-3 (OpsNode)", ip: "20.193.251.237", 
      subnet: "10.3.0.4", group: "OpsGroup", vnet: "vnet-3"
    }
  ];

  // Auto scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines, isTyping]);

  // Keep focus on input
  const handleTerminalClick = () => {
    if (!isTyping) inputRef.current?.focus();
  };

  // Real-time Stock Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => {
        // Pick 3-5 random stocks to update per tick
        const numUpdates = Math.floor(Math.random() * 3) + 3;
        const newStocks = [...prevStocks];
        
        for (let i = 0; i < numUpdates; i++) {
          const idx = Math.floor(Math.random() * newStocks.length);
          const stock = newStocks[idx];
          
          // Random fluctuation between -1.5% and +1.5%
          const changePercent = (Math.random() * 3 - 1.5) / 100;
          const priceChange = stock.price * changePercent;
          const newPrice = Math.max(0.01, stock.price + priceChange);
          
          newStocks[idx] = {
            ...stock,
            price: newPrice,
            change: priceChange,
            status: priceChange >= 0 ? 'up' : 'down',
            flash: priceChange >= 0 ? 'flash-up' : 'flash-down'
          };
          
          // Reset flash animation class after 1s
          setTimeout(() => {
            setStocks(current => {
              const cleaned = [...current];
              if (cleaned[idx]) cleaned[idx].flash = null;
              return cleaned;
            });
          }, 1000);
        }
        return newStocks;
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Terminal Command Logic
  const handleCommandSubmit = async (e) => {
    if (e.key === 'Enter' && !isTyping) {
      const cmd = inputValue.trim();
      setInputValue("");
      
      setTerminalLines(prev => [...prev, `${currentPrompt}${cmd}`]);
      if (cmd === "") return;

      if (cmd === "clear" || cmd === "cls") {
        setTerminalLines([]);
        return;
      }

      if (cmd === "exit") {
        setCurrentPrompt("C:\\Users\\Admin> ");
        setTerminalLines(prev => [...prev, "logout", "Connection closed."]);
        return;
      }

      setIsTyping(true);

      // Simulate SSH
      if (cmd.startsWith("ssh")) {
        const ipMatch = cmd.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/);
        const ip = ipMatch ? ipMatch[0] : "135.235.192.105";
        
        if (currentPrompt.includes("vm-3") && cmd.includes("vm2")) {
           const failSequence = [
            `Warning: Identity file vm2_key.pem not accessible: No such file or directory.`,
            `The authenticity of host '${ip} (${ip})' can't be established.`,
            `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes`,
            `azureuser@${ip}: Permission denied (publickey).`
          ];
          for (let line of failSequence) {
            await new Promise(r => setTimeout(r, 400));
            setTerminalLines(prev => [...prev, line]);
          }
        } else {
          const sshSequence = [
            `The authenticity of host '${ip} (${ip})' can't be established.`,
            `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes`,
            `Warning: Permanently added '${ip}' (ED25519) to the list of known hosts.`,
            ``,
            `Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.17.0-1013-azure x86_64)`,
            ` * Documentation:  https://help.ubuntu.com`,
            ``,
            `System load: 0.08  Processes: 135`
          ];
          for (let line of sshSequence) {
            await new Promise(r => setTimeout(r, 300));
            setTerminalLines(prev => [...prev, line]);
          }
          const node = nodes.find(n => n.ip === ip) || nodes[0];
          setCurrentPrompt(`azureuser@${node.id}:~$ `);
        }
      } 
      // Simulate PING
      else if (cmd.startsWith("ping")) {
        const target = cmd.split(" ")[1] || "10.2.0.4";
        setTerminalLines(prev => [...prev, `PING ${target} (${target}) 56(84) bytes of data.`]);
        
        if (target === "10.3.0.4" && currentPrompt.includes("vm-1")) {
          await new Promise(r => setTimeout(r, 2000));
          setTerminalLines(prev => [...prev, `... Request timeout for icmp_seq 1`, `... Request timeout for icmp_seq 2`]);
        } else {
          for (let i = 1; i <= 4; i++) {
            await new Promise(r => setTimeout(r, 800));
            setTerminalLines(prev => [...prev, `64 bytes from ${target}: icmp_seq=${i} ttl=64 time=${(Math.random() * 2 + 1).toFixed(2)} ms`]);
          }
        }
      }
      else {
        await new Promise(r => setTimeout(r, 100));
        setTerminalLines(prev => [...prev, `bash: ${cmd}: command not found`]);
      }

      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const simulateButtonAction = (command) => {
    setInputValue(command);
    handleCommandSubmit({ key: 'Enter' });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header glass-panel">
        <div className="header-brand">
          <Network size={32} color="var(--primary)" />
          <h1 className="text-gradient">Algorithmic Trading & Infrastructure Topology</h1>
        </div>
        <div className="profile-section">
          <div className="avatar">SA</div>
        </div>
      </header>

      {/* Main Grid: 3 Columns */}
      <div className="main-grid">
        
        {/* Left Column: Virtual Machines */}
        <div className="nodes-panel">
          <h2 className="section-title"><Server size={24} color="var(--primary)" /> Deployed Nodes</h2>
          {nodes.map(node => (
            <div key={node.id} className="node-card glass-panel">
              <div className="node-info">
                <div className="node-icon">
                  <Server size={28} />
                  <div className="status-indicator"></div>
                </div>
                <div className="node-details">
                  <h3>{node.name}</h3>
                  <p>IP: <span style={{color: 'var(--primary)'}}>{node.ip}</span></p>
                  <p>Sub: {node.subnet}</p>
                </div>
              </div>
              <div className="btn-group">
                <button 
                  className="btn-connect" 
                  onClick={() => {
                    setCurrentPrompt("C:\\Users\\Admin> ");
                    simulateButtonAction(`ssh -i ${node.id}_key.pem azureuser@${node.ip}`);
                  }}
                  disabled={isTyping}
                >
                  SSH
                </button>
                {node.id === 'vm-3' && (
                  <button 
                    className="btn-connect btn-danger" 
                    onClick={() => {
                      setCurrentPrompt("azureuser@vm-3:~$ ");
                      simulateButtonAction(`ssh -i vm2_key.pem azureuser@20.40.61.108`);
                    }}
                    disabled={isTyping}
                  >
                    Test Block
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center Column: Interactive Terminal */}
        <div className="terminal-card glass-panel" onClick={handleTerminalClick}>
          <div className="terminal-header">
            <div className="terminal-dots">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="terminal-title">Interactive Cloud Terminal</div>
          </div>
          <div className="terminal-body">
            {terminalLines.map((line, idx) => {
              if (line.includes('Permission denied') || line.includes('Warning:') || line.includes('timeout')) {
                return <div key={idx} className="terminal-output terminal-error">{line}</div>;
              }
              if (line.includes('~$') || line.includes('C:\\')) {
                return <div key={idx} className="terminal-output terminal-prompt">{line}</div>;
              }
              return <div key={idx} className="terminal-output">{line}</div>;
            })}
            
            {!isTyping && (
              <div className="terminal-input-row">
                <span className="terminal-prompt">{currentPrompt}</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  className="terminal-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleCommandSubmit}
                  autoFocus
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Right Column: Top 50 Market Feed */}
        <div className="market-feed-card glass-panel">
          <div className="market-header">
            <h2 className="section-title"><LineChart size={24} color="var(--primary)" /> Top 50 Global Feed</h2>
          </div>
          <div className="market-list">
            {stocks.map(stock => (
              <div key={stock.sym} className={`stock-item ${stock.flash || ''}`}>
                <div className="stock-info">
                  <div style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    {stock.status === 'up' ? <TrendingUp size={18} color="var(--success)"/> : <TrendingDown size={18} color="var(--danger)"/>}
                  </div>
                  <div>
                    <div className="stock-symbol">{stock.sym}</div>
                    <div className="stock-name">{stock.name}</div>
                  </div>
                </div>
                <div className="stock-price-container">
                  <div className={`stock-price ${stock.status === 'up' ? 'price-up' : 'price-down'}`}>
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className={`stock-change ${stock.status === 'up' ? 'price-up' : 'price-down'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
