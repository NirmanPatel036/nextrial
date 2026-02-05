'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MCPServer {
    id: string;
    name: string;
    enabled: boolean;
}

interface MCPContextType {
    servers: MCPServer[];
    toggleServer: (id: string) => void;
    enabledServers: string[];
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

const DEFAULT_SERVERS: MCPServer[] = [
    { id: 'clinicaltrials', name: 'ClinicalTrials.gov', enabled: false },
    { id: 'pubmed', name: 'PubMed', enabled: false },
    { id: 'rxnorm', name: 'RxNorm', enabled: false },
];

export function MCPProvider({ children }: { children: React.ReactNode }) {
    const [servers, setServers] = useState<MCPServer[]>(DEFAULT_SERVERS);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('mcp-servers');
        if (stored) {
            try {
                setServers(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse MCP servers from localStorage', e);
            }
        }
    }, []);

    // Save to localStorage whenever servers change
    useEffect(() => {
        localStorage.setItem('mcp-servers', JSON.stringify(servers));
    }, [servers]);

    const toggleServer = (id: string) => {
        setServers((prev) =>
            prev.map((server) =>
                server.id === id ? { ...server, enabled: !server.enabled } : server
            )
        );
    };

    const enabledServers = servers.filter((s) => s.enabled).map((s) => s.id);

    return (
        <MCPContext.Provider value={{ servers, toggleServer, enabledServers }}>
            {children}
        </MCPContext.Provider>
    );
}

export function useMCP() {
    const context = useContext(MCPContext);
    if (!context) {
        throw new Error('useMCP must be used within MCPProvider');
    }
    return context;
}
