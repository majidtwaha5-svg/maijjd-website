const initializeSocketHandlers = (io) => {
  console.log('🔌 Initializing Socket.IO handlers...');
  
  io.on('connection', (socket) => {
    console.log('👤 Client connected:', socket.id);
    
    // Join admin room for real-time updates
    socket.on('join-admin', (data) => {
      socket.join('admin-dashboard');
      console.log('👨‍💼 Admin joined dashboard');
    });
    
    // Handle analytics events
    socket.on('analytics-event', (data) => {
      // Broadcast to admin dashboard
      io.to('admin-dashboard').emit('analytics-update', {
        type: 'event',
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle page view tracking
    socket.on('page-view', (data) => {
      io.to('admin-dashboard').emit('analytics-update', {
        type: 'page-view',
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle conversion tracking
    socket.on('conversion', (data) => {
      io.to('admin-dashboard').emit('analytics-update', {
        type: 'conversion',
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle feedback submissions
    socket.on('feedback-submitted', (data) => {
      io.to('admin-dashboard').emit('feedback-update', {
        type: 'new-feedback',
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle invoice updates
    socket.on('invoice-updated', (data) => {
      io.to('admin-dashboard').emit('invoice-update', {
        type: 'invoice-status',
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('👤 Client disconnected:', socket.id);
    });
  });
  
  console.log('✅ Socket.IO handlers initialized');
};

module.exports = { initializeSocketHandlers };
