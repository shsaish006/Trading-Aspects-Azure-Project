import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Server, 
  Terminal as TerminalIcon,
  Network
} from 'lucide-react';

function App() {
  const [terminalLines, setTerminalLines] = useState([
    "Microsoft Windows [Version 10.0.26200.8246]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\Admin> "
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef(null);

  const nodes = [
    { 
      id: "vm-1", 
      name: "VM-1 (EngNode)", 
      ip: "135.235.192.105", 
      subnet: "10.1.0.4",
      group: "EngGroup",
      vnet: "vnet-1"
    },
    { 
      id: "vm-2", 
      name: "VM-2 (BizNode)", 
      ip: "20.40.61.108", 
      subnet: "10.2.0.4",
      group: "BizGroup",
      vnet: "vnet-2"
    },
    { 
      id: "vm-3", 
      name: "VM-3 (OpsNode)", 
      ip: "20.193.251.237", 
      subnet: "10.3.0.4",
      group: "OpsGroup",
      vnet: "vnet-3"
    }
  ];

  const simulateSSH = async (node) => {
    if (isTyping) return;
    setIsTyping(true);

    const command = `ssh -i ${node.id}_key.pem azureuser@${node.ip}`;
    setTerminalLines(prev => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = `C:\\Users\\Admin\\Downloads> ${command}`;
      return newLines;
    });

    const sequence = [
      `The authenticity of host '${node.ip} (${node.ip})' can't be established.`,
      `ED25519 key fingerprint is SHA256:G1KuoKwzJdP0OgXeP6ZeIOVQ6CgvOWZr+gYGnafybNc.`,
      `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes`,
      `Warning: Permanently added '${node.ip}' (ED25519) to the list of known hosts.`,
      ``,
      `Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.17.0-1013-azure x86_64)`,
      ` * Documentation:  https://help.ubuntu.com`,
      ` * Management:     https://landscape.canonical.com`,
      ` * Support:        https://ubuntu.com/pro`,
      ``,
      ` System information as of Wed May 13 19:03:09 UTC 2026`,
      `  System load:  0.08              Processes:             135`,
      `  Usage of /:   5.4% of 28.02GB   Users logged in:       0`,
      `  Memory usage: 3%                IPv4 address for eth0: ${node.subnet}`,
      ``,
      `azureuser@${node.id}:~$ ip a`,
      `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN`,
      `    inet 127.0.0.1/8 scope host lo`,
      `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP`,
      `    inet ${node.subnet}/24 metric 100 brd 10.1.0.255 scope global eth0`,
      ``,
      `azureuser@${node.id}:~$ `
    ];

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 300 + 100)); // random delay 100-400ms
      setTerminalLines(prev => [...prev, sequence[i]]);
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setIsTyping(false);
  };

  const simulateCrossConnectFail = async (sourceNode, targetNode) => {
    if (isTyping) return;
    setIsTyping(true);

    const command = `ssh -i ${targetNode.id}_key.pem azureuser@${targetNode.ip}`;
    
    setTerminalLines(prev => {
      let newLines = [...prev];
      if (!newLines[newLines.length - 1].includes("~$")) {
        newLines.push(`azureuser@${sourceNode.id}:~$ ${command}`);
      } else {
        newLines[newLines.length - 1] = `azureuser@${sourceNode.id}:~$ ${command}`;
      }
      return newLines;
    });

    const sequence = [
      `Warning: Identity file ${targetNode.id}_key.pem not accessible: No such file or directory.`,
      `The authenticity of host '${targetNode.ip} (${targetNode.ip})' can't be established.`,
      `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes`,
      `Warning: Permanently added '${targetNode.ip}' (ED25519) to the list of known hosts.`,
      `azureuser@${targetNode.ip}: Permission denied (publickey).`,
      `azureuser@${sourceNode.id}:~$ `
    ];

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
      setTerminalLines(prev => [...prev, sequence[i]]);
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setIsTyping(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header glass-panel">
        <div className="header-brand">
          <Network size={32} color="var(--primary)" />
          <h1 className="text-gradient">Infrastructure Topology Dashboard</h1>
        </div>
        <div className="profile-section">
          <div className="avatar">SA</div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="main-grid">
        
        {/* Left Column: Virtual Machines */}
        <div>
          <h2 className="section-title"><Server size={24} color="var(--primary)" /> Deployed Nodes</h2>
          <div className="node-grid">
            {nodes.map(node => (
              <div key={node.id} className="node-card glass-panel">
                <div className="node-info">
                  <div className="node-icon">
                    <Server size={32} />
                    <div className="status-indicator"></div>
                  </div>
                  <div className="node-details">
                    <h3>{node.name}</h3>
                    <p>Public IP: <span style={{color: 'var(--primary)'}}>{node.ip}</span></p>
                    <p>Subnet: {node.subnet} ({node.vnet})</p>
                    <p style={{fontSize: '0.8rem', color: 'var(--accent)'}}>Group: {node.group}</p>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <button 
                    className="btn-connect" 
                    onClick={() => simulateSSH(node)}
                    disabled={isTyping}
                  >
                    SSH Connect
                  </button>
                  {node.id === 'vm-3' && (
                    <button 
                      className="btn-connect" 
                      style={{borderColor: 'var(--danger)', color: 'var(--danger)'}}
                      onClick={() => simulateCrossConnectFail(node, nodes[0])}
                      disabled={isTyping}
                    >
                      Test Peering Block
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Terminal */}
        <div className="terminal-card glass-panel">
          <div className="terminal-header">
            <div className="terminal-dots">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="terminal-title">azureuser@trading-aspects:~</div>
          </div>
          <div className="terminal-body">
            {terminalLines.map((line, idx) => {
              if (line.includes('Permission denied') || line.includes('Warning:')) {
                return <div key={idx} className="terminal-output terminal-error">{line}</div>;
              }
              if (line.includes('~$') || line.includes('C:\\')) {
                return <div key={idx} className="terminal-output terminal-prompt">{line}{idx === terminalLines.length - 1 && !isTyping ? <span className="blinking-cursor"></span> : null}</div>;
              }
              return <div key={idx} className="terminal-output">{line}</div>;
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
