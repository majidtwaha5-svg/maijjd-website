import React, { useState } from 'react';
import AIChatWidget from '../components/AIChatWidget';

const AIChatDemo = () => {
  const [open, setOpen] = useState(true);
  const [software, setSoftware] = useState({ name: 'MJND Chat Assistant' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MJND Chat Assistant</h1>
        <p className="text-gray-600 mb-6">
          Use the widget to chat with the AI. Type your question and press enter to get an immediate response.
        </p>
        <div className="flex gap-2">
          <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Open MJND</button>
          <button onClick={()=>setOpen(false)} className="px-4 py-2 border rounded-lg">Close</button>
        </div>
      </div>

      <AIChatWidget
        isOpen={open}
        onClose={()=>setOpen(false)}
        onToggle={()=>setOpen(v=>!v)}
        software={software}
        
      />
    </div>
  );
};

export default AIChatDemo;
