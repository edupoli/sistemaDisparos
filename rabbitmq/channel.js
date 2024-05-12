const { connect } = require('./connection');

let channel;

async function getChannel() {
  if (!channel) {
    const connection = await connect();
    channel = await connection.createConfirmChannel();
    console.log('Channel created');

    channel.on('error', (err) => {
      console.error('Channel error:', err.message);
      channel = null; // Ensure re-creation of the channel
    });

    channel.on('close', () => {
      console.error('Channel closed. Re-creating...');
      channel = null;
    });
  }
  return channel;
}

module.exports = { getChannel };
