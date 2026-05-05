'use client';
import { useState } from 'react';
import { IndianRupee, Save } from 'lucide-react';

export default function FranchiseFees() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: 0 }}>FEE <span style={{ color: '#E91E63' }}>MANAGER</span></h1>
            </div>

            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <IndianRupee size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#334155' }}>Fee Management Module</h3>
                <p style={{ color: '#64748b' }}>Track student installments and outstanding payments here.</p>
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#ffe4e6', color: '#be123c', borderRadius: '8px', display: 'inline-block' }}>
                    Mock View - Under Construction
                </div>
            </div>
        </div>
    )
}
